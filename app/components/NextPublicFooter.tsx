"use client";

import React from 'react';
import Link from 'next/link';

export const NextPublicFooter: React.FC = () => {
  return (
    <footer className="mt-32 border-t border-white/5 bg-bg">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 font-bold uppercase tracking-widest text-[10px]">
          <div className="flex flex-col gap-4">
            <div className="text-white mb-2">Comparison</div>
            <Link href="/compare/imagesnap-vs-manual-spreadsheet" className="hover:text-accent transition-colors text-muted">vs Spreadsheet</Link>
            <Link href="/compare/imagesnap-vs-custom-scraper" className="hover:text-accent transition-colors text-muted">vs Scraper</Link>
            <Link href="/compare/imagesnap-vs-web-clipper" className="hover:text-accent transition-colors text-muted">vs Clippers</Link>
            <Link href="/compare/imagesnap-vs-scraping-api" className="hover:text-accent transition-colors text-muted">vs APIs</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="text-white mb-2">Use Cases</div>
            <Link href="/use-cases/competitor-tracking-beyond-keyword-tools" className="hover:text-accent transition-colors text-muted">Competitor Tracking</Link>
            <Link href="/use-cases/swipe-file-tool" className="hover:text-accent transition-colors text-muted">Swipe File Tool</Link>
            <Link href="/use-cases/construction-teams" className="hover:text-accent transition-colors text-muted">Construction</Link>
            <Link href="/blog" className="hover:text-accent transition-colors text-muted">Blog</Link>
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-white mb-2">Tools</div>
            <Link href="/tools/exif-viewer" className="hover:text-accent transition-colors text-muted">EXIF Viewer</Link>
            <Link href="/tools/bulk-photo-renamer" className="hover:text-accent transition-colors text-muted">Bulk Renamer</Link>
            <Link href="/tools/drive-folder-generator" className="hover:text-accent transition-colors text-muted">Folder Generator</Link>
            <a href="mailto:support@imagesnap.cloud" className="hover:text-accent transition-colors text-muted">Contact Support</a>
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-white mb-2">Legal</div>
            <Link href="/privacy" className="hover:text-accent transition-colors text-muted">Privacy Policy</Link>
            <a href="#" className="hover:text-accent transition-colors text-muted">Terms of Service</a>
            <a href="#" className="hover:text-accent transition-colors text-muted">Cookie Policy</a>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col items-center">
          <div className="text-white font-mono text-[10px] tracking-[0.3em] font-black">
            © 2026 IMAGESNAP CLOUD. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
};
