import React from 'react';
import { BlogPage } from '@web/pages/BlogPage';
import { NextPublicLayout } from '../components/NextPublicLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blog — ImageSnap | Research & Productivity Insights",
  description: "Read our latest articles on ecommerce research, competitor tracking, and productivity workflows.",
};

export default function BlogListPage() {
  return (
    <NextPublicLayout>
      <BlogPage />
    </NextPublicLayout>
  );
}
