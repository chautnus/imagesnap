import type { Metadata } from 'next';
import { NextPublicLayout } from '../../components/NextPublicLayout';
import { imagesnapSoftwareSchema } from '../../components/featureSchema';
import AutoFolderClient from './AutoFolderClient';

export const metadata: Metadata = {
  title: "Auto Folder Organization for Google Drive — ImageSnap",
  description: "ImageSnap auto-creates Google Drive folders by category or project. Stop manually sorting files — structure happens at the moment of capture.",
  alternates: { canonical: "https://www.imagesnap.cloud/features/auto-folder-organization" },
  openGraph: {
    title: "Auto Folder Organization for Google Drive — ImageSnap",
    description: "Automatically create and organize Google Drive folders by category at the moment of capture.",
    url: "https://www.imagesnap.cloud/features/auto-folder-organization",
    images: [{ url: "https://www.imagesnap.cloud/og-image.png", width: 1200, height: 630 }],
  },
};

export default function AutoFolderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imagesnapSoftwareSchema) }} />
      <NextPublicLayout>
        <AutoFolderClient />
      </NextPublicLayout>
    </>
  );
}
