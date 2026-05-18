import { NextResponse } from "next/server";
import { getAllUsers, getSubscription } from "@src/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminEmail = searchParams.get("adminEmail");

    if (!adminEmail) {
      return NextResponse.json({ error: "Admin Email required" }, { status: 400 });
    }

    const status = await getSubscription(adminEmail);
    if (!status || !status.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (err: any) {
    console.error("GET users error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
