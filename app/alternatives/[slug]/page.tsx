import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AlternativeClient } from './AlternativeClient';

const ALTERNATIVE_PAGES: Record<string, {
  title: string;
  description: string;
}> = {
  'pics-io-alternative': {
    title: "Pics.io Alternative: Simpler DAM Built on Google Drive — ImageSnap",
    description: "Looking for a Pics.io alternative? ImageSnap gives you structured asset management on Google Drive — web capture, custom metadata, and Sheets logging. No new platform.",
  },
  'google-photos-vs-imagesnap': {
    title: "Google Photos vs ImageSnap: Which is Right for You?",
    description: "Google Photos is for personal memories. ImageSnap is built for professionals — web capture, structured metadata, Sheets logging, and Drive organization by project.",
  },
  'companycam-alternative': {
    title: "Best CompanyCam Alternative for Teams Using Google Drive | ImageSnap",
    description: "Looking for a CompanyCam alternative? ImageSnap syncs field photos directly to Google Drive with structured metadata. No proprietary lock-in, no per-seat fees.",
  },
};

export async function generateStaticParams() {
  return Object.keys(ALTERNATIVE_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = ALTERNATIVE_PAGES[slug];
  if (!page) return { title: 'Page Not Found' };
  const url = `https://www.imagesnap.cloud/alternatives/${slug}`;
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

export default async function AlternativePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = ALTERNATIVE_PAGES[slug];
  if (!page) notFound();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.imagesnap.cloud' },
      { '@type': 'ListItem', position: 2, name: 'Alternatives', item: 'https://www.imagesnap.cloud/alternatives' },
      { '@type': 'ListItem', position: 3, name: page.title.split(':')[0], item: `https://www.imagesnap.cloud/alternatives/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AlternativeClient slug={slug} />
    </>
  );
}
