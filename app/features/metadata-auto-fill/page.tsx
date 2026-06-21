import type { Metadata } from 'next';
import { NextPublicLayout } from '../../components/NextPublicLayout';
import { imagesnapSoftwareSchema } from '../../components/featureSchema';
import MetadataAutoFillClient from './MetadataAutoFillClient';

export const metadata: Metadata = {
  title: "Metadata Auto-fill from Any Webpage — ImageSnap",
  description: "ImageSnap auto-fills product title, price, description, and source URL from the page you're viewing. Skip manual data entry — capture with context pre-filled.",
  alternates: { canonical: "https://www.imagesnap.cloud/features/metadata-auto-fill" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Metadata Auto-fill from Any Webpage — ImageSnap",
    description: "Auto-fill product title, price, and description from any webpage. Zero manual data entry.",
    url: "https://www.imagesnap.cloud/features/metadata-auto-fill",
    images: [{ url: "https://www.imagesnap.cloud/api/og?title=Metadata+Auto-fill&category=features", width: 1200, height: 630 }],
  },
};

export default function MetadataAutoFillPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imagesnapSoftwareSchema) }} />
      <NextPublicLayout>
        <MetadataAutoFillClient />
      </NextPublicLayout>
    </>
  );
}
