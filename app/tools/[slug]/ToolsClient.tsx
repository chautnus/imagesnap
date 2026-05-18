"use client";

import React from 'react';
import { requestToken } from '@shared/lib/google-auth';
import { GenericSEOPage } from '@web/pages/GenericSEOPage';
import { NextPublicLayout } from '../../components/NextPublicLayout';

const TOOLS_CONFIG: Record<string, {
  title: string;
  headline: string;
  description: string;
}> = {
  'exif-viewer': {
    title: "Free Online EXIF Viewer: Inspect Image Metadata — ImageSnap",
    headline: "Instant EXIF Data Viewer",
    description: "View hidden EXIF metadata in any image. Inspect camera settings, GPS location, and timestamps for free.",
  },
  'bulk-photo-renamer': {
    title: "Bulk Photo Renamer: Batch Rename Files Online — ImageSnap",
    headline: "Batch Photo Renaming Tool",
    description: "Rename hundreds of photos in seconds based on custom rules, dates, or metadata. Keep your Google Drive organized.",
  },
  'drive-folder-generator': {
    title: "Google Drive Folder Structure Generator — ImageSnap",
    headline: "Instant Folder Structure Creator",
    description: "Automatically generate complex nested folder structures in Google Drive for your projects and teams.",
  },
};

export function ToolsClient({ slug }: { slug: string }) {
  const config = TOOLS_CONFIG[slug];
  if (!config) return null;

  const handleLogin = () => requestToken();

  return (
    <NextPublicLayout onLogin={handleLogin}>
      <GenericSEOPage 
        title={config.title}
        headline={config.headline}
        description={config.description}
        onLogin={handleLogin}
      />
    </NextPublicLayout>
  );
}
