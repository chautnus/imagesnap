import type { Metadata } from 'next';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
  title: "Pricing — ImageSnap | Free & $19/mo Plans",
  description: "Start free with 30 captures/month. Upgrade to Solo at $19/mo for unlimited captures, categories, and Google Drive & Sheets sync.",
  alternates: { canonical: "https://www.imagesnap.cloud/pricing" },
};

export default function Pricing() {
  return <PricingClient />;
}
