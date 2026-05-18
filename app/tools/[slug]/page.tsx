import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExifViewer } from '@web/pages/tools/ExifViewer';
import { BulkPhotoRenamer } from '@web/pages/tools/BulkPhotoRenamer';
import { DriveFolderGenerator } from '@web/pages/tools/DriveFolderGenerator';
import { NextPublicLayout } from '../../components/NextPublicLayout';

const TOOL_PAGES: Record<string, {
  component: React.FC<any>;
  title: string;
  description: string;
}> = {
  'exif-viewer': {
    component: ExifViewer,
    title: "Free Online EXIF Viewer: Inspect Image Metadata — ImageSnap",
    description: "View hidden EXIF metadata in any image. Inspect camera settings, GPS location, and timestamps for free — no upload required.",
  },
  'bulk-photo-renamer': {
    component: BulkPhotoRenamer,
    title: "Bulk Photo Renamer: Batch Rename Files for Google Drive — ImageSnap",
    description: "Stop renaming photos one by one. ImageSnap captures images with structured metadata at the source — so your files are named correctly from the start, not fixed after the fact.",
  },
  'drive-folder-generator': {
    component: DriveFolderGenerator,
    title: "Google Drive Folder Structure Generator — ImageSnap",
    description: "Automatically generate consistent Google Drive folder structures for every new project, client, or shoot. ImageSnap creates the right folders on first capture — no manual setup required.",
  },
};

export async function generateStaticParams() {
  return Object.keys(TOOL_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = TOOL_PAGES[slug];
  if (!page) return { title: 'Page Not Found' };
  const url = `https://www.imagesnap.cloud/tools/${slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      images: [{ url: 'https://www.imagesnap.cloud/og-image.png' }],
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = TOOL_PAGES[slug];
  if (!page) notFound();

  const Component = page.component;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.imagesnap.cloud' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.imagesnap.cloud/tools' },
      { '@type': 'ListItem', position: 3, name: page.title.split(':')[0], item: `https://www.imagesnap.cloud/tools/${slug}` },
    ],
  };

  return (
    <NextPublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Component />
    </NextPublicLayout>
  );
}
