'use client';
import { GenericSEOPage } from '@web/pages/GenericSEOPage';

export default function MetadataAutoFillClient() {
  return (
    <GenericSEOPage
      title="Metadata Auto-fill from Any Webpage — ImageSnap"
      headline="Automatic Metadata Extraction"
      description="When you capture an image, ImageSnap reads the page and pre-fills the context fields — title, price, description, URL. You just confirm and save."
      onLogin={() => { window.location.href = '/'; }}
    />
  );
}
