import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: "Privacy Policy — ImageSnap",
  description: "Read ImageSnap's privacy policy. We do not sell your data. Your images stay in your Google Drive, your metadata stays in your Google Sheets.",
  alternates: { canonical: "https://www.imagesnap.cloud/privacy" },
  robots: { index: false },
};

export default function Privacy() {
  return <PrivacyClient />;
}
