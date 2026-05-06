import crypto from "crypto";
import { pool } from "./db-postgres.js";

const ADMIN_EMAILS = ["chautnus@gmail.com", "support@imagesnap.cloud"];

export async function getSubscription(email: string) {
  if (!email) return null;
  
  const normalizedEmail = email.toLowerCase();
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
  
  if (res.rows.length === 0) {
    const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);
    const appId = crypto.randomUUID();
    const newUser = await pool.query(
      `INSERT INTO users (email, is_pro, is_admin, limit_count, usage_count, role, app_id, registered_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
       RETURNING *`,
      [normalizedEmail, isAdmin, isAdmin, isAdmin ? 999999 : 30, 0, isAdmin ? "admin" : "user", appId]
    );
    return mapUser(newUser.rows[0]);
  }

  const user = res.rows[0];
  
  // Backfill appId if missing
  if (!user.app_id) {
    const appId = crypto.randomUUID();
    const updated = await pool.query('UPDATE users SET app_id = $1 WHERE email = $2 RETURNING *', [appId, normalizedEmail]);
    return mapUser(updated.rows[0]);
  }

  return mapUser(user);
}

// Helper to map DB fields to the structure expected by the frontend
function mapUser(dbUser: any) {
  return {
    email: dbUser.email,
    isPro: dbUser.is_pro,
    isAdmin: dbUser.is_admin,
    limit: dbUser.limit_count,
    usage: dbUser.usage_count,
    role: dbUser.role,
    appId: dbUser.app_id,
    registeredAt: dbUser.registered_at,
    accessibleCategories: dbUser.accessible_categories,
    username: dbUser.username,
    password: dbUser.password
  };
}

// Added these for compatibility and new async flow
export async function getAllUsers() {
  const res = await pool.query('SELECT * FROM users ORDER BY registered_at DESC');
  const users: Record<string, any> = {};
  res.rows.forEach(row => {
    users[row.email] = mapUser(row);
  });
  return users;
}

export async function updateUser(email: string, updates: any) {
  const user = await getSubscription(email);
  if (!user) return null;

  // Map updates to DB column names if necessary, or just handle key fields
  const fields = [];
  const values = [];
  let i = 1;

  if (updates.isPro !== undefined) { fields.push(`is_pro = $${i++}`); values.push(updates.isPro); }
  if (updates.isAdmin !== undefined) { fields.push(`is_admin = $${i++}`); values.push(updates.isAdmin); }
  if (updates.limit !== undefined) { fields.push(`limit_count = $${i++}`); values.push(updates.limit); }
  if (updates.usage !== undefined) { fields.push(`usage_count = $${i++}`); values.push(updates.usage); }
  if (updates.role !== undefined) { fields.push(`role = $${i++}`); values.push(updates.role); }
  if (updates.accessibleCategories !== undefined) { fields.push(`accessible_categories = $${i++}`); values.push(JSON.stringify(updates.accessibleCategories)); }
  if (updates.username !== undefined) { fields.push(`username = $${i++}`); values.push(updates.username); }
  if (updates.password !== undefined) { fields.push(`password = $${i++}`); values.push(updates.password); }

  if (fields.length === 0) return user;

  values.push(email.toLowerCase());
  const query = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE email = $${i} RETURNING *`;
  const res = await pool.query(query, values);
  return mapUser(res.rows[0]);
}

export async function deleteUser(email: string) {
  await pool.query('DELETE FROM users WHERE email = $1', [email.toLowerCase()]);
}

export async function getConfig(key: string) {
  const res = await pool.query('SELECT value FROM config WHERE key = $1', [key]);
  return res.rows[0]?.value;
}

export async function setConfig(key: string, value: any) {
  await pool.query(
    'INSERT INTO config (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
    [key, JSON.stringify(value)]
  );
}

// mockUserDb and saveDb are now legacy/dummy
export const mockUserDb = { users: {}, config: {} };
export function saveDb() { /* No-op in Postgres */ }
