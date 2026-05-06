import React from 'react';
import { SEOPage } from '../SEOPage';

export const ComparisonWebClipper = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <SEOPage 
      title="Web Clippers Save Pages. ImageSnap Saves Structured Data."
      description="Notion Web Clipper, Pinterest, and Eagle save content — but not structured data. ImageSnap captures images + your custom context into Google Sheets. Compare them."
      headline={<>Web Clippers Save <span className="text-accent italic">Pages</span>. ImageSnap Saves <span className="text-accent italic">Structured Data</span>.</>}
      subheadline="The problem isn't saving. It's saving without context. Stop clipping and start capturing data that stays useful forever."
      onCtaClick={onLogin}
      ctaText="Save images with context"
      content={
        <div className="space-y-16">
          <section>
            <h2 className="text-3xl font-black mb-6">The Clipper Gap</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              Web clippers are designed to save content. They do that well. What they don't do is capture structured, queryable data. 
              The result is always the same: a collection of "stuff" with no structure.
            </p>
            
            <div className="glass-light p-8 rounded-3xl overflow-hidden border border-white/5">
              <h3 className="text-xl font-bold mb-6">What you get with a typical web clipper:</h3>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 font-semibold">Tool</th>
                    <th className="py-3 px-4 font-semibold">What it saves</th>
                    <th className="py-3 px-4 font-semibold text-red-400">What it misses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr><td className="py-3 px-4">Notion Web Clipper</td><td className="py-3 px-4">Full page HTML/MD</td><td className="py-3 px-4 text-red-400">Structured fields</td></tr>
                  <tr><td className="py-3 px-4">Pinterest</td><td className="py-3 px-4">Image + link</td><td className="py-3 px-4 text-red-400">Price, description</td></tr>
                  <tr><td className="py-3 px-4">Eagle</td><td className="py-3 px-4">Image + tags</td><td className="py-3 px-4 text-red-400">Spreadsheet view</td></tr>
                  <tr><td className="py-3 px-4">Browser bookmarks</td><td className="py-3 px-4">URL only</td><td className="py-3 px-4 text-red-400">Everything else</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">What ImageSnap Does Differently</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                 <h3 className="text-xl font-bold mb-3 text-accent">Images to Drive</h3>
                 <p className="text-sm text-muted">Organized in your Google Drive folders, not dumped in a proprietary cloud.</p>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                 <h3 className="text-xl font-bold mb-3 text-accent">Data to Sheets</h3>
                 <p className="text-sm text-muted">Auto-fills title, price, and source directly into your research spreadsheet.</p>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                 <h3 className="text-xl font-bold mb-3 text-accent">Custom Schema</h3>
                 <p className="text-sm text-muted">Define your own fields like project name, rating, or status tags.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-10 text-center">Comparison: Clippers vs ImageSnap</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Factor</th>
                    <th className="py-4 px-4 font-semibold">Notion Clipper</th>
                    <th className="py-4 px-4 font-semibold">Pinterest</th>
                    <th className="py-4 px-4 font-semibold text-accent">ImageSnap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Saves images</td>
                    <td className="py-4 px-4">✅ (embedded)</td>
                    <td className="py-4 px-4">✅</td>
                    <td className="py-4 px-4 text-accent">✅ (to your Drive)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Structured fields</td>
                    <td className="py-4 px-4">❌</td>
                    <td className="py-4 px-4">❌</td>
                    <td className="py-4 px-4 text-accent font-bold">✅ (Fully custom)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Spreadsheet view</td>
                    <td className="py-4 px-4">❌</td>
                    <td className="py-4 px-4">❌</td>
                    <td className="py-4 px-4 text-accent font-bold">✅ (Google Sheets)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Data export</td>
                    <td className="py-4 px-4">MD/CSV export</td>
                    <td className="py-4 px-4">❌</td>
                    <td className="py-4 px-4 text-accent font-bold">Native in Sheets</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Team ready</td>
                    <td className="py-4 px-4">✅ (Notion)</td>
                    <td className="py-4 px-4">Shared boards</td>
                    <td className="py-4 px-4 text-accent">✅ (Shared Drive)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="p-8 bg-black/20 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold mb-4">Use a web clipper when:</h3>
              <ul className="space-y-2 text-muted text-sm list-disc pl-5">
                <li>You want to save articles or recipes</li>
                <li>Visual mood boards are the primary goal</li>
                <li>You don't need structured, queryable data</li>
                <li>Saving for personal inspiration</li>
              </ul>
            </div>
            <div className="p-8 bg-accent/10 rounded-3xl border border-accent/20">
              <h3 className="text-xl font-bold mb-4 text-accent">Use ImageSnap when:</h3>
              <ul className="space-y-2 text-muted text-sm list-disc pl-5">
                <li>You need structured product data</li>
                <li>You want to compare products side-by-side</li>
                <li>Your workflow involves Sheets and Drive</li>
                <li>Building a research database, not a scrapbook</li>
              </ul>
            </div>
          </section>

          <section id="faq" className="space-y-6">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            <div className="space-y-4">
              {[
                { q: "Can I use ImageSnap alongside Notion?", a: "Yes. Many users keep Notion for notes and general knowledge, and use ImageSnap specifically for product research that needs structured data and image organization." },
                { q: "Does ImageSnap replace Pinterest for mood boards?", a: "Not exactly. Pinterest is great for visual inspiration. ImageSnap is for research where you need to track specific details — prices, suppliers, specs — alongside images." },
                { q: "Where do my images go?", a: "To your own Google Drive, in organized folders. Not to a third-party server, not embedded in a page — your Drive, your files." }
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
