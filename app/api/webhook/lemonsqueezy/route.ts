import { NextResponse } from "next/server";
import crypto from "crypto";
import { updateUser } from "@src/db";

export async function POST(request: Request) {
  const LS_WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature");

    if (LS_WEBHOOK_SECRET && signature) {
      const hmac = crypto.createHmac("sha256", LS_WEBHOOK_SECRET);
      const digest = hmac.update(rawBody).digest("hex");
      if (digest !== signature) {
        return new Response("Invalid signature", { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const email = payload.data.attributes.user_email;

    if (eventName === "order_created" || eventName === "subscription_created") {
      await updateUser(email, { isPro: true, limit: 999999 });
      console.log(`User ${email} upgraded to PRO via webhook`);
    }

    return new Response("OK", { status: 200 });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return new Response(err.message, { status: 500 });
  }
}
