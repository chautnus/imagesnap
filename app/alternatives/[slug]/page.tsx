import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PicsioAlternative } from '@web/pages/alternatives/PicsioAlternative';
import { GooglePhotosVsImageSnap } from '@web/pages/alternatives/GooglePhotosVsImageSnap';
import { NextPublicLayout } from '../../components/NextPublicLayout';

const ALTERNATIVE_PAGES: Record<string, {
  component: React.FC<any>;
  title: string;
  description: string;
}> = {
  'pics-io-alternative': {
    component: PicsioAlternative,
    title: "Pics.io Alternative: Simpler DAM Built on Google Drive — ImageSnap",
    description: "Looking for a Pics.io alternative? ImageSnap gives you structured asset management on top of Google Drive — with web capture, custom metadata fields, and Sheets logging. No new platform to learn.",
  },
  'google-photos-vs-imagesnap': {
    component: GooglePhotosVsImageSnap,
    title: "Google Photos vs ImageSnap: Which is Right for Your Team? — ImageSnap",
    description: "Google Photos is great for personal memories. ImageSnap is built for professional workflows — web capture, structured metadata, Google Sheets logging, and Drive organization by project or client.",
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

  const Component = page.component;

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
    <NextPublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Component />
    </NextPublicLayout>
  );
}
