import React from 'react';
import { SEOPage } from '../SEOPage';

export const BlogPost_HumanGuided = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <SEOPage 
      title="Human-Guided Capture vs Full Automation"
      description="Automated scraping and human-guided capture solve different problems. Here's an honest comparison of when each approach works best for product research."
      headline={<><span className="text-accent italic">Human-Guided</span> Capture vs Full Automation</>}
      subheadline="Data collection has a spectrum. On one end: manual copy-paste. On the other: fully automated bots. There's a third option that wins more often than you'd think."
      onCtaClick={onLogin}
      ctaText="Try human-guided capture"
      content={
        <div className="space-y-16">
          <section>
             <p className="text-muted text-lg leading-relaxed font-medium">
               The data collection world has a spectrum. Most product researchers assume they need to pick a side: either grind through manual work, or invest in complex automation.
               But there's a third option: <strong>human-guided capture</strong> — where a human browses and decides what to save, but the saving itself is automated.
             </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">The Three Approaches</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <h3 className="text-xl font-bold mb-4">Full Manual</h3>
                  <p className="text-sm text-muted">You browse, copy, paste, save, and link every single step. Slow and error-prone, but no setup required.</p>
               </div>
               <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <h3 className="text-xl font-bold mb-4">Full Automation</h3>
                  <p className="text-sm text-muted">Bots crawl sites 24/7. Massive scale, but complex setup, high maintenance, and data quality issues.</p>
               </div>
               <div className="p-8 bg-accent/10 border border-accent/20 rounded-3xl">
                  <h3 className="text-xl font-bold mb-4 text-accent">Human-Guided</h3>
                  <p className="text-sm text-muted">You browse and decide what matters. A tool captures images and data in one click. Clean data, zero maintenance.</p>
               </div>
            </div>
          </section>

          <section className="glass-light p-10 rounded-[3rem] border border-white/5">
            <h2 className="text-3xl font-black mb-8 text-center">Quality vs Quantity Tradeoff</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Factor</th>
                    <th className="py-4 px-4 font-semibold">Full Automation</th>
                    <th className="py-4 px-4 font-semibold text-accent">Human-Guided</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr><td className="py-4 px-4 font-medium text-muted">Records per hour</td><td className="py-4 px-4">1,000–100,000+</td><td className="py-4 px-4 text-accent">30–60</td></tr>
                  <tr><td className="py-4 px-4 font-medium text-muted">Data quality</td><td className="py-4 px-4">Inconsistent</td><td className="py-4 px-4 text-accent font-bold">Consistent</td></tr>
                  <tr><td className="py-4 px-4 font-medium text-muted">Image handling</td><td className="py-4 px-4">Separate pipeline</td><td className="py-4 px-4 text-accent font-bold">Integrated</td></tr>
                  <tr><td className="py-4 px-4 font-medium text-muted">Annotations</td><td className="py-4 px-4">None (ML-based)</td><td className="py-4 px-4 text-accent font-bold">Human judgment</td></tr>
                  <tr><td className="py-4 px-4 font-medium text-muted">Setup cost</td><td className="py-4 px-4">Hours to days</td><td className="py-4 px-4 text-accent font-bold">Minutes</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-10">Practical Decision Framework</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-6">
                  <h3 className="text-xl font-bold">Automation wins when:</h3>
                  <ul className="space-y-2 text-muted text-sm list-disc pl-5 font-medium">
                     <li>You need 10,000+ records per day</li>
                     <li>Real-time price monitoring is critical</li>
                     <li>Site structure is stable and well-documented</li>
                     <li>Scale matters more than individual record quality</li>
                  </ul>
               </div>
               <div className="space-y-6">
                  <h3 className="text-xl font-bold text-accent">Human-Guided wins when:</h3>
                  <ul className="space-y-2 text-muted text-sm list-disc pl-5 font-medium">
                     <li>You need 50–500 high-quality records</li>
                     <li>Visual context and image quality are critical</li>
                     <li>Human judgment and notes are the core value</li>
                     <li>Compliance and low policy risk are priorities</li>
                  </ul>
               </div>
            </div>
          </section>

          <section className="bg-white/[0.02] p-10 rounded-[3rem] border border-white/5 text-center">
            <h2 className="text-3xl font-black mb-6">Put judgment where it adds value.</h2>
            <p className="text-muted text-lg mb-8 max-w-2xl mx-auto font-medium">
              Don't eliminate human involvement. Put human judgment where it matters — deciding what's worth saving — and automate the repetitive parts.
            </p>
            <button onClick={onLogin} className="px-10 py-5 bg-accent text-bg font-black text-xl rounded-2xl hover:glow-accent transition-all">
               Try Human-Guided Capture
            </button>
          </section>
        </div>
      }
    />
  );
};
