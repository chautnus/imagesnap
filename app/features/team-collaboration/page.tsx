import type { Metadata } from 'next';
import { GenericSEOPage } from '@web/pages/GenericSEOPage';
import { NextPublicLayout } from '../../components/NextPublicLayout';

export const metadata: Metadata = {
  title: "Team Collaboration on Google Drive & Sheets — ImageSnap",
  description: "Share product research, competitor intel, and visual databases with your team via Google Drive. ImageSnap keeps everyone on the same structured data — no extra tools.",
  alternates: { canonical: "https://www.imagesnap.cloud/features/team-collaboration" },
  openGraph: {
    title: "Team Collaboration on Google Drive & Sheets — ImageSnap",
    description: "Share structured image databases with your team using Google Drive and Sheets — tools they already use.",
    url: "https://www.imagesnap.cloud/features/team-collaboration",
    images: [{ url: "https://www.imagesnap.cloud/og-image.png", width: 1200, height: 630 }],
  },
};

export default function TeamCollaborationPage() {
  return (
    <NextPublicLayout>
      <GenericSEOPage
        title="Team Collaboration on Google Drive & Sheets — ImageSnap"
        headline="Collaborate with your Team"
        description="ImageSnap stores everything in Google Drive and Sheets — tools your team already uses. Share categories, products, and research instantly, no platform switch needed."
        onLogin={() => { window.location.href = '/'; }}
      />
    </NextPublicLayout>
  );
}
