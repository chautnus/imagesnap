import pg from 'pg';
const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn("WARNING: DATABASE_URL is not set. Database operations will fail.");
}

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function initDb() {
  if (!DATABASE_URL) return;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        is_pro BOOLEAN DEFAULT FALSE,
        is_admin BOOLEAN DEFAULT FALSE,
        limit_count INTEGER DEFAULT 30,
        usage_count INTEGER DEFAULT 0,
        role TEXT DEFAULT 'user',
        app_id TEXT,
        registered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        accessible_categories JSONB DEFAULT '[]'::jsonb,
        username TEXT,
        password TEXT
      )
    `);

    // Config table (for masterSpreadsheetId, etc.)
    await client.query(`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value JSONB
      )
    `);

    await client.query('COMMIT');
    console.log(">>> PostgreSQL Database initialized successfully.");
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(">>> PostgreSQL Database initialization failed:", e);
    throw e;
  } finally {
    client.release();
  }
}

initDb().catch(err => console.error('Immediate initDb failed:', err));