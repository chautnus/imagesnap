import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { LandingPage } from '../components/LandingPage';
import { StaffLogin } from '../components/StaffLogin';
import { PrivacyPolicy } from '../components/PrivacyPolicy';
import { PublicLayout } from '../components/layouts/PublicLayout';
import { PricingPage } from '../pages/PricingPage';
import { CompanyCamAlternative } from '../pages/alternatives/CompanyCamAlternative';
import { PicsioAlternative } from '../pages/alternatives/PicsioAlternative';
import { GooglePhotosVsImageSnap } from '../pages/alternatives/GooglePhotosVsImageSnap';
import { ConstructionTeams } from '../pages/use-cases/ConstructionTeams';
import { WebImageImport } from '../pages/features/WebImageImport';
import { GenericSEOPage } from '../pages/GenericSEOPage';
import { ComparisonManualSheet } from '../pages/alternatives/ComparisonManualSheet';
import { ComparisonCustomScraper } from '../pages/alternatives/ComparisonCustomScraper';
import { ComparisonWebClipper } from '../pages/alternatives/ComparisonWebClipper';
import { ComparisonScrapingAPI } from '../pages/alternatives/ComparisonScrapingAPI';
import { CompetitorTracking } from '../pages/use-cases/CompetitorTracking';
import { SwipeFileTool } from '../pages/use-cases/SwipeFileTool';
import { BlogPage } from '../pages/BlogPage';
import { BlogPost_WhyCopyPasteBreaks } from '../pages/blog/WhyCopyPasteBreaks';
import { BlogPost_BuildingDatabase } from '../pages/blog/BuildingDatabase';
import { BlogPost_HumanGuided } from '../pages/blog/HumanGuided';
import { BlogPost_WhyIBuild } from '../pages/blog/WhyIBuild';
import { requestToken } from '@shared/lib/google-auth';

interface PublicRoutesProps {
  currentHash: string;
  landingVariant: number;
  t: any;
  onStaffLogin: (data: { username: string; masterSpreadsheetId: string; user: any }) => void;
}

const CloudCheck = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="m9 13 2 2 4-4"/>
  </svg>
);

export { CloudCheck };

