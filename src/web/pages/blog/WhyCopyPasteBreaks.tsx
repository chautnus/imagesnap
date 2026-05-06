import React from 'react';
import { SEOPage } from '../SEOPage';

export const BlogPost_WhyCopyPasteBreaks = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <SEOPage 
      title="Why Copy-Paste Research Breaks at Scale"
      description="Copy-paste product research works for 10 products. At 100, it falls apart. Here's why — and what to do instead."
      headline={<>Why Copy-Paste Research Breaks at <span className="text-accent italic">Scale</span></>}
      subheadline="Every product researcher starts with copy-paste. But at scale, the mistakes compound and the time cost explodes. Here's how to fix your workflow."
      onCtaClick={onLogin}
      ctaText="Try a faster workflow"
      content={
        <div className="space-y-16">
          <section>
            <p className="text-muted text-lg leading-relaxed font-medium">
              Every product researcher starts the same way: open a product page, copy the title, paste it into a spreadsheet. Copy the price. Paste. Save the image. Upload. Link.
              It's manual. It's tedious. But it works — for the first 10 products.
            </p>
            <p className="text-muted text-lg mt-6 leading-relaxed font-medium">
              At 50 products, it's slow. At 100, it's painful. Mistakes start compounding: wrong cells, missing fields, orphaned images. 
              This isn't a discipline problem. It's a workflow problem.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">Where the Process Breaks Down</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">1. Context Loss</h3>
                <p className="text-sm text-muted">Was that $24.99 the sale price? Did it include shipping? At scale, you won't remember. Re-checking means revisiting pages you've already spent time on.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">2. Image Chaos</h3>
                <p className="text-sm text-muted">Right-click, save, name, upload, link. At 100 products, your Downloads folder is a mess of `image(47).jpg` and you've lost track of which belongs where.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">3. Inconsistency</h3>
                <p className="text-sm text-muted">By the 85th product, you start cutting corners. Missing descriptions, inconsistent supplier names, and data quality too poor to draw conclusions.</p>
              </div>
            </div>
          </section>

          <section className="glass-light p-10 rounded-[3rem] border border-white/5">
            <h2 className="text-3xl font-black mb-8 text-center">The Math of Manual Research</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Task</th>
                    <th className="py-4 px-4 font-semibold">Time per product</th>
                    <th className="py-4 px-4 font-semibold text-accent">200 products</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-4 px-4">Copy text fields</td>
                    <td className="py-4 px-4">30 seconds</td>
                    <td className="py-4 px-4 text-accent font-bold">100 min</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Save + upload image</td>
                    <td className="py-4 px-4">45 seconds</td>
                    <td className="py-4 px-4 text-accent font-bold">150 min</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Link image in Sheet</td>
                    <td className="py-4 px-4">15 seconds</td>
                    <td className="py-4 px-4 text-accent font-bold">50 min</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Add notes/tags</td>
                    <td className="py-4 px-4">30 seconds</td>
                    <td className="py-4 px-4 text-accent font-bold">100 min</td>
                  </tr>
                  <tr className="bg-white/5 font-black text-xl">
                    <td className="py-4 px-4">Total</td>
                    <td className="py-4 px-4">~2 min</td>
                    <td className="py-4 px-4 text-accent">6.5 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-8 text-center text-muted font-medium italic">That's 6.5 hours of data entry. Not research. Not analysis. Just moving data.</p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">A Different Approach</h2>
            <p className="text-muted text-lg leading-relaxed font-medium">
              The bottleneck isn't your typing speed. It's the number of steps between "I see a product" and "it's in my spreadsheet."
              ImageSnap reduces that to one click.
            </p>
            <div className="mt-10 bg-accent p-10 rounded-[2rem] text-bg flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="space-y-2">
                  <p className="text-3xl font-black">200 products in 17 minutes.</p>
                  <p className="font-bold opacity-80">Instead of 6.5 hours of manual entry.</p>
               </div>
               <button onClick={onLogin} className="px-8 py-4 bg-bg text-accent font-black rounded-xl hover:scale-105 transition-transform">
                  Start Capturing Now
               </button>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold">When Manual Still Makes Sense</h2>
            <p className="text-muted leading-relaxed font-medium">
              If you're researching 5–10 products for a quick comparison, manual is fine. The breakpoint is around 20–30 products per session. Above that, the time cost and quality degradation start compounding.
            </p>
          </section>
        </div>
      }
    />
  );
};
