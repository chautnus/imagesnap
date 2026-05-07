import { NextResponse } from "next/server";
import { getAllUsers, getConfig } from "@src/db";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const users = await getAllUsers();
    
    const userEntry = Object.values(users).find(
      (u: any) => u.username === username && u.password === password
    );

    if (!userEntry) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const masterSpreadsheetId = await getConfig('masterSpreadsheetId');
    
    return NextResponse.json({ 
      success: true, 
      user: userEntry, 
      masterSpreadsheetId 
    });
  } catch (err: any) {
    console.error("Staff login error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
