import React from 'react';
import { Check, Chrome } from 'lucide-react';
import { SEO } from '../components/SEO';
import { PublicPageShell } from '../components/PublicPageShell';
import { PUB } from '../styles/theme';

export const PricingPage = ({ onLogin }: { onLogin?: () => void }) => (
  <PublicPageShell>
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <SEO
        title="ImageSnap Pricing — Free & Pro Plans | Google Drive Image Capture"
        description="Start for free with 100 image captures, or go Pro for unlimited snaps, batch uploads, and priority support. No hidden fees — your data stays in your own Google Drive."
      />

      <div className="text-center mb-24">
        <h1 className={`text-5xl md:text-7xl font-black mb-6 tracking-tight ${PUB.textPrimary}`}>ImageSnap Pricing — Free &amp; Pro Plans.</h1>
        <p className={`text-xl max-w-2xl mx-auto font-medium ${PUB.textMuted}`}>No hidden fees. Scale your asset management as your business grows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free */}
        <div className={`${PUB.glass} p-12 rounded-[2.5rem] flex flex-col h-full`}>
          <div className="mb-10">
            <div className={`text-sm font-black uppercase tracking-[0.2em] mb-4 ${PUB.textMuted}`}>EXPLORE</div>
            <div className={`text-6xl font-black ${PUB.textPrimary}`}>$0<span className={`text-xl ml-2 ${PUB.textMuted}`}>/ lifetime</span></div>
          </div>
          <ul className="space-y-6 mb-12 flex-1">
            <PricingItem text="Max 100 image captures" />
            <PricingItem text="Basic metadata (Desc, Source Link)" />
            <PricingItem text="Save directly to Google Drive" />
            <PricingItem text="Browser extension access" />
          </ul>
          <button onClick={onLogin} className={`w-full py-5 text-lg font-bold flex items-center justify-center gap-2 ${PUB.btnGhost}`}>
            <Chrome size={20} /> Install for Free
          </button>
        </div>

        {/* Pro */}
        <div className={`${PUB.cardAccent} p-12 rounded-[2.5rem] flex flex-col h-full relative overflow-hidden`}>
          <div className="absolute top-8 right-8 px-3 py-1 bg-accent text-white text-[10px] font-black rounded-full uppercase tracking-widest">MOST POPULAR</div>
          <div className="mb-10">
            <div className={`text-sm font-black uppercase tracking-[0.2em] mb-4 ${PUB.textAccent}`}>PROFESSIONAL</div>
            <div className={`text-6xl font-black ${PUB.textPrimary}`}>$9.99<span className={`text-xl ml-2 ${PUB.textMuted}`}>/ month</span></div>
            <div className={`text-sm font-bold mt-2 ${PUB.textAccent}`}>$99.9 / yearly (Save 20%)</div>
          </div>
          <ul className="space-y-6 mb-12 flex-1">
            <PricingItem text="Unlimited image captures" accent />
            <PricingItem text="Custom metadata fields (Unlimited)" accent />
            <PricingItem text="Auto-Extract from any website" accent />
            <PricingItem text="Bulk export to CSV/Sheets" accent />
            <PricingItem text="Priority support" accent />
          </ul>
          <button onClick={onLogin} className={`w-full py-5 text-lg font-bold ${PUB.btnPrimary}`}>
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  </PublicPageShell>
);

const PricingItem = ({ text, accent }: { text: string; accent?: boolean }) => (
  <li className="flex items-center gap-4 text-sm font-medium">
    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${accent ? 'bg-accent/20 text-accent' : 'bg-white/10 text-[#a1a1aa]'}`}>
      <Check size={12} strokeWidth={3} />
    </div>
    <span className={accent ? 'text-white' : 'text-[#a1a1aa]'}>{text}</span>
  </li>
);
