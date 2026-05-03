import React from 'react';
import { SEOPage } from '../SEOPage';

export const GooglePhotosVsImageSnap = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <SEOPage 
      title="Google Photos vs ImageSnap — Which is better for professional teams?"
      description="Compare Google Photos and ImageSnap. Learn why ImageSnap is the superior choice for organized team asset management and field photo capture."
      headline={<>Professional <span className="text-accent italic">Organization</span> vs Cloud Storage.</>}
      subheadline="Google Photos is for memories. ImageSnap is for work. Discover the features that make ImageSnap the clear winner for business workflows."
      onCtaClick={onLogin}
      content={
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-black mb-6">Built for Professionals, Not Just Personal Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Controlled Folder Structure</h3>
                <p className="text-muted leading-relaxed">Google Photos lumps everything together. ImageSnap enforces a strict folder hierarchy in Google Drive, making assets easy to find by project, client, or date.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Rich Metadata & Sheets Sync</h3>
                <p className="text-muted leading-relaxed">Google Photos only stores basic EXIF data. ImageSnap attaches custom descriptions, links, and status tags that sync directly to Google Sheets.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Web Import Capabilities</h3>
                <p className="text-muted leading-relaxed">Upload any image from the web directly to your drive. Google Photos requires downloading and re-uploading.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Privacy & Control</h3>
                <p className="text-muted leading-relaxed">Your data stays in your workspace. No AI-powered scanning of your private business photos for advertising or training.</p>
              </div>
            </div>
          </section>
        </div>
      }
    />
  );
};
