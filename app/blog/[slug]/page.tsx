import React from 'react';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import { BlogPost_WhyCopyPasteBreaks } from '@web/pages/blog/WhyCopyPasteBreaks';
import { BlogPost_BuildingDatabase } from '@web/pages/blog/BuildingDatabase';
import { BlogPost_HumanGuided } from '@web/pages/blog/HumanGuided';
import { BlogPost_WhyIBuild } from '@web/pages/blog/WhyIBuild';
import { BlogPost_SwipeFileChaos } from '@web/pages/blog/SwipeFileChaos';
import { BlogPost_OrganizeProductImages } from '@web/pages/blog/OrganizeProductImages';
import { BlogPost_GoogleDriveMetadata } from '@web/pages/blog/GoogleDriveMetadata';
import { NextPublicLayout } from '../../components/NextPublicLayout';
import { Metadata } from 'next';

const BLOG_POSTS: Record<string, { component: React.FC<any>, title: string, description: string }> = {
  'why-copy-paste-research-breaks-at-scale': {
    component: BlogPost_WhyCopyPasteBreaks,
    title: "Why Copy-Paste Research Breaks at Scale | ImageSnap",
    description: "Manual copy-pasting is the silent killer of ecommerce research. Learn how to automate product data capture into Google Drive and Sheets at scale."
  },
  'building-competitor-database-without-scraper': {
    component: BlogPost_BuildingDatabase,
    title: "Building a Competitor Database Without a Scraper | ImageSnap",
    description: "Build a visual competitor database with human-guided capture. Stop fighting fragile scraping scripts and start collecting high-quality research data."
  },
  'human-guided-capture-vs-full-automation': {
    component: BlogPost_HumanGuided,
    title: "Human-Guided Capture vs. Full Automation | ImageSnap",
    description: "The best research data comes from humans, not bots. Compare human-guided capture vs full automation and why context matters for ecommerce."
  },
  'why-i-built-imagesnap': {
    component: BlogPost_WhyIBuild,
    title: "Why I Built ImageSnap | Founder's Story",
    description: "The story behind ImageSnap: the tool that helps you capture context, not just pixels. Learn why I built a solution for ecommerce researchers to own their data."
  },
  'swipe-file-chaos-how-to-fix': {
    component: BlogPost_SwipeFileChaos,
    title: "Swipe File Chaos — How to Fix Your Ad Inspiration Folder | ImageSnap",
    description: "Your swipe file is probably a mess of screenshots with no context. Here's why that happens and how to turn it into a searchable database you'll actually use."
  },
  'organize-product-images-ecommerce': {
    component: BlogPost_OrganizeProductImages,
    title: "How to Organize Product Images for Ecommerce Research | ImageSnap",
    description: "Stop losing product images in a Downloads folder. Here's the system ecommerce researchers use to keep images linked to prices, suppliers, and notes — at any scale."
  },
  'google-drive-metadata-images': {
    component: BlogPost_GoogleDriveMetadata,
    title: "Google Drive Image Metadata — The Missing Layer | ImageSnap",
    description: "Google Drive stores your images but can't understand them. Here's how to add searchable metadata to your Drive images without switching platforms."
  },
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
  const url = `https://www.imagesnap.cloud/blog/${slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      images: [{ url: `https://www.imagesnap.cloud/api/og?title=${encodeURIComponent(post.title.split('|')[0].trim())}&category=blog`, width: 1200, height: 630 }],
    },
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
