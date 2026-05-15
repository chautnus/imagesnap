import { NextResponse } from "next/server";
import { getConfig } from "@src/db";
import { saveProduct } from "@shared/services/productService";
import { fetchAllAppData } from "@shared/services/dataService";

export async function POST(request: Request) {
  try {
    const { spreadsheetId, product, base64Images, adminAccessToken } = await request.json();
    const masterToken = await getConfig('adminAccessToken');
    const token = adminAccessToken || masterToken;

    if (!token) {
      return NextResponse.json({ error: "Admin must be active to proxy saves" }, { status: 401 });
    }

    // Fetch categories to get field mapping
    // We pass the token to ensure we can read the spreadsheet
    const appData = await fetchAllAppData(spreadsheetId, token);
    
    const result = await saveProduct(
      spreadsheetId,
      product,
      base64Images || [],
      appData.categories,
      product.authorId,
      product.authorName,
      token
    );

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    console.error("Proxy save error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
