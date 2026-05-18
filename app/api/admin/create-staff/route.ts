import { NextResponse } from "next/server";
import { getSubscription } from "@src/db";
import { pool } from "@src/db-postgres";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { adminEmail, username, password } = await request.json();
    
    // 1. Xác thực quyền Admin
    const status = await getSubscription(adminEmail || "");
    if (!status || !status.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const email = `${username.toLowerCase()}@staff.imagesnap`;
    
    // 2. Kiểm tra tài khoản đã tồn tại chưa
    const checkRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkRes.rows.length > 0) {
      return NextResponse.json({ error: "Staff account already exists" }, { status: 409 });
    }

    // 3. Tạo tài khoản Staff mới nguyên tử và bọc ngoặc kép cột "role"
    const appId = crypto.randomUUID();
    const newUser = await pool.query(
      `INSERT INTO users (email, is_pro, is_admin, limit_count, usage_count, "role", app_id, username, password, registered_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) 
       RETURNING *`,
      [email, true, false, 999999, 0, 'staff', appId, username, password]
    );

    return NextResponse.json({ success: true, user: newUser.rows[0] });
  } catch (err: any) {
    console.error("Create staff error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
