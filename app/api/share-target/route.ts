import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // This is a fallback for when the Service Worker fails to intercept the Share Target request.
  // Since we can't easily save large blobs to IndexedDB from the server-side fallback 
  // without a complex session, we redirect back to dashboard with a hint.
  
  console.log("Server-side share fallback triggered. SW interception failed.");
  
  // Return a 303 redirect to Dashboard as per PWA spec
  return NextResponse.redirect(new URL('/dashboard?error=sw_interception_failed', request.url), 303);
}

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
