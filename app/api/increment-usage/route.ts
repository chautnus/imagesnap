import { NextRequest, NextResponse } from "next/server";
import { getSubscription, updateUser } from "@src/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }
    
    const status = await getSubscription(email);
    if (!status) {
       return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const updated = await updateUser(email, { usage: (status.usage || 0) + 1 });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
