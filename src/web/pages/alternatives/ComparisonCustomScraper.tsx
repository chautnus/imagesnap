import React from 'react';
import { SEOPage } from '../SEOPage';

export const ComparisonCustomScraper = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <SEOPage 
      title="Tired of Maintaining a Product Scraper?"
      description="Custom scrapers break, cost money to maintain, and risk policy violations. ImageSnap offers human-guided capture without the overhead. Compare both approaches."
      headline={<>Tired of Maintaining a <span className="text-accent italic">Product Scraper?</span></>}
      subheadline="Scrapers break. Proxies cost money. Maintenance is a headache. There's a better approach for curated research."
      onCtaClick={onLogin}
      ctaText="Build cleaner datasets without maintaining a crawler"
      content={
        <div className="space-y-16">
          <section>
            <h2 className="text-3xl font-black mb-6">The Real Cost of DIY Scraping</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              Building a scraper is easy. Keeping one running is the hard part. 
              Selector updates, anti-bot workarounds, and proxy management add up quickly.
            </p>
            
            <div className="glass-light p-8 rounded-3xl overflow-hidden border border-white/5">
              <h3 className="text-xl font-bold mb-6 text-accent">Ongoing costs most people don't budget for:</h3>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 font-semibold">Cost Type</th>
                    <th className="py-3 px-4 font-semibold">Typical Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr><td className="py-3 px-4">Proxy service</td><td className="py-3 px-4 text-red-400">$30–$200/month</td></tr>
                  <tr><td className="py-3 px-4">Server/compute</td><td className="py-3 px-4 text-red-400">$10–$50/month</td></tr>
                  <tr><td className="py-3 px-4">Maintenance time</td><td className="py-3 px-4 text-red-400">3–8 hours/month</td></tr>
                  <tr><td className="py-3 px-4">Data cleaning</td><td className="py-3 px-4 text-red-400">1–3 hours/session</td></tr>
                  <tr><td className="py-3 px-4">Policy/legal risk</td><td className="py-3 px-4 text-red-400 italic">Hard to quantify</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">A Different Approach: Human-Guided Capture</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-muted text-lg leading-relaxed font-medium">
                  ImageSnap takes a fundamentally different approach. Instead of sending bots to collect data automatically, you browse product pages normally — and capture what you need with one click.
                </p>
                <ul className="space-y-4 text-muted font-medium">
                   <li className="flex gap-3"><span className="text-accent">✓</span> No bots or proxies needed</li>
                   <li className="flex gap-3"><span className="text-accent">✓</span> No selectors to maintain</li>
                   <li className="flex gap-3"><span className="text-accent">✓</span> Zero maintenance overhead</li>
                   <li className="flex gap-3"><span className="text-accent">✓</span> Zero policy risk</li>
                </ul>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] text-center">
                 <p className="text-xl font-bold mb-4 italic">"Curated &gt; Automated"</p>
                 <p className="text-sm text-muted uppercase tracking-widest font-black">The ImageSnap Philosophy</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6 text-center">Comparison: DIY Scraper vs ImageSnap</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Factor</th>
                    <th className="py-4 px-4 font-semibold">Custom Scraper</th>
                    <th className="py-4 px-4 font-semibold text-accent">ImageSnap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Setup time</td>
                    <td className="py-4 px-4">Hours to days</td>
                    <td className="py-4 px-4 text-accent font-bold">2 minutes</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Maintenance</td>
                    <td className="py-4 px-4">Constant updates</td>
                    <td className="py-4 px-4 text-accent font-bold">None</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Monthly cost</td>
                    <td className="py-4 px-4">$50–$250+ (proxies)</td>
                    <td className="py-4 px-4 text-accent font-bold">Free tier available</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Data quality</td>
                    <td className="py-4 px-4">Requires cleaning</td>
                    <td className="py-4 px-4 text-accent font-bold">Clean on capture</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Scale</td>
                    <td className="py-4 px-4">10k+ pages/day</td>
                    <td className="py-4 px-4 text-accent">Human speed (curated)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Policy risk</td>
                    <td className="py-4 px-4 text-red-400">Moderate to high</td>
                    <td className="py-4 px-4 text-accent font-bold">Minimal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-accent/5 p-10 rounded-[3rem] border border-accent/10">
            <h2 className="text-3xl font-black mb-8 text-center">Honest Comparison: Which is for you?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-8 bg-black/20 rounded-3xl border border-white/5">
                <h3 className="text-xl font-bold mb-4">Use a scraper when:</h3>
                <ul className="space-y-2 text-muted text-sm list-disc pl-5 font-medium">
                  <li>You need 10,000+ records per day</li>
                  <li>Data freshness matters by the hour (monitoring)</li>
                  <li>Data source has stable structure</li>
                  <li>You have engineering resources to maintain it</li>
                </ul>
              </div>
              <div className="p-8 bg-accent/20 rounded-3xl border border-accent/20">
                <h3 className="text-xl font-bold mb-4 text-accent">Use ImageSnap when:</h3>
                <ul className="space-y-2 text-muted text-sm list-disc pl-5 font-medium">
                  <li>You need 50–500 curated, high-quality records</li>
                  <li>You care about image quality and context</li>
                  <li>You want structured data in Google Sheets instantly</li>
                  <li>Policy compliance and risk reduction are priority</li>
                </ul>
              </div>
            </div>
            <p className="mt-8 text-center text-muted italic text-sm">Many teams use both — a scraper for broad monitoring and ImageSnap for high-quality research records.</p>
          </section>

          <section id="faq" className="space-y-6">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            <div className="space-y-4">
              {[
                { q: "Is ImageSnap just a scraper with a UI?", a: "No. A scraper sends automated requests. ImageSnap works inside your browser session — it captures data from pages you're already viewing normally." },
                { q: "What about websites that block scrapers?", a: "Since ImageSnap operates within your normal browser session, there's nothing to block. Anti-bot measures don't apply because you're browsing like a real human." },
                { q: "Does ImageSnap work on any website?", a: "It works best on e-commerce and listing pages with structured product data. It captures images and context from most modern product platforms." }
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
