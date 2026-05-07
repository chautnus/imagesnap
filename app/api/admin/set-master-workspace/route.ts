import { NextResponse } from "next/server";
import { setConfig, getSubscription } from "@src/db";

export async function POST(request: Request) {
  try {
    const { adminEmail, spreadsheetId, accessToken } = await request.json();
    
    const status = await getSubscription(adminEmail || "");
    if (!status.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (spreadsheetId) await setConfig('masterSpreadsheetId', spreadsheetId);
    if (accessToken) await setConfig('adminAccessToken', accessToken);
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Set master workspace error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
