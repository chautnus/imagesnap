'use client';
import { GenericSEOPage } from '@web/pages/GenericSEOPage';

export default function GoogleDriveClient() {
  return (
    <GenericSEOPage
      title="Google Drive Integration — The Best Chrome Extension for Drive | ImageSnap"
      headline="The Best Google Drive Extension"
      description="ImageSnap plugs directly into Google Drive. Every image you capture goes into a structured folder with full metadata logged to Sheets — automatically."
      onLogin={() => { window.location.href = '/'; }}
    />
  );
}
