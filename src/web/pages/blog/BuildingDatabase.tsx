import React from 'react';
import { SEOPage } from '../SEOPage';

export const BlogPost_BuildingDatabase = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <SEOPage 
      title="Building a Competitor Database Without a Scraper"
      description="You don't need a web scraper to track competitors. Here's how to build a structured competitor database using your browser and Google Sheets."
      headline={<>Building a Competitor Database <span className="text-accent italic">Without</span> a Scraper</>}
      subheadline="You don't need a data engineer or a complex scraping setup to track your competitors. All you need is a browser, a Google Sheet, and a system."
      onCtaClick={onLogin}
      ctaText="Start your competitor database"
      content={
        <div className="space-y-16">
          <section>
            <p className="text-muted text-lg leading-relaxed font-medium">
              Most guides about competitor tracking assume you're either a data engineer or a marketer who'll settle for bookmarks. 
              There's a middle ground: a structured database of competitor products that doesn't require any code, proxies, or API keys.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">The Five Pillars of a Useful Database</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[
                 { t: "Product Images", d: "What does the competitor's product actually look like?" },
                 { t: "Key Data", d: "Price, title, description, category, and source URL." },
                 { t: "Annotations", d: "Why did you save this? What's notable about their strategy?" },
                 { t: "Date Stamps", d: "When was this captured? Tracking changes over time." },
                 { t: "Filterability", d: "Can you quickly find 'all products from X under $50'?" }
               ].map((item, i) => (
                 <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <h3 className="font-bold mb-2 text-accent">{item.t}</h3>
                    <p className="text-sm text-muted">{item.d}</p>
                 </div>
               ))}
            </div>
          </section>

          <section className="glass-light p-10 rounded-[3rem] border border-white/5">
            <h2 className="text-3xl font-black mb-8">Recommended Sheet Structure</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Column</th>
                    <th className="py-4 px-4 font-semibold">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr><td className="py-4 px-4 font-bold">Date</td><td className="py-4 px-4">When you captured this record</td></tr>
                  <tr><td className="py-4 px-4 font-bold">Competitor</td><td className="py-4 px-4">Who is this competitor?</td></tr>
                  <tr><td className="py-4 px-4 font-bold">Price</td><td className="py-4 px-4">Current listed price</td></tr>
                  <tr><td className="py-4 px-4 font-bold">Image Link</td><td className="py-4 px-4">Direct link to image in Google Drive</td></tr>
                  <tr><td className="py-4 px-4 font-bold">Notes</td><td className="py-4 px-4">Positioning, strategy, and observations</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-10">The Workflow That Scales</h2>
            <div className="space-y-12">
               <div className="flex gap-8 items-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-2xl font-black flex-shrink-0">1</div>
                  <div className="space-y-2">
                     <h3 className="text-xl font-bold">Set a Cadence</h3>
                     <p className="text-muted font-medium">Consistency matters more than volume. 30 minutes a week is enough for most markets. Put it on your calendar and treat it like a ritual.</p>
                  </div>
               </div>
               <div className="flex gap-8 items-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-2xl font-black flex-shrink-0">2</div>
                  <div className="space-y-2">
                     <h3 className="text-xl font-bold">Streamline Your Capture</h3>
                     <p className="text-muted font-medium">Manual screenshot-and-upload is fine for small volumes. For 50+ products, use a tool like ImageSnap to automate the most tedious parts.</p>
                  </div>
               </div>
               <div className="flex gap-8 items-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-2xl font-black flex-shrink-0">3</div>
                  <div className="space-y-2">
                     <h3 className="text-xl font-bold">Review Monthly</h3>
                     <p className="text-muted font-medium">Raw data is just ingredients. Once a month, review your Sheet. Patterns emerge: pricing trends, launch frequencies, and visual shifts.</p>
                  </div>
               </div>
            </div>
          </section>

          <section className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 text-center">
            <h2 className="text-3xl font-black mb-6">Want to skip the manual image upload step?</h2>
            <p className="text-muted text-lg mb-8 max-w-2xl mx-auto font-medium">
              ImageSnap captures images and structured data into your Google Drive and Sheets in one click. 
              Built specifically for product researchers.
            </p>
            <button onClick={onLogin} className="px-10 py-5 bg-accent text-bg font-black text-xl rounded-2xl hover:glow-accent transition-all">
               Try ImageSnap Free
            </button>
          </section>
        </div>
      }
    />
  );
};