export const PublicRoutes: React.FC<PublicRoutesProps> = ({
  currentHash, landingVariant, t, onStaffLogin,
}) => (
  <Routes>
    <Route element={<PublicLayout onLogin={() => requestToken()} />}>
      <Route path="/" element={
        currentHash === '#staff' ? (
          <StaffLogin onLogin={onStaffLogin} onBack={() => { window.location.href = '/'; }} t={t} />
        ) : (
          <>
            <SEO
              title="ImageSnap — Auto-organize team photos in Google Drive"
              description="Save images from the web directly to Google Drive, auto-classify into folders, and attach detailed metadata."
            />
            <LandingPage onLogin={() => requestToken()} t={t} variant={landingVariant} />
          </>
        )
      } />
      <Route path="/pricing" element={<PricingPage onLogin={() => requestToken()} />} />
      <Route path="/alternatives/companycam-alternative" element={<CompanyCamAlternative onLogin={() => requestToken()} />} />
      <Route path="/alternatives/pics-io-alternative" element={<PicsioAlternative onLogin={() => requestToken()} />} />
      <Route path="/alternatives/google-photos-vs-imagesnap" element={<GooglePhotosVsImageSnap onLogin={() => requestToken()} />} />
      <Route path="/use-cases/construction-teams" element={<ConstructionTeams onLogin={() => requestToken()} />} />
      <Route path="/use-cases/competitor-tracking-beyond-keyword-tools" element={<CompetitorTracking onLogin={() => requestToken()} />} />
      <Route path="/use-cases/swipe-file-tool" element={<SwipeFileTool onLogin={() => requestToken()} />} />
      <Route path="/use-cases/ecommerce-studios" element={<GenericSEOPage onLogin={() => requestToken()} title="E-commerce Asset Management for Studios — ImageSnap" headline="Streamline your E-commerce Visual Workflow" description="Automatically organize product shots and marketing assets in Google Drive with structured metadata for your e-commerce studio." />} />
      <Route path="/use-cases/real-estate-photographers" element={<GenericSEOPage onLogin={() => requestToken()} title="Real Estate Photo Management & Sync — ImageSnap" headline="Zero-friction Real Estate Photo Sync" description="Sync real estate photos from site to Google Drive instantly. Keep properties organized by address and metadata automatically." />} />
      <Route path="/use-cases/field-inspections" element={<GenericSEOPage onLogin={() => requestToken()} title="Field Inspection Photo Documentation — ImageSnap" headline="Reliable Field Inspection Documentation" description="Capture inspection photos with GPS data, timestamps, and custom notes directly into organized Google Drive folders." />} />

      <Route path="/compare/imagesnap-vs-manual-spreadsheet" element={<ComparisonManualSheet onLogin={() => requestToken()} />} />
      <Route path="/compare/imagesnap-vs-custom-scraper" element={<ComparisonCustomScraper onLogin={() => requestToken()} />} />
      <Route path="/compare/imagesnap-vs-web-clipper" element={<ComparisonWebClipper onLogin={() => requestToken()} />} />
      <Route path="/compare/imagesnap-vs-scraping-api" element={<ComparisonScrapingAPI onLogin={() => requestToken()} />} />

      <Route path="/features/web-image-import" element={<WebImageImport onLogin={() => requestToken()} />} />
      <Route path="/features/auto-folder-organization" element={<GenericSEOPage onLogin={() => requestToken()} title="Auto Folder Organization — ImageSnap" headline="Automatic Folder Structure" />} />
      <Route path="/features/team-collaboration" element={<GenericSEOPage onLogin={() => requestToken()} title="Team Collaboration — ImageSnap" headline="Collaborate with your Team" />} />
      <Route path="/features/metadata-auto-fill" element={<GenericSEOPage onLogin={() => requestToken()} title="Metadata Auto-fill — ImageSnap" headline="Automatic Metadata Extraction" />} />

      <Route path="/integrations/google-drive" element={<GenericSEOPage onLogin={() => requestToken()} title="Google Drive Integration — ImageSnap" headline="The Best Google Drive Extension" />} />

      <Route path="/tools/exif-viewer" element={<GenericSEOPage onLogin={() => requestToken()} title="Free Online EXIF Viewer: Inspect Image Metadata — ImageSnap" headline="Instant EXIF Data Viewer" description="View hidden EXIF metadata in any image. Inspect camera settings, GPS location, and timestamps for free." />} />
      <Route path="/tools/bulk-photo-renamer" element={<GenericSEOPage onLogin={() => requestToken()} title="Bulk Photo Renamer: Batch Rename Files Online — ImageSnap" headline="Batch Photo Renaming Tool" description="Rename hundreds of photos in seconds based on custom rules, dates, or metadata. Keep your Drive organized." />} />
      <Route path="/tools/drive-folder-generator" element={<GenericSEOPage onLogin={() => requestToken()} title="Google Drive Folder Structure Generator — ImageSnap" headline="Instant Folder Structure Creator" description="Automatically generate complex nested folder structures in Google Drive for your projects and teams." />} />

      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/why-copy-paste-research-breaks-at-scale" element={<BlogPost_WhyCopyPasteBreaks onLogin={() => requestToken()} />} />
      <Route path="/blog/building-competitor-database-without-scraper" element={<BlogPost_BuildingDatabase onLogin={() => requestToken()} />} />
      <Route path="/blog/human-guided-capture-vs-full-automation" element={<BlogPost_HumanGuided onLogin={() => requestToken()} />} />
      <Route path="/blog/why-i-built-imagesnap" element={<BlogPost_WhyIBuild onLogin={() => requestToken()} />} />
    </Route>

    <Route path="/privacy" element={
      <PrivacyPolicy onBack={() => { window.location.href = '/'; }} />
    } />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
