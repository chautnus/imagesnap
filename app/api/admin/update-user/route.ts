import { NextResponse } from "next/server";
import { updateUser, getSubscription } from "@src/db";

export async function POST(request: Request) {
  try {
    const { adminEmail, targetEmail, updates } = await request.json();
    
    const status = await getSubscription(adminEmail || "");
    if (!status.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updated = await updateUser(targetEmail, updates);
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("Update user error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
