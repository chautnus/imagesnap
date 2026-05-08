import React from 'react';
import { notFound } from 'next/navigation';
import { BlogPost_WhyCopyPasteBreaks } from '@web/pages/blog/WhyCopyPasteBreaks';
import { BlogPost_BuildingDatabase } from '@web/pages/blog/BuildingDatabase';
import { BlogPost_HumanGuided } from '@web/pages/blog/HumanGuided';
import { BlogPost_WhyIBuild } from '@web/pages/blog/WhyIBuild';
import { NextPublicLayout } from '../../components/NextPublicLayout';
import { Metadata } from 'next';

const BLOG_POSTS: Record<string, { component: React.FC<any>, title: string, description: string }> = {
  'why-copy-paste-research-breaks-at-scale': {
    component: BlogPost_WhyCopyPasteBreaks,
    title: "Why Copy-Paste Research Breaks at Scale | ImageSnap",
    description: "Learn why manual copy-pasting is the silent killer of ecommerce research and how to fix it."
  },
  'building-competitor-database-without-scraper': {
    component: BlogPost_BuildingDatabase,
    title: "Building a Competitor Database Without a Scraper | ImageSnap",
    description: "How to build a visual competitor database using human-guided capture."
  },
  'human-guided-capture-vs-full-automation': {
    component: BlogPost_HumanGuided,
    title: "Human-Guided Capture vs. Full Automation | ImageSnap",
    description: "Why the best data comes from humans, not bots."
  },
  'why-i-built-imagesnap': {
    component: BlogPost_WhyIBuild,
    title: "Why I Built ImageSnap | Founder's Story",
    description: "The story behind the tool that helps you capture context, not just pixels."
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = BLOG_POSTS[params.slug];
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS[params.slug];
  if (!post) notFound();

  const Component = post.component;

  return (
    <NextPublicLayout onLogin={() => {}}>
      <Component onLogin={() => {}} />
    </NextPublicLayout>
  );
}
