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
    mockUserDb = {};
  }
}

function saveDb() {
  fs.writeFileSync(DB_PATH, JSON.stringify(mockUserDb, null, 2));
}

async function getSubscription(email: string) {
  if (!mockUserDb[email]) {
    mockUserDb[email] = { isPro: false, limit: 30, usage: 0 };
    saveDb();
  }
  return mockUserDb[email];
}

async function startServer() {
  const app = express();
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
          redirectUrl: `${process.env.APP_URL || "https://imagesnap.cloud"}?success=true`,
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
      mockUserDb[email] = {
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
