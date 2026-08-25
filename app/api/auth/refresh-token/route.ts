import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decryptToken } from "@shared/lib/token-crypto";
import { pool } from "@src/db-postgres";

export async function GET(req: NextRequest) {
  try {
    // 1. Read session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("imagesnap_session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "no_session" }, { status: 401 });
    }

    let payload: any;
    try {
      payload = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString("utf8"));
      if (!payload?.email || (payload.expires && payload.expires < Date.now())) {
        return NextResponse.json({ error: "no_session" }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: "no_session" }, { status: 401 });
    }

    const email = payload.email;

    // 2. Query DB for refresh_token
    const result = await pool.query(
      "SELECT google_refresh_token, google_refresh_token_iv FROM users WHERE email = $1",
      [email]
    );

    // 3. If missing, return 401 no_refresh_token
    if (
      result.rows.length === 0 ||
      !result.rows[0].google_refresh_token ||
      !result.rows[0].google_refresh_token_iv
    ) {
      return NextResponse.json({ error: "no_refresh_token" }, { status: 401 });
    }

    // 4. Decrypt refresh_token
    let refreshToken: string;
    try {
      refreshToken = decryptToken(
        result.rows[0].google_refresh_token,
        result.rows[0].google_refresh_token_iv
      );
    } catch (e) {
      console.error("Failed to decrypt refresh token:", e);
      return NextResponse.json({ error: "no_refresh_token" }, { status: 401 });
    }

    const clientId =
      process.env.GOOGLE_CLIENT_ID ||
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      process.env.VITE_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    // 5. POST to Google token endpoint
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId || "",
        client_secret: clientSecret || "",
      }),
    });

    const tokenData = await tokenRes.json();

    // 6. Handle Google errors (invalid_grant)
    if (!tokenRes.ok || tokenData.error === "invalid_grant") {
      await pool.query(
        "UPDATE users SET google_refresh_token = NULL, google_refresh_token_iv = NULL WHERE email = $1",
        [email]
      );
      return NextResponse.json({ error: "refresh_revoked" }, { status: 401 });
    }

    if (!tokenData.access_token) {
      return NextResponse.json({ error: "failed_to_refresh" }, { status: 401 });
    }

    // 7. Return JSON { access_token, expires_in }
    return NextResponse.json({
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
    });
  } catch (error: any) {
    console.error("Refresh token error:", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
