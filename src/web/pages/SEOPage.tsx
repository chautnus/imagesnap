"use client";
import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { requestToken } from '@shared/lib/google-auth';
import { PublicPageShell } from '../components/PublicPageShell';
import { SEO } from '../components/SEO';
import { PUB } from '../styles/theme';

interface SEOPageProps {
  title: string;
  description: string;
  headline: React.ReactNode;
  subheadline?: React.ReactNode;
  content: React.ReactNode;
  ctaText?: string;
  onCtaClick?: () => void;
  keywords?: string;
  faqItems?: { q: string; a: string }[];
  blogPosting?: {
    headline: string;
    datePublished: string;
    dateModified?: string;
    author?: string;
    url: string;
  };
}

export const SEOPage: React.FC<SEOPageProps> = ({
  title, description, headline, subheadline, content,
  ctaText = "Get Started for Free", onCtaClick,
  keywords, faqItems, blogPosting,
}) => {
  return (
    <PublicPageShell>
      <SEO title={title} description={description} keywords={keywords} faqItems={faqItems} blogPosting={blogPosting} />
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">

        <div className="text-center mb-20">
          <h1 className={`text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight ${PUB.textPrimary}`}>
            {headline}
          </h1>
          <p className={`text-xl max-w-3xl mx-auto font-medium ${PUB.textMuted}`}>
            {subheadline}
          </p>
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => {
                if (onCtaClick) { onCtaClick(); }
                else { requestToken('consent', () => { window.location.href = '/dashboard'; }); }
              }}
              className={`px-10 py-5 text-xl flex items-center gap-3 hover:-translate-y-1 transition-all ${PUB.btnPrimary}`}
            >
              {ctaText} <ArrowRight size={24} />
            </button>
          </div>
        </div>

        <div className={`${PUB.glass} rounded-[3rem] p-10 md:p-20`}>
          {content}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <BenefitCard title="Zero Friction" desc="Works directly in your browser with our Chrome Extension." />
          <BenefitCard title="Cloud Native" desc="Your data is saved directly to Google Drive, no local storage needed." />
          <BenefitCard title="Team Ready" desc="Share folders and collaborate with your entire team effortlessly." />
        </div>
      </div>
    </PublicPageShell>
  );
};

const BenefitCard = ({ title, desc }: { title: string; desc: string }) => (
  <div className={`p-8 rounded-3xl ${PUB.card}`}>
    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mb-6">
      <Check size={20} className={PUB.textAccent} />
    </div>
    <h3 className={`text-xl font-bold mb-2 ${PUB.textPrimary}`}>{title}</h3>
    <p className={`text-sm font-medium ${PUB.textMuted}`}>{desc}</p>
  </div>
);
