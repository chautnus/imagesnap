import React from 'react';
import { SEOPage } from '../SEOPage';

export const ConstructionTeams = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <SEOPage 
      title="Photo Management for Construction Teams — ImageSnap.cloud"
      description="Streamline construction project documentation with ImageSnap. Capture job site photos, tag them with project IDs, and sync to Google Drive instantly."
      headline={<>Built for the <span className="text-accent italic">Job Site</span>.</>}
      subheadline="Capture progress, document issues, and sync with the office in real-time. No more chasing down memory cards or messy WhatsApp threads."
      onCtaClick={onLogin}
      content={
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-black mb-6">Master Your Project Documentation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Instant Field Capture</h3>
                <p className="text-muted leading-relaxed">Workers can snap photos on their phones and they appear instantly in the designated project folder on Google Drive.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Project-Specific Folders</h3>
                <p className="text-muted leading-relaxed">Auto-organize by project name, address, or phase. Keep your site documentation perfectly structured from Day 1.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Safety & Compliance</h3>
                <p className="text-muted leading-relaxed">Attach timestamps and GPS data to every photo to ensure compliance and resolve disputes with verifiable proof.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Zero Learning Curve</h3>
                <p className="text-muted leading-relaxed">If they can use a camera, they can use ImageSnap. No training required for field staff.</p>
              </div>
            </div>
          </section>
        </div>
      }
    />
  );
};
