import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, token, isStaff, role, masterSpreadsheetId } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const cookieStore = await cookies();

    // Create session payload
    const sessionPayload = JSON.stringify({
      email,
      role: role || (isStaff ? 'staff' : 'user'),
      token,
      masterSpreadsheetId: masterSpreadsheetId || null,
      expires: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Encrypt or encode the payload (for now, base64 as a placeholder, in prod use Jose or Iron-Session)
    // We are trusting the frontend GSI validation for this exercise.
    const encodedSession = Buffer.from(sessionPayload).toString('base64');

    cookieStore.set("imagesnap_session", encodedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session creation failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("imagesnap_session");

  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const payload = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf8'));
    if (payload.expires < Date.now()) {
      cookieStore.delete("imagesnap_session");
      return NextResponse.json({ authenticated: false, reason: "expired" }, { status: 401 });
    }
    // Rolling renewal: extend session on each use
    const renewed = { ...payload, expires: Date.now() + 30 * 24 * 60 * 60 * 1000 };
    cookieStore.set("imagesnap_session", Buffer.from(JSON.stringify(renewed)).toString('base64'), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    return NextResponse.json({ authenticated: true, user: payload });
  } catch (e) {
    return NextResponse.json({ authenticated: false, reason: "invalid" }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("imagesnap_session");
  return NextResponse.json({ success: true });
}
