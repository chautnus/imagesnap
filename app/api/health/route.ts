import { NextResponse } from "next/server";

export async function GET() {
  const dbKeys = Object.keys(process.env).filter(k =>
    k.includes('DATABASE') || k.includes('POSTGRES') || k.includes('NEON') || k.includes('PG')
  );
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    db_env_keys: dbKeys,
    has_database_url: !!process.env['DATABASE_URL'],
    has_postgres_url: !!process.env['POSTGRES_URL'],
  });
}
