import type { Metadata } from 'next';
import { GenericSEOPage } from '@web/pages/GenericSEOPage';
import { NextPublicLayout } from '../../components/NextPublicLayout';
import { imagesnapSoftwareSchema } from '../../components/featureSchema';

export const metadata: Metadata = {
  title: "Metadata Auto-fill from Any Webpage — ImageSnap",
  description: "ImageSnap auto-fills product title, price, description, and source URL from the page you're viewing. Skip manual data entry — capture with context pre-filled.",
  alternates: { canonical: "https://www.imagesnap.cloud/features/metadata-auto-fill" },
  openGraph: {
    title: "Metadata Auto-fill from Any Webpage — ImageSnap",
    description: "Auto-fill product title, price, and description from any webpage. Zero manual data entry.",
    url: "https://www.imagesnap.cloud/features/metadata-auto-fill",
    images: [{ url: "https://www.imagesnap.cloud/og-image.png", width: 1200, height: 630 }],
  },
};

export default function MetadataAutoFillPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imagesnapSoftwareSchema) }} />
      <NextPublicLayout>
        <GenericSEOPage
          title="Metadata Auto-fill from Any Webpage — ImageSnap"
          headline="Automatic Metadata Extraction"
          description="When you capture an image, ImageSnap reads the page and pre-fills the context fields — title, price, description, URL. You just confirm and save."
          onLogin={() => { window.location.href = '/'; }}
        />
      </NextPublicLayout>
    </>
  );
}
