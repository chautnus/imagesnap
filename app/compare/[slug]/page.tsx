import React from 'react';
import { notFound } from 'next/navigation';
import { ComparisonManualSheet } from '@web/pages/alternatives/ComparisonManualSheet';
import { ComparisonCustomScraper } from '@web/pages/alternatives/ComparisonCustomScraper';
import { ComparisonWebClipper } from '@web/pages/alternatives/ComparisonWebClipper';
import { ComparisonScrapingAPI } from '@web/pages/alternatives/ComparisonScrapingAPI';
import { NextPublicLayout } from '../../components/NextPublicLayout';
import { Metadata } from 'next';

const COMPARISON_PAGES: Record<string, { component: React.FC<any>, title: string, description: string }> = {
  'imagesnap-vs-manual-spreadsheet': {
    component: ComparisonManualSheet,
    title: "ImageSnap vs Manual Spreadsheets: Stop the Copy-Paste Madness",
    description: "Compare manual data entry with ImageSnap's one-click capture. Learn how to save hours of research by automating product image and metadata collection to Sheets."
  },
  'imagesnap-vs-custom-scraper': {
    component: ComparisonCustomScraper,
    title: "ImageSnap vs Custom Scrapers: Human Intelligence vs Bot Brute Force",
    description: "Why human-guided capture is more reliable than custom scraping scripts for research. Stop dealing with IP blocks and site changes with ImageSnap's robust tool."
  },
  'imagesnap-vs-web-clipper': {
    component: ComparisonWebClipper,
    title: "ImageSnap vs Generic Web Clippers: Captured Context vs Dead Snaps",
    description: "Generic clippers save pixels. ImageSnap saves meaning. Compare structured data capture with basic screenshots and see how to build a searchable asset library."
  },
  'imagesnap-vs-scraping-api': {
    component: ComparisonScrapingAPI,
    title: "ImageSnap vs Scraping APIs: Research Workflow vs Data Dumping",
    description: "Why APIs are great for bots but bad for research workflows. Discover how ImageSnap provides a human-centric research experience for designers and buyers."
  }
};

export async function generateStaticParams() {
  return Object.keys(COMPARISON_PAGES).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = COMPARISON_PAGES[slug];
  if (!page) return { title: "Page Not Found" };
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = COMPARISON_PAGES[slug];
  if (!page) notFound();

  const Component = page.component;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.imagesnap.cloud"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Compare",
        "item": "https://www.imagesnap.cloud/compare"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": page.title.split(':')[0],
        "item": `https://www.imagesnap.cloud/compare/${slug}`
      }
    ]
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
