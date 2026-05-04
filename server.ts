/**
 * MAIN SERVER ENTRY POINT
 * Deployment Force Refresh: 2026-05-03T00:00:00Z
 */
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import crypto from "crypto";
import fs from "fs";
import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { mockUserDb, saveDb, getSubscription } from "./src/db.js";

console.log(">>> ImageSnap Production Server starting...");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8080;

  const LS_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
  const LS_WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (LS_API_KEY) lemonSqueezySetup({ apiKey: LS_API_KEY });

  // CORS
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (origin.startsWith('chrome-extension://') || origin.startsWith('extension://') || origin.startsWith('ms-browser-extension://'))) {
      res.header("Access-Control-Allow-Origin", origin);
    } else {
      res.header("Access-Control-Allow-Origin", "*");
    }
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-signature");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === 'OPTIONS') return res.status(200).send();
    next();
  });

  app.use(express.json({
    verify: (req: any, _res, buf) => { req.rawBody = buf; }
  }));

  // --- USER ROUTES ---

  app.get("/api/user-status", async (req, res) => {
    const email = req.query.email as string;
    if (!email) return res.status(400).json({ error: "Email required" });
    res.json(await getSubscription(email));
  });

  app.post("/api/increment-usage", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    const status = await getSubscription(email);
    status.usage = (status.usage || 0) + 1;
    saveDb();
    res.json(status);
  });

  // --- ADMIN ROUTES ---

  app.get("/api/admin/users", async (req, res) => {
    const adminEmail = req.query.adminEmail as string;
    const status = await getSubscription(adminEmail || "");
    if (!status.isAdmin) return res.status(403).json({ error: "Unauthorized" });
    res.json(mockUserDb.users);
  });

  app.post("/api/admin/update-user", async (req, res) => {
    const { adminEmail, targetEmail, updates } = req.body;
    const status = await getSubscription(adminEmail || "");
    if (!status.isAdmin) return res.status(403).json({ error: "Unauthorized" });
    if (!mockUserDb.users[targetEmail]) {
      mockUserDb.users[targetEmail] = { isPro: false, limit: 30, usage: 0, role: 'user', appId: crypto.randomUUID(), registeredAt: new Date().toISOString() };
    }
    mockUserDb.users[targetEmail] = { ...mockUserDb.users[targetEmail], ...updates };
    saveDb();
    res.json(mockUserDb.users[targetEmail]);
  });

  app.post("/api/admin/delete-user", async (req, res) => {
    const { adminEmail, targetEmail } = req.body;
    const status = await getSubscription(adminEmail || "");
    if (!status.isAdmin) return res.status(403).json({ error: "Unauthorized" });
    delete mockUserDb.users[targetEmail];
    saveDb();
    res.json({ success: true });
  });

  // --- STAFF & PROXY ROUTES ---

  app.post("/api/admin/set-master-workspace", async (req, res) => {
    const { adminEmail, spreadsheetId, accessToken } = req.body;
    const status = await getSubscription(adminEmail || "");
    if (!status.isAdmin) return res.status(403).json({ error: "Unauthorized" });
    mockUserDb.config.masterSpreadsheetId = spreadsheetId;
    mockUserDb.config.adminAccessToken = accessToken;
    saveDb();
    res.json({ success: true });
  });

  app.post("/api/auth/staff-login", async (req, res) => {
    const { username, password } = req.body;
    const userEntry = Object.values(mockUserDb.users).find((u: any) => u.username === username && u.password === password);
    if (!userEntry) return res.status(401).json({ error: "Invalid credentials" });
    res.json({ success: true, user: userEntry, masterSpreadsheetId: mockUserDb.config.masterSpreadsheetId });
  });

  app.post("/api/proxy/save-product", async (req, res) => {
    const { spreadsheetId, product, adminAccessToken } = req.body;
    const token = adminAccessToken || mockUserDb.config.adminAccessToken;
    if (!token) return res.status(401).json({ error: "Admin must be active to proxy saves" });
    try {
      const range = `${product.categoryName || 'Data'}!A2`;
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [Object.values(product)] })
      });
      const result = await response.json();
      if (!response.ok) throw new Error((result as any).error?.message || "Proxy error");
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- PAYMENT ROUTES ---

  app.post("/api/create-checkout-session", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID;
    if (!storeId || !variantId) return res.status(500).json({ error: "Lemon Squeezy config missing" });
    try {
      const { data, error } = await createCheckout(storeId, variantId, {
        checkoutData: { email },
        productOptions: { redirectUrl: `${process.env.APP_URL || "https://www.imagesnap.cloud"}?success=true` },
      });
      if (error) throw error;
      res.json({ url: data?.data.attributes.url });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/webhook/lemonsqueezy", async (req: any, res) => {
    const hmac = crypto.createHmac("sha256", LS_WEBHOOK_SECRET || "");
    const digest = hmac.update(req.rawBody).digest("hex");
    if (digest !== req.headers["x-signature"]) return res.status(401).send("Invalid signature");
    const { meta: { event_name }, data: { attributes: { user_email: email } } } = req.body;
    if (event_name === "order_created" || event_name === "subscription_created") {
      mockUserDb.users[email] = { ...mockUserDb.users[email], isPro: true, limit: 999999, updatedAt: new Date().toISOString() };
      saveDb();
      console.log(`User ${email} upgraded to PRO`);
    }
    res.status(200).send("OK");
  });

  // --- UTILITY ROUTES ---

  app.get("/api/health", (_req, res) => res.status(200).send("OK"));

  app.get("/api/debug/dist", (_req, res) => {
    const distPath = path.join(process.cwd(), "dist");
    const exists = fs.existsSync(distPath);
    res.json({ exists, files: exists ? fs.readdirSync(distPath) : [], cwd: process.cwd(), env: process.env.NODE_ENV, port: PORT });
  });

  // --- VITE / STATIC ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      configFile: "vite.web.config.ts",
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
