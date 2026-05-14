import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Use Edge Runtime for better payload handling

export async function POST(request: NextRequest) {
  // Server-side fallback (SW failed)
  console.log("Edge share fallback triggered.");
  
  // Try to redirect even if payload is large
  return NextResponse.redirect(new URL('/dashboard?error=sw_not_ready', request.url), 303);
}

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
