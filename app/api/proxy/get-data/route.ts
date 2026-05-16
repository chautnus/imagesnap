import { NextResponse } from 'next/server';
import { getConfig, getSubscription } from '@src/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { spreadsheetId, path, range } = await request.json();
    
    // Auth Check
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('imagesnap_session');
    if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const sessionData = JSON.parse(sessionCookie.value);
    const user = await getSubscription(sessionData.email);
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (!spreadsheetId) {
      return NextResponse.json({ error: "Missing spreadsheetId" }, { status: 400 });
    }

    const masterToken = await getConfig('adminAccessToken');
    if (!masterToken) {
      return NextResponse.json({ error: "Admin must be active to proxy reads" }, { status: 401 });
    }

    // Support both direct path or range-based value requests
    let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
    if (range) {
      url += `/values/${range}`;
    } else if (path) {
      url += `/${path}`;
    }
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${masterToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Proxy read error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
