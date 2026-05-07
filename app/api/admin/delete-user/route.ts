import { NextResponse } from "next/server";
import { deleteUser, getSubscription } from "@src/db";

export async function POST(request: Request) {
  try {
    const { adminEmail, targetEmail } = await request.json();
    
    const status = await getSubscription(adminEmail || "");
    if (!status.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await deleteUser(targetEmail);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete user error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
