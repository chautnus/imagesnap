import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { SEO } from '../components/SEO';

interface SEOPageProps {
  title: string;
  description: string;
  headline: React.ReactNode;
  subheadline: React.ReactNode;
  content: React.ReactNode;
  ctaText?: string;
  onCtaClick?: () => void;
}

export const SEOPage: React.FC<SEOPageProps> = ({ 
  title, 
  description, 
  headline, 
  subheadline, 
  content,
  ctaText = "Get Started for Free",
  onCtaClick
}) => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <SEO title={title} description={description} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
          {headline}
        </h1>
        <p className="text-xl text-muted max-w-3xl mx-auto font-medium">
          {subheadline}
        </p>
        <div className="mt-10 flex justify-center">
          <button 
            onClick={onCtaClick}
            className="px-10 py-5 bg-accent text-bg font-black text-xl rounded-2xl flex items-center gap-3 hover:glow-accent transition-all hover:-translate-y-1"
          >
            {ctaText} <ArrowRight size={24} />
          </button>
        </div>
      </motion.div>

      <div className="glass rounded-[3rem] p-10 md:p-20 border-white/5">
        {content}
      </div>
      
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <BenefitCard title="Zero Friction" desc="Works directly in your browser with our Chrome Extension." />
        <BenefitCard title="Cloud Native" desc="Your data is saved directly to Google Drive, no local storage needed." />
        <BenefitCard title="Team Ready" desc="Share folders and collaborate with your entire team effortlessly." />
      </div>
    </div>
  );
};

const BenefitCard = ({ title, desc }: { title: string, desc: string }) => (
  <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mb-6">
      <Check size={20} className="text-accent" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted text-sm font-medium">{desc}</p>
  </div>
);
