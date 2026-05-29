import type { Metadata } from 'next';
import { NextPublicLayout } from '../../components/NextPublicLayout';
import { imagesnapSoftwareSchema } from '../../components/featureSchema';
import WebImageImportClient from './WebImageImportClient';

export const metadata: Metadata = {
  title: "Web Image Import — Capture Any Image to Google Drive | ImageSnap",
  description: "Import images from any website directly to Google Drive with one click. Auto-attach metadata, title, price, and source. No copy-paste, no manual uploads.",
  alternates: { canonical: "https://www.imagesnap.cloud/features/web-image-import" },
  openGraph: {
    title: "Web Image Import — Capture Any Image to Google Drive | ImageSnap",
    description: "Import images from any website directly to Google Drive with one click.",
    url: "https://www.imagesnap.cloud/features/web-image-import",
    images: [{ url: "https://www.imagesnap.cloud/api/og?title=Web+Image+Import&category=features", width: 1200, height: 630 }],
  },
};

export default function WebImageImportPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imagesnapSoftwareSchema) }} />
      <NextPublicLayout>
        <WebImageImportClient />
      </NextPublicLayout>
    </>
  );
}
