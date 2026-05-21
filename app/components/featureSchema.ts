/** Shared JSON-LD schema for feature and integration pages */
export const imagesnapSoftwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ImageSnap",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, Chrome, Edge",
  "url": "https://www.imagesnap.cloud",
  "offers": [
    { "@type": "Offer", "price": "0", "priceCurrency": "USD", "name": "Free — 30 captures/month" },
    { "@type": "Offer", "price": "19", "priceCurrency": "USD", "name": "Solo — Unlimited captures" },
  ],
  "publisher": { "@type": "Organization", "name": "ImageSnap", "url": "https://www.imagesnap.cloud" },
};
