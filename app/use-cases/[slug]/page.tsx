import React from 'react';
import { notFound } from 'next/navigation';
import { CompetitorTracking } from '@web/pages/use-cases/CompetitorTracking';
import { SwipeFileTool } from '@web/pages/use-cases/SwipeFileTool';
import { ConstructionTeams } from '@web/pages/use-cases/ConstructionTeams';
import { GenericSEOPage } from '@web/pages/GenericSEOPage';
import { NextPublicLayout } from '../../components/NextPublicLayout';
import { Metadata } from 'next';

const USE_CASE_PAGES: Record<string, { component: any, props?: any, title: string, description: string }> = {
  'competitor-tracking-beyond-keyword-tools': {
    component: CompetitorTracking,
    title: "Competitor Tracking Beyond Keyword Tools | ImageSnap",
    description: "Build a visual database of competitor moves, pricing, and positioning."
  },
  'swipe-file-tool': {
    component: SwipeFileTool,
    title: "The Ultimate Swipe File Tool for Researchers | ImageSnap",
    description: "Organize your inspiration with context. The best swipe file tool for Google Drive."
  },
  'construction-teams': {
    component: ConstructionTeams,
    title: "ImageSnap for Construction Teams: Visual Documentation Sync",
    description: "Sync site photos directly to Google Drive folders with automatic classification."
  },
  'ecommerce-studios': {
    component: GenericSEOPage,
    props: {
      title: "E-commerce Asset Management for Studios — ImageSnap",
      headline: "Streamline your E-commerce Visual Workflow",
      description: "Automatically organize product shots and marketing assets in Google Drive with structured metadata for your e-commerce studio."
    },
    title: "E-commerce Asset Management for Studios — ImageSnap",
    description: "Streamline your E-commerce Visual Workflow with ImageSnap."
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = USE_CASE_PAGES[params.slug];
  if (!page) return { title: "Page Not Found" };
  return {
    title: page.title,
    description: page.description,
  };
}

export default function UseCasePage({ params }: { params: { slug: string } }) {
  const page = USE_CASE_PAGES[params.slug];
  if (!page) notFound();

  const Component = page.component;

  return (
    <NextPublicLayout onLogin={() => {}}>
      <Component onLogin={() => {}} {...(page.props || {})} />
    </NextPublicLayout>
  );
}
