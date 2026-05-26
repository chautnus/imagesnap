'use client';
import { GenericSEOPage } from '@web/pages/GenericSEOPage';

export default function AutoFolderClient() {
  return (
    <GenericSEOPage
      title="Auto Folder Organization for Google Drive — ImageSnap"
      headline="Automatic Folder Structure"
      description="ImageSnap creates your Drive folder hierarchy automatically — by category, project, or any custom rule you define. Stop sorting manually."
      onLogin={() => { window.location.href = '/'; }}
    />
  );
}
