import React from 'react';
import Link from 'next/link';
import { PUB } from '../styles/theme';

const COLS = [
  { heading: 'Compare', links: [
    { href: '/compare/imagesnap-vs-manual-spreadsheet', label: 'vs Spreadsheet' },
    { href: '/compare/imagesnap-vs-custom-scraper',     label: 'vs Scraper' },
    { href: '/compare/imagesnap-vs-web-clipper',        label: 'vs Clippers' },
    { href: '/compare/imagesnap-vs-scraping-api',       label: 'vs APIs' },
  ]},
  { heading: 'Use Cases', links: [
    { href: '/use-cases/competitor-tracking-beyond-keyword-tools', label: 'Competitor Tracking' },
    { href: '/use-cases/swipe-file-tool',    label: 'Swipe File Tool' },
    { href: '/use-cases/construction-teams', label: 'Construction' },
    { href: '/blog',                          label: 'Blog' },
  ]},
  { heading: 'Tools', links: [
    { href: '/tools/exif-viewer',          label: 'EXIF Viewer' },
    { href: '/tools/bulk-photo-renamer',   label: 'Bulk Renamer' },
    { href: '/tools/drive-folder-generator', label: 'Folder Generator' },
    { href: 'mailto:loch7444@gmail.com',   label: 'Contact Support' },
  ]},
  { heading: 'Legal', links: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '#',        label: 'Terms of Service' },
    { href: '#',        label: 'Cookie Policy' },
  ]},
];

export const PublicFooter: React.FC = () => (
  <footer className={`mt-32 border-t ${PUB.divider} bg-[#0a0a0c]`}>
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 font-bold uppercase tracking-widest text-[10px]">
        {COLS.map(col => (
          <div key={col.heading} className="flex flex-col gap-4">
            <div className={`mb-2 font-black ${PUB.textPrimary}`}>{col.heading}</div>
            {col.links.map(l => (
              <Link key={l.href} href={l.href} className={`hover:text-accent transition-colors ${PUB.textMuted}`}>{l.label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className={`mt-20 pt-8 border-t ${PUB.divider} flex flex-col items-center`}>
        <p className={`font-mono text-[10px] tracking-[0.3em] font-black ${PUB.textMuted}`}>
          © 2026 IMAGESNAP CLOUD. ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  </footer>
);
