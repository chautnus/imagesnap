import type { Metadata } from 'next';
import AlternativeShell from './AlternativeShell';

export const metadata: Metadata = {
  title: "Best CompanyCam Alternative for Teams Using Google Drive | ImageSnap",
  description: "Looking for a CompanyCam alternative? ImageSnap syncs field photos directly to Google Drive with structured metadata. No proprietary lock-in, no per-seat fees.",
  alternates: { canonical: "https://www.imagesnap.cloud/alternatives/companycam-alternative" },
  openGraph: {
    title: "Best CompanyCam Alternative for Teams Using Google Drive | ImageSnap",
    description: "Looking for a CompanyCam alternative? ImageSnap syncs field photos directly to Google Drive with structured metadata.",
    url: "https://www.imagesnap.cloud/alternatives/companycam-alternative",
    images: [{ url: "https://www.imagesnap.cloud/og-image.png" }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.imagesnap.cloud" },
    { "@type": "ListItem", "position": 2, "name": "Alternatives", "item": "https://www.imagesnap.cloud/alternatives" },
    { "@type": "ListItem", "position": 3, "name": "CompanyCam Alternative", "item": "https://www.imagesnap.cloud/alternatives/companycam-alternative" }
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AlternativeShell />
    </>
  );
}
