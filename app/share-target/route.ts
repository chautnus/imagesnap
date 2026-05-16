import { NextRequest, NextResponse } from 'next/server';

/**
 * SERVER-SIDE FALLBACK FOR WEB SHARE TARGET
 * This route is only reached if the Service Worker fails to intercept the POST request.
 * Since we cannot write to the client's IndexedDB from here, we redirect to the dashboard
 * with an error flag so the user can be prompted to reload and activate the SW.
 */
export async function POST(req: NextRequest) {
  console.warn('[SHARE_TARGET] Server-side fallback triggered. SW was likely inactive.');
  
  // We return a 303 See Other to force the browser to perform a GET request to the dashboard.
  return NextResponse.redirect(new URL('/dashboard?error=sw_missing', req.url), 303);
}

// Handle GET requests just in case
export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/dashboard', req.url), 303);
}
