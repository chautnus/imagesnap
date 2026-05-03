import React from 'react';
import { SEOPage } from '../SEOPage';

export const PicsioAlternative = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <SEOPage 
      title="Pics.io Alternative — Seamless Digital Asset Management"
      description="Looking for a Pics.io alternative? ImageSnap provides a more intuitive way to manage your Google Drive assets with automated folder organization."
      headline={<>A <span className="text-accent italic">Faster</span> Way to Manage Drive Assets.</>}
      subheadline="Don't overcomplicate your DAM. ImageSnap helps you organize, tag, and search your Google Drive image library with zero learning curve."
      onCtaClick={onLogin}
      content={
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-black mb-6">ImageSnap vs Pics.io: The Better Fit for Fast Teams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Browser-First Workflow</h3>
                <p className="text-muted leading-relaxed">While Pics.io focuses on managing existing assets, ImageSnap helps you capture and categorize new ones as you find them on the web.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Automated Folder Logic</h3>
                <p className="text-muted leading-relaxed">Set up rules once. Every image you snap goes exactly where it belongs based on your project settings.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Lightweight & Fast</h3>
                <p className="text-muted leading-relaxed">No heavy dashboards. ImageSnap is a lean extension that lives in your browser, ready whenever inspiration strikes.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Deep Sheets Integration</h3>
                <p className="text-muted leading-relaxed">Every asset is logged in a Google Sheet automatically, making it easy to build custom dashboards or inventory lists.</p>
              </div>
            </div>
          </section>
        </div>
      }
    />
  );
};
