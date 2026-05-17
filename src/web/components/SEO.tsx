"use client";
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  blogPosting?: {
    headline: string;
    datePublished: string;
    dateModified?: string;
    author?: string;
    url: string;
  };
}

const BASE_URL = "https://www.imagesnap.cloud";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export const SEO: React.FC<SEOProps> = ({ title, description, keywords, ogImage, blogPosting }) => {
  const canonical = `${BASE_URL}${window.location.pathname}`;
  const resolvedOgImage = ogImage || DEFAULT_OG_IMAGE;

  const blogSchema = blogPosting ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blogPosting.headline,
    "description": description,
    "datePublished": blogPosting.datePublished,
    "dateModified": blogPosting.dateModified || blogPosting.datePublished,
    "author": {
      "@type": "Organization",
      "name": blogPosting.author || "ImageSnap"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ImageSnap",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.imagesnap.cloud/icon512.png"
      }
    },
    "image": resolvedOgImage,
    "url": blogPosting.url,
    "mainEntityOfPage": { "@type": "WebPage", "@id": blogPosting.url }
  }) : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={blogPosting ? "article" : "website"} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={resolvedOgImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={resolvedOgImage} />

      {/* BlogPosting schema (injected when prop is provided) */}
      {blogSchema && <script type="application/ld+json">{blogSchema}</script>}
    </Helmet>
  );
};
