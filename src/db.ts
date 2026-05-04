import fs from "fs";
import path from "path";
import crypto from "crypto";

export const DB_PATH = path.join(process.cwd(), "user_db.json");
export let mockUserDb: Record<string, any> = {};

if (fs.existsSync(DB_PATH)) {
  try {
    mockUserDb = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch {
    mockUserDb = { users: {}, config: {} };
  }
} else {
  mockUserDb = { users: {}, config: {} };
}

export function saveDb() {
  fs.writeFileSync(DB_PATH, JSON.stringify(mockUserDb, null, 2));
}

const ADMIN_EMAILS = ["chautnus@gmail.com", "support@imagesnap.cloud"];

export async function getSubscription(email: string) {
  if (!mockUserDb.users[email]) {
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    mockUserDb.users[email] = {
      isPro: isAdmin,
      isAdmin,
      limit: isAdmin ? 999999 : 30,
      usage: 0,
      role: isAdmin ? "admin" : "user",
      appId: crypto.randomUUID(),
      registeredAt: new Date().toISOString(),
    };
    saveDb();
  }

  // Backfill appId for existing users who don't have one
  if (!mockUserDb.users[email].appId) {
    mockUserDb.users[email].appId = crypto.randomUUID();
    saveDb();
  }

  return mockUserDb.users[email];
}
