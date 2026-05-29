import React from 'react';
import { SEOPage } from './SEOPage';

export const GenericSEOPage = ({ title, description, headline, subheadline, onLogin }: any) => (
  <SEOPage 
    title={title} 
    description={description} 
    headline={headline} 
    subheadline={subheadline} 
    onCtaClick={onLogin}
    content={
      <div className="py-20 text-center">
        <h2 className="text-3xl font-black mb-6">Coming Soon</h2>
        <p className="text-muted text-xl">We are polishing this solution to give you the best experience. Stay tuned!</p>
      </div>
    }
  />
);
