import React from 'react';
import { SEOPage } from '../SEOPage';

export const WebImageImport = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <SEOPage 
      title="Web Image Import — Save directly to Google Drive"
      description="Save any image from any website directly to your Google Drive with one click. Extract metadata, product info, and source links automatically."
      headline={<>The Internet is your <span className="text-accent italic">Resource Library</span>.</>}
      subheadline="Stop downloading and re-uploading. Our Chrome extension lets you 'Snap' any asset from the web directly into your organized Drive folders."
      onCtaClick={onLogin}
      content={
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-black mb-6">Powerful Research & Asset Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Right-Click to Drive</h3>
                <p className="text-muted leading-relaxed">Just right-click any image on the web and select your project folder. The asset flies straight to your Google Drive.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Auto-Metadata Extraction</h3>
                <p className="text-muted leading-relaxed">ImageSnap automatically grabs the page title, source URL, and descriptive text to store alongside the image.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Bulk Import Support</h3>
                <p className="text-muted leading-relaxed">Need to collect multiple references? Our tool can identify all high-res assets on a page for one-click bulk saving.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Competitor Analysis</h3>
                <p className="text-muted leading-relaxed">Perfect for e-commerce teams. Collect product shots, pricing info, and source links in one unified workflow.</p>
              </div>
            </div>
          </section>
        </div>
      }
    />
  );
};
