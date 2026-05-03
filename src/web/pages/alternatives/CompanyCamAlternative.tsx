import React from 'react';
import { SEOPage } from '../SEOPage';

export const CompanyCamAlternative = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <SEOPage 
      title="CompanyCam Alternative — Better Photo Management for Teams"
      description="Looking for a CompanyCam alternative? ImageSnap offers a faster, more flexible way to organize team photos directly in Google Drive."
      headline={<>The <span className="text-accent italic">Lighter</span> Alternative to CompanyCam.</>}
      subheadline="Streamline your field operations without the complexity. Capture, tag, and sync job site photos directly to your team's Google Drive folders."
      onCtaClick={onLogin}
      content={
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-black mb-6">Why teams are switching from CompanyCam to ImageSnap</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Direct Google Drive Sync</h3>
                <p className="text-muted leading-relaxed">Unlike CompanyCam which locks your data in their proprietary cloud, ImageSnap puts you in control. Your photos live in your Google Drive, accessible via any app.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">No Monthly Per-User Fees</h3>
                <p className="text-muted leading-relaxed">Stop paying $20+ per user. Our flexible pricing models allow your whole team to capture data without breaking the bank.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Customizable Metadata</h3>
                <p className="text-muted leading-relaxed">Capture more than just photos. Attach custom fields, project IDs, and status tags that sync directly to Google Sheets for reporting.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Works in the Browser</h3>
                <p className="text-muted leading-relaxed">Use our powerful Chrome extension to capture reference images, permit docs, and competitor research directly from the web.</p>
              </div>
            </div>
          </section>
        </div>
      }
    />
  );
};
