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

export const SEO: React.FC<SEOProps> = ({ title, description, keywords, ogImage, blogPosting }) => {
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
    "url": blogPosting.url,
    "mainEntityOfPage": { "@type": "WebPage", "@id": blogPosting.url }
  }) : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph */}
      <meta property="og:type" content={blogPosting ? "article" : "website"} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {ogImage && <meta property="twitter:image" content={ogImage} />}

      {/* BlogPosting schema (injected when prop is provided) */}
      {blogSchema && <script type="application/ld+json">{blogSchema}</script>}
    </Helmet>
  );
};
