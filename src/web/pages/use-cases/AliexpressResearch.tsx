import React from 'react';
import { SEOPage } from '../SEOPage';

export const AliexpressResearch = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      title="AliExpress Product Research — Organize Images & Data in One Click"
      description="Stop copy-pasting between AliExpress, Google Sheets, and Drive. ImageSnap captures product images with price, supplier, and custom notes — automatically organized."
      headline={<>AliExpress Research Without the <span className="text-accent italic">Copy-Paste.</span></>}
      subheadline="Every product you find on AliExpress, Temu, or any supplier site — captured in one click with its image, price, URL, and your custom notes. Straight to Google Drive and Sheets."
      onCtaClick={onLogin}
      ctaText="Start researching products faster"
      content={
        <div className="space-y-16">
          <section>
            <h2 className="text-3xl font-black mb-6">The Problem With Current Research Workflows</h2>
            <p className="text-muted text-lg mb-6 leading-relaxed font-medium">
              You open AliExpress. You find a product. Then you right-click to save the image, open your spreadsheet, paste the title, copy the price, paste the URL, upload the image to Drive, and link it back to the Sheet row.
            </p>
            <p className="text-muted text-lg leading-relaxed font-medium">
              That's 7 steps. For one product. At 50 products a session, you've spent more time moving data than actually evaluating products.
            </p>
            <div className="mt-8 bg-red-400/5 border border-red-400/20 p-8 rounded-[2rem] text-center">
              <p className="text-red-400 font-bold text-2xl">"Too many tabs, too little clarity — and still unsure what to sell."</p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">The ImageSnap Workflow</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: '01', title: 'Browse normally', desc: 'Open AliExpress, Temu, CJ Dropshipping, or any supplier site — exactly as you do today.' },
                { step: '02', title: 'Click once', desc: 'Hit the ImageSnap extension. The product image is captured and uploaded to your Google Drive folder automatically.' },
                { step: '03', title: 'Done', desc: 'Price, URL, and your custom fields (MOQ, shipping time, margin estimate) are logged to your Google Sheet instantly.' },
              ].map((s) => (
                <div key={s.step} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <div className="text-5xl font-black text-accent/30 mb-4">{s.step}</div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-light p-10 rounded-[3rem] border border-white/5">
            <h2 className="text-3xl font-black mb-8 text-center">Before vs After</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Task</th>
                    <th className="py-4 px-4 font-semibold text-red-400">Manual</th>
                    <th className="py-4 px-4 font-semibold text-accent">With ImageSnap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ['Save product image', '45s — download + upload + rename', '0s — automatic'],
                    ['Log price & title', '30s — copy + paste into Sheet', '0s — auto-extracted'],
                    ['Add custom notes', '15s — type into Sheet', '5s — in the extension popup'],
                    ['200 products', '~6.5 hours', '~17 minutes'],
                  ].map(([task, manual, smart]) => (
                    <tr key={task}>
                      <td className="py-4 px-4 font-medium">{task}</td>
                      <td className="py-4 px-4 text-red-400 text-sm">{manual}</td>
                      <td className="py-4 px-4 text-accent font-bold text-sm">{smart}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">Custom Fields for Dropshipping Research</h2>
            <p className="text-muted mb-6 leading-relaxed font-medium">
              Every dropshipper tracks different data. ImageSnap lets you define exactly which fields appear in your capture form — no generic templates.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Supplier', example: 'AliExpress / CJ / Temu' },
                { label: 'Price (USD)', example: '$3.20' },
                { label: 'Estimated margin', example: '65%' },
                { label: 'Shipping time', example: '7–12 days' },
                { label: 'MOQ', example: '1 unit' },
                { label: 'My rating', example: '⭐⭐⭐⭐' },
              ].map((f) => (
                <div key={f.label} className="p-5 bg-accent/5 border border-accent/10 rounded-2xl">
                  <p className="font-bold text-sm text-accent mb-1">{f.label}</p>
                  <p className="text-xs text-muted">{f.example}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">Works on Any Supplier Site</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['AliExpress', 'Temu', 'CJ Dropshipping', 'DHgate', 'Alibaba', '1688 (via proxy)', 'Lazada', 'Any website'].map((site) => (
                <div key={site} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center text-sm font-medium text-muted">
                  {site}
                </div>
              ))}
            </div>
          </section>

          <section id="faq" className="space-y-4">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            {[
              {
                q: 'Does it work on AliExpress product pages?',
                a: 'Yes. ImageSnap works on any webpage you can view in your browser. AliExpress, Temu, DHgate, CJ Dropshipping — if you can see the product, you can capture it.',
              },
              {
                q: 'Where does my data go?',
                a: 'Images go directly to a folder in your Google Drive. Product data (title, price, URL, your custom fields) is logged as a row in your Google Sheet. Both are owned by you.',
              },
              {
                q: 'Can I share my research with my team?',
                a: 'Yes. Share the Google Drive folder and Sheet with collaborators. Everyone captures into the same database.',
              },
              {
                q: 'What if I already have a spreadsheet I use?',
                a: "ImageSnap creates its own workspace in Drive, but you can export the Sheet data to any format. You own the data — export it, copy it, or link it however you need.",
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
