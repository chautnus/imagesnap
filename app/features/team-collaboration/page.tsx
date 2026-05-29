import type { Metadata } from 'next';
import { NextPublicLayout } from '../../components/NextPublicLayout';
import { imagesnapSoftwareSchema } from '../../components/featureSchema';
import TeamCollaborationClient from './TeamCollaborationClient';

export const metadata: Metadata = {
  title: "Team Collaboration on Google Drive & Sheets — ImageSnap",
  description: "Share product research and visual databases with your team via Google Drive. ImageSnap keeps everyone on the same structured data — no extra tools needed.",
  alternates: { canonical: "https://www.imagesnap.cloud/features/team-collaboration" },
  openGraph: {
    title: "Team Collaboration on Google Drive & Sheets — ImageSnap",
    description: "Share structured image databases with your team using Google Drive and Sheets — tools they already use.",
    url: "https://www.imagesnap.cloud/features/team-collaboration",
    images: [{ url: "https://www.imagesnap.cloud/api/og?title=Team+Collaboration&category=features", width: 1200, height: 630 }],
  },
};

export default function TeamCollaborationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imagesnapSoftwareSchema) }} />
      <NextPublicLayout>
        <TeamCollaborationClient />
      </NextPublicLayout>
    </>
  );
}
