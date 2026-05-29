import type { Metadata } from 'next';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
  title: "Pricing — ImageSnap | Free & $9.99/mo Plans",
  description: "Start free with 30 captures/month. Upgrade to Solo at $9.99/mo for unlimited captures, categories, and Google Drive & Sheets sync.",
  alternates: { canonical: "https://www.imagesnap.cloud/pricing" },
  openGraph: {
    title: "Pricing — ImageSnap | Free & $9.99/mo Plans",
    description: "Start free with 30 captures/month. Upgrade to Solo at $9.99/mo for unlimited captures.",
    url: "https://www.imagesnap.cloud/pricing",
    images: [{ url: "https://www.imagesnap.cloud/api/og?title=Pricing+%E2%80%94+ImageSnap&category=pricing", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — ImageSnap | Free & $9.99/mo Plans",
    images: ["https://www.imagesnap.cloud/api/og?title=Pricing+%E2%80%94+ImageSnap&category=pricing"],
  },
};

const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ImageSnap",
  "applicationCategory": "BusinessApplication",
  "url": "https://www.imagesnap.cloud",
  "offers": [
    {
      "@type": "Offer",
      "name": "Free",
      "price": "0",
      "priceCurrency": "USD",
      "description": "30 captures/month, Google Drive & Sheets sync",
      "eligibleDuration": { "@type": "QuantitativeValue", "value": 1, "unitCode": "MON" }
    },
    {
      "@type": "Offer",
      "name": "Solo",
      "price": "9.99",
      "priceCurrency": "USD",
      "description": "Unlimited captures, unlimited categories, Google Drive & Sheets sync",
      "eligibleDuration": { "@type": "QuantitativeValue", "value": 1, "unitCode": "MON" }
    }
  ]
};

export default function Pricing() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }} />
      <PricingClient />
    </>
  );
}
