import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ToolsClient } from './ToolsClient';

const TOOLS_PAGES: Record<string, {
  title: string;
  description: string;
}> = {
  'exif-viewer': {
    title: "Free Online EXIF Viewer: Inspect Image Metadata — ImageSnap",
    description: "View hidden EXIF metadata in any image. Inspect camera settings, GPS location, and timestamps for free.",
  },
  'bulk-photo-renamer': {
    title: "Bulk Photo Renamer: Batch Rename Files Online — ImageSnap",
    description: "Rename hundreds of photos in seconds based on custom rules, dates, or metadata. Keep your Google Drive organized.",
  },
  'drive-folder-generator': {
    title: "Google Drive Folder Structure Generator — ImageSnap",
    description: "Automatically generate complex nested folder structures in Google Drive for your projects and teams.",
  },
};

export async function generateStaticParams() {
  return Object.keys(TOOLS_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = TOOLS_PAGES[slug];
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

export default async function ToolsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = TOOLS_PAGES[slug];
  if (!page) notFound();

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ToolsClient slug={slug} />
    </>
  );
}
