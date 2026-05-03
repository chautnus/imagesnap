import React from 'react';
import { motion } from 'motion/react';
import { Check, Chrome } from 'lucide-react';
import { SEO } from '../components/SEO';

export const PricingPage = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <SEO 
        title="Pricing — ImageSnap.cloud" 
        description="Choose the plan that's right for you. Start for free and upgrade as your team grows."
      />
      
      <div className="text-center mb-24">
         <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Transparent Pricing.</h1>
         <p className="text-muted text-xl max-w-2xl mx-auto font-medium">No hidden fees. Scale your asset management as your business grows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
         {/* Free Tier */}
         <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="glass p-12 rounded-[2.5rem] border-white/5 flex flex-col h-full"
         >
            <div className="mb-10">
               <div className="text-sm font-black uppercase tracking-[0.2em] text-muted mb-4">EXPLORE</div>
               <div className="text-6xl font-black">$0<span className="text-xl text-muted ml-2">/ lifetime</span></div>
            </div>
            <ul className="space-y-6 mb-12 flex-1">
               <PricingItem text="Max 100 image captures" />
               <PricingItem text="Basic metadata (Desc, Source Link)" />
               <PricingItem text="Save directly to Google Drive" />
               <PricingItem text="Browser extension access" />
            </ul>
            <button onClick={onLogin} className="w-full py-5 glass rounded-2xl font-black text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
               <Chrome size={20} /> INSTALL FOR FREE
            </button>
         </motion.div>

         {/* Pro Tier */}
         <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="glass p-12 rounded-[2.5rem] border-accent/30 bg-accent/[0.03] flex flex-col h-full relative overflow-hidden"
         >
            <div className="absolute top-8 right-8 px-3 py-1 bg-accent text-bg text-[10px] font-black rounded-full uppercase tracking-widest">MOST POPULAR</div>
            <div className="mb-10">
               <div className="text-sm font-black uppercase tracking-[0.2em] text-accent mb-4">PROFESSIONAL</div>
               <div className="text-6xl font-black">$9<span className="text-xl text-muted ml-2">/ month</span></div>
            </div>
            <ul className="space-y-6 mb-12 flex-1">
               <PricingItem text="Unlimited image captures" accent />
               <PricingItem text="Custom metadata fields (Unlimited)" accent />
               <PricingItem text="Auto-Extract from any website" accent />
               <PricingItem text="Bulk export to CSV/Sheets" accent />
               <PricingItem text="Priority support" accent />
            </ul>
            <button onClick={onLogin} className="w-full py-5 bg-accent text-bg rounded-2xl font-black text-lg hover:glow-accent transition-all shadow-[0_0_30px_rgba(212,255,0,0.2)]">
               UPGRADE TO PRO
            </button>
         </motion.div>
      </div>
    </div>
  );
};

const PricingItem = ({ text, accent }: { text: string, accent?: boolean }) => (
  <li className="flex items-center gap-4 text-sm font-medium">
    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${accent ? 'bg-accent/20 text-accent' : 'bg-white/10 text-muted'}`}>
      <Check size={12} strokeWidth={3} />
    </div>
    <span className={accent ? 'text-white' : 'text-muted'}>{text}</span>
  </li>
);
