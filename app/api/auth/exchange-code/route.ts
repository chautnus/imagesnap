import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encryptToken } from "@shared/lib/token-crypto";
import { pool } from "@src/db-postgres";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, redirectUri } = body;

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirect_uri = redirectUri;

    // 3. POST https://oauth2.googleapis.com/token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirect_uri || '',
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    // 4. Check for errors
    if (!tokenRes.ok || !tokenData.access_token) {
      return NextResponse.json(
        { error: tokenData.error_description || tokenData.error || "Failed to exchange code" },
        { status: 401 }
      );
    }

    const accessToken = tokenData.access_token;

    // 6. Get email from userinfo
    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userData = await userRes.json();
    const email = userData.email;

    if (!email) {
      return NextResponse.json({ error: "Could not retrieve user email" }, { status: 401 });
    }

    // 5. Encrypt and save refresh_token if provided by Google
    if (tokenData.refresh_token) {
      const { ciphertext, iv } = encryptToken(tokenData.refresh_token);
      await pool.query(
        `INSERT INTO users (email, google_refresh_token, google_refresh_token_iv)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO UPDATE SET
           google_refresh_token = EXCLUDED.google_refresh_token,
           google_refresh_token_iv = EXCLUDED.google_refresh_token_iv`,
        [email, ciphertext, iv]
      );
    } else {
      // User consented previously; ensure user entry exists without overwriting existing refresh token
      await pool.query(
        `INSERT INTO users (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`,
        [email]
      );
    }

    // 7. Set cookie "imagesnap_session" without raw token
    const cookieStore = await cookies();
    const sessionPayload = JSON.stringify({
      email,
      role: 'user',
      masterSpreadsheetId: null,
      expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });
    const encodedSession = Buffer.from(sessionPayload).toString('base64');

    cookieStore.set("imagesnap_session", encodedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    // 8. Return JSON { success: true, access_token, email }
    return NextResponse.json({ success: true, access_token: accessToken, email });
  } catch (error: any) {
    console.error("Exchange code failed:", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
