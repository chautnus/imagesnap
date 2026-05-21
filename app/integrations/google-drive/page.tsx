import type { Metadata } from 'next';
import { GenericSEOPage } from '@web/pages/GenericSEOPage';
import { NextPublicLayout } from '../../components/NextPublicLayout';
import { imagesnapSoftwareSchema } from '../../components/featureSchema';

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
        <GenericSEOPage
          title="Google Drive Integration — The Best Chrome Extension for Drive | ImageSnap"
          headline="The Best Google Drive Extension"
          description="ImageSnap plugs directly into Google Drive. Every image you capture goes into a structured folder with full metadata logged to Sheets — automatically."
          onLogin={() => { window.location.href = '/'; }}
        />
      </NextPublicLayout>
    </>
  );
}
