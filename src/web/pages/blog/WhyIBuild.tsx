import React from 'react';
import { SEOPage } from '../SEOPage';

export const BlogPost_WhyIBuild = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <SEOPage 
      title="Why I Built ImageSnap (And Why I Almost Didn't)"
      description="The story behind ImageSnap — how a frustrating product research workflow led to a Chrome extension that saves images with context into Google Drive and Sheets."
      headline={<>Why I Built ImageSnap (And Why I Almost <span className="text-accent italic">Didn't</span>)</>}
      subheadline="I didn't set out to build a product. I set out to fix a workflow that was wasting my time. Here's the story behind the extension."
      onCtaClick={onLogin}
      ctaText="Try ImageSnap"
      content={
        <div className="space-y-16">
          <section className="italic text-muted border-l-4 border-accent pl-6 py-2">
            "I didn't set out to build a product. I set out to fix a workflow that was wasting my time."
          </section>

          <section className="space-y-6">
            <p className="text-muted text-lg leading-relaxed font-medium">
              The workflow was always the same: find a product page, copy the title, paste it into a spreadsheet, save the image, upload it to Drive, paste the link, add my notes. Repeat. For hours.
              It wasn't hard. It was just slow, repetitive, and error-prone.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">The Tools I Tried First</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <h3 className="font-bold text-accent mb-2">Web Clippers</h3>
                <p className="text-sm text-muted">Saved the page but not structured data. No way to compare products side by side.</p>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <h3 className="font-bold text-accent mb-2">Scrapers</h3>
                <p className="text-sm text-muted">Overkill. I didn't need 10,000 records. I needed 50 good ones with images.</p>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <h3 className="font-bold text-accent mb-2">Pinterest</h3>
                <p className="text-sm text-muted">Great for inspiration, terrible for research. No prices, no specs, no custom fields.</p>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <h3 className="font-bold text-accent mb-2">Manual Spreadsheets</h3>
                <p className="text-sm text-muted">Worked but killed my productivity. Two hours of data entry for 50 products.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">The "I'll Just Build It" Moment</h2>
            <div className="p-8 bg-accent/10 border border-accent/20 rounded-[2rem]">
               <h3 className="text-xl font-bold mb-4">What I actually wanted:</h3>
               <ul className="space-y-3 text-muted font-medium">
                  <li className="flex gap-3"><span className="text-accent">1.</span> Click a button on any product page.</li>
                  <li className="flex gap-3"><span className="text-accent">2.</span> Images go to my Google Drive.</li>
                  <li className="flex gap-3"><span className="text-accent">3.</span> Product data goes to my Google Sheet.</li>
                  <li className="flex gap-3"><span className="text-accent">4.</span> I add my own fields — notes, ratings, tags.</li>
                  <li className="flex gap-3 font-bold text-white"><span className="text-accent">5.</span> Done. One click. Everything organized.</li>
               </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black mb-6">What ImageSnap Actually Is</h2>
            <p className="text-muted text-lg leading-relaxed font-medium">
              I want to be clear: ImageSnap isn't an AI training platform or a massive scraper. It's a capture tool that respects your workflow and your data ownership. 
              Images in Drive, context in Sheets. Native, simple, and yours.
            </p>
          </section>

          <section className="bg-white/[0.02] p-10 rounded-[3rem] border border-white/5">
            <h2 className="text-3xl font-black mb-8 text-center">What's Next</h2>
            <p className="text-muted text-lg text-center max-w-2xl mx-auto font-medium">
              ImageSnap is still early, but the core is working. If this workflow sounds useful to you, I'd love for you to try it and tell me what's missing.
            </p>
            <div className="mt-10 flex justify-center">
               <button onClick={onLogin} className="px-10 py-5 bg-accent text-bg font-black text-xl rounded-2xl hover:glow-accent transition-all">
                  Try ImageSnap Now
               </button>
            </div>
          </section>
        </div>
      }
    />
  );
};
