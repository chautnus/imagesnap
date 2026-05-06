import React from 'react';
import { SEOPage } from '../SEOPage';

export const CompetitorTracking = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <SEOPage 
      title="Competitor Tracking Beyond Keyword Tools"
      description="Keyword tools show trends. ImageSnap helps you track what competitors actually do — products, pricing, visuals, positioning. Build a competitor database you own."
      headline={<>Competitor Tracking <span className="text-accent italic">Beyond</span> Keyword Tools</>}
      subheadline="Keyword tools show search trends. ImageSnap tracks what competitors actually do on their pages. Build a database you own, not just a list of keywords."
      onCtaClick={onLogin}
      ctaText="Start building your competitor database"
      content={
        <div className="space-y-16">
          <section>
            <h2 className="text-3xl font-black mb-6">The Gap Between Keyword Data and Product Intelligence</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-4">
                <h3 className="text-xl font-bold text-muted uppercase tracking-tighter text-sm">Keyword tools answer:</h3>
                <p className="text-2xl font-black italic">"What are people searching for?"</p>
              </div>
              <div className="p-8 bg-accent/10 border border-accent/20 rounded-[2rem] space-y-4">
                <h3 className="text-xl font-bold text-accent uppercase tracking-tighter text-sm">Product intelligence answers:</h3>
                <p className="text-2xl font-black italic">"What are competitors doing about it?"</p>
              </div>
            </div>
            <p className="text-muted text-lg mt-8 leading-relaxed font-medium">
              SEM tools show search volume and ranking. They don't show you which products your competitor launched, what price point they chose, or how their photography evolved. 
              That intelligence lives on product pages, not in dashboards.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">A Practical Competitor Tracking Workflow</h2>
            <div className="space-y-8">
              {[
                { 
                  step: 1, 
                  title: "Define Your Fields", 
                  desc: "Before you start, decide what matters. Competitor name, category, price, positioning notes, visual style — you define the schema that makes sense for your market." 
                },
                { 
                  step: 2, 
                  title: "Regular Browse-and-Capture Sessions", 
                  desc: "Set a cadence — weekly or biweekly. Browse competitors normally. When you see something worth tracking, click the extension. Images go to Drive, context goes to Sheets." 
                },
                { 
                  step: 3, 
                  title: "Analyze in Your Sheet", 
                  desc: "Your Google Sheet becomes your dashboard. Sort by date to see new launches. Filter by competitor to see their range. Compare pricing across the market instantly." 
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-accent text-bg font-black flex items-center justify-center flex-shrink-0 text-xl">
                    {item.step}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-muted font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 overflow-hidden">
            <h2 className="text-3xl font-black mb-10 text-center">Why Not Just Use Screenshots?</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Factor</th>
                    <th className="py-4 px-4 font-semibold">Screenshots folder</th>
                    <th className="py-4 px-4 font-semibold text-accent">ImageSnap Database</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Finding a product</td>
                    <td className="py-4 px-4">Scroll through hundreds of files</td>
                    <td className="py-4 px-4 text-accent font-bold">Search/filter in Sheets</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Comparing prices</td>
                    <td className="py-4 px-4">Open multiple files side-by-side</td>
                    <td className="py-4 px-4 text-accent font-bold">Sort column in Sheets</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Tracking changes</td>
                    <td className="py-4 px-4 text-red-400">Nearly impossible</td>
                    <td className="py-4 px-4 text-accent font-bold">Filter by date + competitor</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Sharing with team</td>
                    <td className="py-4 px-4">Send ZIP files (clunky)</td>
                    <td className="py-4 px-4 text-accent font-bold">Share the Google Sheet</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
             <h2 className="text-3xl font-black mb-8">Pairing ImageSnap with Your Existing Tools</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { layer: "Search Trends", tool: "SEMrush / Ahrefs", value: "What people search for" },
                  { layer: "Market Positioning", tool: "ImageSnap", value: "What competitors show on pages" },
                  { layer: "Price Monitoring", tool: "Scraping API", value: "Real-time bulk price changes" },
                  { layer: "Strategy Decisions", tool: "Your Brain + Your Sheet", value: "What to do about all of it" }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-between h-full">
                    <div className="text-xs font-black text-muted uppercase tracking-widest mb-2">{item.layer}</div>
                    <div className="text-xl font-bold mb-1">{item.tool}</div>
                    <div className="text-sm text-accent font-medium">{item.value}</div>
                  </div>
                ))}
             </div>
          </section>

          <section id="faq" className="space-y-6">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            <div className="space-y-4">
              {[
                { q: "Do I need to be technical to use this?", a: "No. ImageSnap is a browser extension. You click a button. Data goes to your Google Sheet. If you can use Sheets, you can use ImageSnap." },
                { q: "Can my team share the competitor database?", a: "Yes. Since the data lives in Google Sheets and Drive, you share it the same way you share any Google file — add collaborators to the Sheet and the Drive folder." },
                { q: "What's the difference between this and a web scraper?", a: "A scraper automates data collection at scale. ImageSnap is human-guided. For competitor tracking, the human judgment of *what's worth tracking* is often more valuable than bulk data collection." }
              ].map((item, i) => (
                <details key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 group">
                  <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-lg">
                    {item.q}
                    <span className="transition group-open:rotate-180">▾</span>
                  </summary>
                  <p className="text-muted mt-4 leading-relaxed font-medium">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      }
    />
  );
};
