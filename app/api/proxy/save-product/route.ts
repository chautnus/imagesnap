import { NextResponse } from "next/server";
import { getConfig } from "@src/db";

export async function POST(request: Request) {
  try {
    const { spreadsheetId, product, adminAccessToken } = await request.json();
    const masterToken = await getConfig('adminAccessToken');
    const token = adminAccessToken || masterToken;

    if (!token) {
      return NextResponse.json({ error: "Admin must be active to proxy saves" }, { status: 401 });
    }

    // Google Sheets API URL
    // Standard ImageSnap save format: [ID, CreatedAt, Images, Name, Tags, AuthID, AuthName, ...dataFields]
    const rowValues = [
      product.id,
      product.createdAt || new Date().toISOString(),
      (product.images || []).join(','),
      product.name,
      (product.tags || []).join(','),
      product.authorId || '',
      product.authorName || '',
      ...Object.values(product.data || {})
    ];

    const range = `${product.categoryName || 'Data'}!A2`;
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ values: [rowValues] })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error((result as any).error?.message || "Proxy error");
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Proxy save error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
