import React from 'react';
import { SEOPage } from '../SEOPage';

export const ShopifyCompetitorTracking = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      title="Shopify Competitor Tracking — Build a Visual Database | ImageSnap"
      description="Track Shopify competitor products, pricing, and positioning visually. ImageSnap captures what you see — images to Drive, data to Sheets — without scraping scripts."
      headline={<>Track Competitors <span className="text-accent italic">Visually.</span> No Scraper Needed.</>}
      subheadline="Browse competitor Shopify stores normally. When you see something worth tracking, click once. The product image, price, and your notes go straight to your Google Drive and Sheets database."
      onCtaClick={onLogin}
      ctaText="Start tracking competitors"
      content={
        <div className="space-y-16">
          <section>
            <h2 className="text-3xl font-black mb-6">Why Keyword Tools Miss the Bigger Picture</h2>
            <p className="text-muted text-lg mb-6 leading-relaxed font-medium">
              SEO tools show you what competitors rank for. They don't show you what their product pages actually look like, how they're pricing bundles, what new SKUs they just added, or what visual angle they're using on launch week.
            </p>
            <p className="text-muted text-lg leading-relaxed font-medium">
              The most valuable competitor intelligence comes from looking at their store — not at a keyword dashboard. ImageSnap is built for that kind of research.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">What You Can Track</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: '💰',
                  title: 'Pricing changes',
                  desc: 'Capture a product today and again in 2 weeks. Compare prices side by side in your Sheet without relying on memory or scattered screenshots.',
                },
                {
                  icon: '🖼️',
                  title: 'Product photography style',
                  desc: 'What angles are competitors using? Lifestyle vs. studio? Background colors? Build a visual reference library to inform your own creative.',
                },
                {
                  icon: '📦',
                  title: 'New product launches',
                  desc: "Browse their store weekly. Capture anything new. Your Sheet becomes a timestamped log of what they're adding and removing.",
                },
                {
                  icon: '📝',
                  title: 'Copy & positioning',
                  desc: 'Capture headlines, benefit bullets, and CTAs as notes alongside the product image. See how their messaging shifts over time.',
                },
              ].map((item) => (
                <div key={item.title} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex gap-6">
                  <div className="text-4xl shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-accent/10 p-10 rounded-[3rem] border border-accent/20">
            <h2 className="text-3xl font-black mb-6">The Weekly Tracking Workflow</h2>
            <ol className="space-y-6">
              {[
                { n: '1', t: 'Open your competitor list', d: 'A handful of Shopify stores you watch. Bookmark them or keep them in your Sheet.' },
                { n: '2', t: 'Browse normally', d: 'Scroll through new arrivals, sale pages, bestsellers. Spend 15–20 minutes.' },
                { n: '3', t: 'Capture what matters', d: "See something worth tracking? Click ImageSnap. Image to Drive, data to your Sheet. You're done." },
                { n: '4', t: 'Review your Sheet', d: 'Every capture is timestamped with URL, price, and your notes. Spot trends across sessions.' },
              ].map((step) => (
                <li key={step.n} className="flex gap-6 items-start">
                  <div className="w-10 h-10 rounded-full bg-accent text-bg font-black flex items-center justify-center shrink-0 text-lg">
                    {step.n}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{step.t}</p>
                    <p className="text-muted text-sm mt-1">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">ImageSnap vs. Scraping</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted"> </th>
                    <th className="py-4 px-4 font-semibold">Scraping script</th>
                    <th className="py-4 px-4 font-semibold text-accent">ImageSnap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {[
                    ['Setup time', 'Hours (dev work)', 'Minutes'],
                    ['Breaks when site changes', '✅ Yes', '❌ Never'],
                    ['Captures what you actually see', '❌ Raw HTML only', '✅ Exactly what you see'],
                    ['Custom fields', '❌ Re-code every time', '✅ In-app, no code'],
                    ['Data ownership', 'Server / database', 'Your Google Drive'],
                  ].map(([label, scrape, snap]) => (
                    <tr key={label}>
                      <td className="py-4 px-4 font-medium text-muted">{label}</td>
                      <td className="py-4 px-4 text-red-400">{scrape}</td>
                      <td className="py-4 px-4 text-accent font-semibold">{snap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="faq" className="space-y-4">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            {[
              {
                q: 'Does it work on password-protected Shopify stores?',
                a: 'ImageSnap captures what you can see in your browser. If you have access to the page (e.g., a wholesale account), you can capture it.',
              },
              {
                q: 'Can I track the same product over time?',
                a: "Yes. Each capture is a new row with a timestamp. Capture the same product page weekly and compare price changes, image updates, and copy shifts directly in your Sheet.",
              },
              {
                q: 'How is this different from just taking screenshots?',
                a: 'Screenshots are images with no context. ImageSnap captures the image plus price, URL, title, and any custom fields you define — all organized in Google Sheets for filtering and comparison.',
              },
            ].map((item, i) => (
              <details key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 group">
                <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-lg">
                  {item.q}
                  <span className="transition group-open:rotate-180">▾</span>
                </summary>
                <p className="text-muted mt-4 leading-relaxed font-medium">{item.a}</p>
              </details>
            ))}
          </section>
        </div>
      }
    />
  );
};
