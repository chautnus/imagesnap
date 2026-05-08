import React from 'react';
import { motion } from 'framer-motion';
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

export async function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];
  if (!post) notFound();

  const Component = post.component;
  const otherPosts = Object.entries(BLOG_POSTS)
    .filter(([s]) => s !== slug)
    .slice(0, 2);

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
        "name": "Blog",
        "item": "https://www.imagesnap.cloud/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title.split('|')[0],
        "item": `https://www.imagesnap.cloud/blog/${slug}`
      }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "author": {
      "@type": "Person",
      "name": "ImageSnap Founder"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ImageSnap",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.imagesnap.cloud/icon192.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.imagesnap.cloud/blog/${slug}`
    }
  };

  return (
    <NextPublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="pb-20">
        <Component />
        
        {/* Related Posts */}
        <section className="max-w-4xl mx-auto px-6 mt-20 pt-10 border-t border-white/10">
          <h3 className="text-2xl font-black mb-8 italic">Continue Reading</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {otherPosts.map(([slug, p]) => (
              <a 
                key={slug} 
                href={`/blog/${slug}`}
                className="glass p-8 rounded-3xl border-white/5 hover:border-accent/20 transition-all group"
              >
                <h4 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{p.title.split('|')[0]}</h4>
                <p className="text-xs text-muted font-medium line-clamp-2">{p.description}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </NextPublicLayout>
  );
}
