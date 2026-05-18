import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Nạp an toàn cả .env.local và .env từ đường dẫn tuyệt đối thư mục gốc cho local Express
dotenv.config({ path: path.resolve(projectRoot, '.env.local') });
dotenv.config({ path: path.resolve(projectRoot, '.env') });

const { Pool } = pg;

// Đọc tĩnh chuẩn của Turbopack và tự động lấy biến thích hợp (local & Vercel online)
const rawUrl = process.env.DATABASE_URL || 
               process.env.POSTGRES_URL || 
               process.env.DATABASE_PRIVATE_URL;

// Làm sạch các ký tự điều hướng BOM (\uFEFF) của Windows và khoảng trắng thừa
const DATABASE_URL = rawUrl ? rawUrl.replace(/^\uFEFF/, '').trim() : undefined;

if (!DATABASE_URL) {
  console.warn("WARNING: DATABASE_URL is not set. Database operations will fail.");
}

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

let initPromise: Promise<void> | null = null;

// Hàm bảo đảm DB được khởi tạo tuần tự trước khi chạy bất kỳ câu lệnh nào
export function ensureDbInitialized(): Promise<void> {
  if (!initPromise) {
    initPromise = initDb();
  }
  return initPromise;
}

// Bọc pool.query để tự động đợi việc khởi tạo hoàn tất và kiểm tra kết nối
const originalQuery = pool.query.bind(pool);
pool.query = (async (...args: any[]) => {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured. Please add the DATABASE_URL environment variable to your settings or create a local .env file with your PostgreSQL connection string (DATABASE_URL=postgres://...).");
  }
  await ensureDbInitialized();
  return (originalQuery as any)(...args);
}) as any;

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

    // Self-healing migrations for existing deployments
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS registered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS accessible_categories JSONB DEFAULT '[]'::jsonb`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT`);

    // Config table (for masterSpreadsheetId, etc.)
    await client.query(`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value JSONB
      )
    `);

    // Ensure chautnus@gmail.com is always an admin with 999k limit
    await client.query(`
      UPDATE users 
      SET is_pro = true, is_admin = true, limit_count = 999999, role = 'admin' 
      WHERE email = 'chautnus@gmail.com'
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