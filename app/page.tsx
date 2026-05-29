import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: "ImageSnap | Save Images with Context to Google Drive & Sheets",
  description: "Capture any image from the web with custom context fields. Auto-save to Google Drive, log details to Google Sheets. Free plan: 30 captures/month.",
  alternates: { canonical: "https://www.imagesnap.cloud/" },
  openGraph: {
    type: "website",
    title: "ImageSnap | Save Images with Context to Google Drive & Sheets",
    description: "Capture any image from the web with custom context fields. Auto-save to Google Drive, log details to Google Sheets.",
    url: "https://www.imagesnap.cloud/",
    images: [{ url: "https://www.imagesnap.cloud/api/og?title=ImageSnap&category=homepage", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ImageSnap | Save Images with Context to Google Drive & Sheets",
    description: "Capture any image from the web with custom context fields. Auto-save to Google Drive, log details to Google Sheets.",
    images: ["https://www.imagesnap.cloud/api/og?title=ImageSnap&category=homepage"],
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ImageSnap",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, Chrome, Edge",
  "url": "https://www.imagesnap.cloud",
  "description": "Save any image with your designed context. Images in Google Drive, context in Google Sheets. Research once, use forever.",
  "offers": [
    { "@type": "Offer", "price": "0", "priceCurrency": "USD", "name": "Free — 30 captures/month" },
    { "@type": "Offer", "price": "9.99", "priceCurrency": "USD", "name": "Solo — Unlimited captures" }
  ],
  "featureList": [
    "One-click capture: images + designed context from any page",
    "Product images saved to Google Drive",
    "Designed context fields in Google Sheets",
    "Unlimited custom fields per category",
    "Team collaboration",
    "Data ownership — your Drive, your Sheet"
  ],
  "publisher": { "@type": "Organization", "name": "ImageSnap" }
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ImageSnap",
  "url": "https://www.imagesnap.cloud",
  "logo": "https://www.imagesnap.cloud/icon512.png",
  "description": "Save any image with your designed context. Research once, use forever.",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "support@imagesnap.cloud",
    "contactType": "customer support"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What does ImageSnap actually do?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "When you browse a product page, you click the extension. ImageSnap saves the images to your Google Drive and captures the context — title, price, description, source — into your Google Sheet. You can also add your own custom fields to match your workflow."
      }
    },
    {
      "@type": "Question",
      "name": "What is \"designed context\"?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It means you decide what information gets attached to each image. ImageSnap auto-fills what it can from the page, but you can add any custom fields — project name, rating, supplier, status, notes — whatever makes the image useful for your work."
      }
    },
    {
      "@type": "Question",
      "name": "How is this different from just saving screenshots?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Screenshots sit in a folder with no context. A month later, you can't remember the price, the source, or why you saved it. ImageSnap attaches context to every image so it stays useful."
      }
    }
  ]
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomeClient />
    </>
  );
}
