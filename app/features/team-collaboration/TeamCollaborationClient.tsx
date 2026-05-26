'use client';
import { GenericSEOPage } from '@web/pages/GenericSEOPage';

export default function TeamCollaborationClient() {
  return (
    <GenericSEOPage
      title="Team Collaboration on Google Drive & Sheets — ImageSnap"
      headline="Collaborate with your Team"
      description="ImageSnap stores everything in Google Drive and Sheets — tools your team already uses. Share categories, products, and research instantly, no platform switch needed."
      onLogin={() => { window.location.href = '/'; }}
    />
  );
}
