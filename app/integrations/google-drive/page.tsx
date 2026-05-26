import type { Metadata } from 'next';
import { NextPublicLayout } from '../../components/NextPublicLayout';
import { imagesnapSoftwareSchema } from '../../components/featureSchema';
import GoogleDriveClient from './GoogleDriveClient';

export const metadata: Metadata = {
  title: "Google Drive Chrome Extension — ImageSnap Integration",
  description: "Save images from any website directly to Google Drive with custom metadata — all in one click. The best Drive Chrome extension for research teams.",
  alternates: { canonical: "https://www.imagesnap.cloud/integrations/google-drive" },
  openGraph: {
    title: "Google Drive Integration — ImageSnap Chrome Extension",
    description: "Save images from any website directly to Google Drive with structured metadata. The best Drive integration for researchers.",
    url: "https://www.imagesnap.cloud/integrations/google-drive",
    images: [{ url: "https://www.imagesnap.cloud/og-image.png", width: 1200, height: 630 }],
  },
};

export default function GoogleDriveIntegrationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imagesnapSoftwareSchema) }} />
      <NextPublicLayout>
        <GoogleDriveClient />
      </NextPublicLayout>
    </>
  );
}
