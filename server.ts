/**
 * MAIN SERVER ENTRY POINT
 * Deployment Force Refresh: 2026-04-23T23:39:40Z
 */
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

console.log(">>> ImageSnap Production Server starting on server.ts (Node 18+ Compatible)...");

import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import crypto from "crypto";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock Database for demo/session purposes
const DB_PATH = path.join(process.cwd(), "user_db.json");
let mockUserDb: Record<string, any> = {};

if (fs.existsSync(DB_PATH)) {
  try {
    mockUserDb = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch (e) {
    mockUserDb = { users: {}, config: {} };
  }
} else {
  mockUserDb = { users: {}, config: {} };
}

function saveDb() {
  fs.writeFileSync(DB_PATH, JSON.stringify(mockUserDb, null, 2));
}

async function getSubscription(email: string) {
  if (!mockUserDb.users[email]) {
    // First user or specific email can be admin
    const isFirst = Object.keys(mockUserDb.users).length === 0;
    const adminEmails = ["chautnus@gmail.com", "admin@imagesnap.cloud"];
    const isAdmin = isFirst || adminEmails.includes(email.toLowerCase());
    
    mockUserDb.users[email] = { 
      isPro: isAdmin, 
      isAdmin: isAdmin,
      limit: isAdmin ? 999999 : 30, 
      usage: 0,
      role: isAdmin ? 'admin' : 'user'
    };
    saveDb();
  }
  return mockUserDb.users[email];
}

async function startServer() {
  const app = express();
  
  // CORS Middleware
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Explicitly allow extension origins
    if (origin && (origin.startsWith('chrome-extension://') || origin.startsWith('extension://') || origin.startsWith('ms-browser-extension://'))) {
      res.header("Access-Control-Allow-Origin", origin);
    } else {
      res.header("Access-Control-Allow-Origin", "*");
    }
    
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-signature");
    res.header("Access-Control-Allow-Credentials", "true");
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).send();
    }
    next();
  });

  const PORT = Number(process.env.PORT) || 8080;

  // Middleware for parsing raw body (needed for webhooks)
  app.use(express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    }
  }));

  // Lemon Squeezy Config
  const LS_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
  const LS_WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

  if (LS_API_KEY) {
    lemonSqueezySetup({ apiKey: LS_API_KEY });
  }

  // --- API ROUTES ---

  app.get("/api/user-status", async (req, res) => {
    const email = req.query.email as string;
    if (!email) return res.status(400).json({ error: "Email required" });
    const status = await getSubscription(email);
    res.json(status);
  });
  
  app.post("/api/increment-usage", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    
    const status = await getSubscription(email);
    if (!status.isPro) {
      status.usage = (status.usage || 0) + 1;
      saveDb();
    }
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
      mockUserDb.users[targetEmail] = { isPro: false, limit: 1, usage: 0, role: 'user' };
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
    mockUserDb.config.adminAccessToken = accessToken; // Note: expires, but used for immediate proxy
    saveDb();
    res.json({ success: true });
  });

  app.post("/api/auth/staff-login", async (req, res) => {
    const { username, password } = req.body;
    const userEntry = Object.values(mockUserDb.users).find((u: any) => u.username === username && u.password === password);
    
    if (!userEntry) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ 
      success: true, 
      user: userEntry,
      masterSpreadsheetId: mockUserDb.config.masterSpreadsheetId
    });
  });

  app.post("/api/proxy/save-product", async (req, res) => {
    const { spreadsheetId, product, base64Images, adminAccessToken } = req.body;
    
    // In a real app, we'd use a persistent Refresh Token. 
    // Here we use the token passed from the client (Admin or Staff using Admin's token cached on server)
    const token = adminAccessToken || mockUserDb.config.adminAccessToken;
    
    if (!token) return res.status(401).json({ error: "Admin must be active to proxy saves" });

    try {
      // 1. Upload images to Admin's Drive
      // This part would normally call Google Drive API. 
      // For simplicity in this proxy, we'll assume the client does the heavy lifting or we forward the request.
      // Since client-side code is already written for Drive, we'll focus on the Sheets append proxy.
      
      const range = `${product.categoryName || 'Data'}!A2`;
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: [Object.values(product)] })
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "Proxy error");
      
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/create-checkout-session", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID;

    if (!storeId || !variantId) {
      return res.status(500).json({ error: "Lemon Squeezy config missing" });
    }

    try {
      const { data, error } = await createCheckout(storeId, variantId, {
        checkoutData: { email },
        productOptions: {
          redirectUrl: `${process.env.APP_URL || "https://www.imagesnap.cloud"}?success=true`,
        },
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
    const signature = req.headers["x-signature"];

    if (digest !== signature) {
      return res.status(401).send("Invalid signature");
    }

    const payload = req.body;
    const eventName = payload.meta.event_name;
    const email = payload.data.attributes.user_email;

    if (eventName === "order_created" || eventName === "subscription_created") {
      mockUserDb.users[email] = {
        ...mockUserDb.users[email],
        isPro: true,
        limit: 999999,
        updatedAt: new Date().toISOString()
      };
      console.log(`User ${email} upgraded to PRO (Mock DB)`);
    }

    res.status(200).send("OK");
  });

  // --- VITE MIDDLEWARE ---

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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> Server running on http://0.0.0.0:${PORT} (Node 18+ Compatible)`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
