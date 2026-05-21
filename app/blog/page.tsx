import React from 'react';
import { BlogPage } from '@web/pages/BlogPage';
import { NextPublicLayout } from '../components/NextPublicLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blog — ImageSnap | Research & Productivity Insights",
  description: "Read our latest articles on ecommerce research, competitor tracking, and productivity workflows.",
  alternates: { canonical: "https://www.imagesnap.cloud/blog" },
  openGraph: {
    title: "Blog — ImageSnap | Research & Productivity Insights",
    description: "Read our latest articles on ecommerce research, competitor tracking, and productivity workflows.",
    url: "https://www.imagesnap.cloud/blog",
    images: [{ url: "https://www.imagesnap.cloud/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — ImageSnap | Research & Productivity Insights",
    images: ["https://www.imagesnap.cloud/og-image.png"],
  },
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "ImageSnap Blog",
  "url": "https://www.imagesnap.cloud/blog",
  "description": "Research & productivity insights for ecommerce teams and visual researchers.",
  "publisher": { "@type": "Organization", "name": "ImageSnap", "url": "https://www.imagesnap.cloud" },
};

export default function BlogListPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <NextPublicLayout>
        <BlogPage />
      </NextPublicLayout>
    </>
  );
}
