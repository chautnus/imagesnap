import React from 'react';
import { notFound } from 'next/navigation';
import { CompetitorTracking } from '@web/pages/use-cases/CompetitorTracking';
import { SwipeFileTool } from '@web/pages/use-cases/SwipeFileTool';
import { ConstructionTeams } from '@web/pages/use-cases/ConstructionTeams';
import { EcommerceStudios } from '@web/pages/use-cases/EcommerceStudios';
import { RealEstatePhotographers } from '@web/pages/use-cases/RealEstatePhotographers';
import { FieldInspections } from '@web/pages/use-cases/FieldInspections';
import { NextPublicLayout } from '../../components/NextPublicLayout';
import { Metadata } from 'next';

const USE_CASE_PAGES: Record<string, { component: any, props?: any, title: string, description: string }> = {
  'competitor-tracking-beyond-keyword-tools': {
    component: CompetitorTracking,
    title: "Competitor Tracking Beyond Keyword Tools | ImageSnap",
    description: "Build a visual competitor database with pricing and positioning data. Track market changes visually and stay ahead — without expensive keyword tools."
  },
  'swipe-file-tool': {
    component: SwipeFileTool,
    title: "The Ultimate Swipe File Tool for Researchers | ImageSnap",
    description: "Organize your inspiration with context. The best swipe file tool for Google Drive that captures images and structured metadata from any website in one click."
  },
  'construction-teams': {
    component: ConstructionTeams,
    title: "ImageSnap for Construction Teams: Visual Documentation Sync",
    description: "Sync site photos directly to Google Drive folders with automatic classification. Perfect for construction teams needing reliable visual records and site logs."
  },
  'ecommerce-studios': {
    component: EcommerceStudios,
    title: "E-commerce Product Photo Management for Studios — ImageSnap",
    description: "Stop losing product shots in messy Drive folders. ImageSnap captures images with SKU, variant, and client data — auto-organized to Drive and logged in Sheets."
  },
  'real-estate-photographers': {
    component: RealEstatePhotographers,
    title: "Real Estate Photo Organization — Google Drive | ImageSnap",
    description: "Deliver property photos faster. ImageSnap organizes real estate shoots by address and MLS number — auto-saved to Google Drive and logged in Sheets."
  },
  'field-inspections': {
    component: FieldInspections,
    title: "Field Inspection Photo Documentation — ImageSnap",
    description: "Capture site photos to Google Drive with location and defect data attached. ImageSnap turns field inspection docs into a searchable, auditable record."
  },
};

export async function generateStaticParams() {
  return Object.keys(USE_CASE_PAGES).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = USE_CASE_PAGES[slug];
  if (!page) return { title: "Page Not Found" };
  const url = `https://www.imagesnap.cloud/use-cases/${slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      images: [{ url: "https://www.imagesnap.cloud/og-image.png" }],
    },
  };
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = USE_CASE_PAGES[slug];
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
        "name": "Use Cases",
        "item": "https://www.imagesnap.cloud/#use-cases"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": page.title.split('|')[0],
        "item": `https://www.imagesnap.cloud/use-cases/${slug}`
      }
    ]
  };

  return (
    <NextPublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Component {...(page.props || {})} />
    </NextPublicLayout>
  );
}
