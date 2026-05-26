'use client';
import { WebImageImport } from '@web/pages/features/WebImageImport';

export default function WebImageImportClient() {
  return <WebImageImport onLogin={() => { window.location.href = '/'; }} />;
}
