import { NextRequest, NextResponse } from "next/server";
import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

const LS_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
if (LS_API_KEY) lemonSqueezySetup({ apiKey: LS_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID;
    
    if (!storeId || !variantId) {
      return NextResponse.json({ error: "Lemon Squeezy config missing" }, { status: 500 });
    }

    const { data, error } = await createCheckout(storeId, variantId, {
      checkoutData: { email },
      productOptions: { 
        redirectUrl: `${process.env.APP_URL || "https://www.imagesnap.cloud"}?success=true` 
      },
    });

    if (error) throw error;
    return NextResponse.json({ url: data?.data.attributes.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
