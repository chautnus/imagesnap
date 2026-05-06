import React from 'react';
import { SEOPage } from '../SEOPage';

export const ComparisonScrapingAPI = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <SEOPage 
      title="Do You Actually Need a Scraping API?"
      description="Scraping APIs like Apify and ScrapingBee are powerful — but expensive and complex. ImageSnap offers a simpler path for curated product research. Compare both."
      headline={<>Do You Actually Need a <span className="text-accent italic">Scraping API?</span></>}
      subheadline="Don't use a rocket ship to go to the grocery store. For curated research, simplicity beats complexity every time."
      onCtaClick={onLogin}
      ctaText="Research products without the complexity"
      content={
        <div className="space-y-16">
          <section>
            <h2 className="text-3xl font-black mb-6 text-center">The Scraping API Reality Check</h2>
            <p className="text-muted text-lg mb-10 text-center max-w-3xl mx-auto leading-relaxed">
              Scraping APIs like Apify, ScrapingBee, or Bright Data solve a real problem: getting data at scale. 
              But for many product researchers, they're solving the wrong problem.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-6">
                <h3 className="text-xl font-bold text-red-400">What you sign up for with an API:</h3>
                <ul className="space-y-3 text-sm text-muted font-medium">
                  <li className="flex justify-between"><span>Monthly cost</span> <span className="text-white">$49–$500+</span></li>
                  <li className="flex justify-between"><span>Setup time</span> <span className="text-white">Hours of config</span></li>
                  <li className="flex justify-between"><span>Learning curve</span> <span className="text-white">API docs & webhooks</span></li>
                  <li className="flex justify-between"><span>Data cleaning</span> <span className="text-white">Still required</span></li>
                  <li className="flex justify-between"><span>Image handling</span> <span className="text-white">Separate pipeline</span></li>
                </ul>
              </div>
              <div className="p-8 bg-accent/10 border border-accent/20 rounded-[2rem] space-y-6">
                <h3 className="text-xl font-bold text-accent">The ImageSnap Experience:</h3>
                <ul className="space-y-3 text-sm text-muted font-medium">
                  <li className="flex justify-between"><span>Monthly cost</span> <span className="text-white">Free tier available</span></li>
                  <li className="flex justify-between"><span>Setup time</span> <span className="text-white">2 minutes</span></li>
                  <li className="flex justify-between"><span>Learning curve</span> <span className="text-white">Zero</span></li>
                  <li className="flex justify-between"><span>Data cleaning</span> <span className="text-white">Clean on capture</span></li>
                  <li className="flex justify-between"><span>Image handling</span> <span className="text-white">Auto-saved to Drive</span></li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-10 text-center">Side-by-Side Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Factor</th>
                    <th className="py-4 px-4 font-semibold">Scraping API</th>
                    <th className="py-4 px-4 font-semibold text-accent">ImageSnap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Scale</td>
                    <td className="py-4 px-4">10k–1M+ records/day</td>
                    <td className="py-4 px-4 text-accent">Human browsing speed</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Setup</td>
                    <td className="py-4 px-4 text-red-400">Hours of coding/config</td>
                    <td className="py-4 px-4 text-accent font-bold">2 minutes</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Image handling</td>
                    <td className="py-4 px-4 text-red-400">Requires separate storage setup</td>
                    <td className="py-4 px-4 text-accent font-bold">Native Google Drive sync</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Data destination</td>
                    <td className="py-4 px-4">JSON/CSV (then import)</td>
                    <td className="py-4 px-4 text-accent font-bold">Direct in Google Sheets</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Policy risk</td>
                    <td className="py-4 px-4 text-red-400">Moderate (bot detection)</td>
                    <td className="py-4 px-4 text-accent font-bold">Minimal (human browsing)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white/[0.02] p-10 rounded-[3rem] border border-white/5">
            <h2 className="text-3xl font-black mb-8 text-center">When to Use Each</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Use a Scraping API when:</h3>
                <ul className="space-y-2 text-muted text-sm list-disc pl-5 font-medium leading-relaxed">
                  <li>You need 5,000+ records per run</li>
                  <li>Real-time price monitoring is the use case</li>
                  <li>You have a data engineering pipeline ready</li>
                  <li>Budget allows $50–$500/month for data infra</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Use ImageSnap when:</h3>
                <ul className="space-y-2 text-muted text-sm list-disc pl-5 font-medium leading-relaxed">
                  <li>You need 50–500 curated research records</li>
                  <li>Image quality and context matter as much as data</li>
                  <li>Your output destination is Google Sheets</li>
                  <li>You want to start capturing in minutes, not hours</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="faq" className="space-y-6">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            <div className="space-y-4">
              {[
                { q: "Is ImageSnap an API?", a: "No. ImageSnap is a browser extension. There's no API to configure, no webhooks to set up, and no coding required." },
                { q: "Can I integrate ImageSnap with other tools?", a: "Yes. Your data lives in Google Sheets and Drive — two of the most connected tools. You can use Zapier, Make, or Apps Script to build automations." },
                { q: "What happens to my data if I cancel?", a: "Everything stays. Your images are in your Google Drive and data in your Google Sheet. You own your research data completely." }
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
