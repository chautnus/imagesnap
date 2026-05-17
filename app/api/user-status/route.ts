import { NextRequest, NextResponse } from "next/server";
import { getSubscription } from "@src/db";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }
  
  try {
    const status = await getSubscription(email);
    return NextResponse.json(status);
  } catch (error: any) {
    console.error("DB connection failed for user-status, using fallback:", error.message);
    // Graceful fallback if DB fails
    return NextResponse.json({
      isPro: false,
      limit: 30,
      usage: 0,
      isAdmin: email.toLowerCase() === 'chautnus@gmail.com' || email.toLowerCase() === 'admin@imagesnap.cloud'
    });
  }
}
