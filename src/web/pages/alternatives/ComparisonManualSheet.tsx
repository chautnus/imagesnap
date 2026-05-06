import React from 'react';
import { SEOPage } from '../SEOPage';

export const ComparisonManualSheet = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <SEOPage 
      title="Still Copy-Pasting Product Data into Google Sheets?"
      description="Stop wasting hours on manual copy-paste. ImageSnap captures product images and details into your Google Sheet in one click. Compare the two workflows."
      headline={<>Still <span className="text-accent italic">Copy-Pasting</span> Product Data?</>}
      subheadline="For 50 products, that's 4+ hours of your day — doing work that adds zero insight to your research. There's a faster way."
      onCtaClick={onLogin}
      content={
        <div className="space-y-16">
          <section>
            <h2 className="text-3xl font-black mb-6">The Hidden Cost of Manual Research</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              Most product researchers start with a Google Sheet. It makes sense — Sheets is free, flexible, and familiar. 
              But the workflow around it is brutal. At 50 products per session, you're spending <strong>over 2 hours</strong> on data entry alone.
            </p>
            
            <div className="glass-light p-8 rounded-3xl overflow-hidden border border-white/5">
              <h3 className="text-xl font-bold mb-6">Time per product (manual):</h3>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 font-semibold">Step</th>
                    <th className="py-3 px-4 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr><td className="py-3 px-4">Open product page</td><td className="py-3 px-4">10s</td></tr>
                  <tr><td className="py-3 px-4">Copy title, price, description</td><td className="py-3 px-4">30s</td></tr>
                  <tr><td className="py-3 px-4">Save image, upload to Drive</td><td className="py-3 px-4">45s</td></tr>
                  <tr><td className="py-3 px-4">Paste image link into Sheet</td><td className="py-3 px-4">15s</td></tr>
                  <tr><td className="py-3 px-4">Add notes, source URL, tags</td><td className="py-3 px-4">40s</td></tr>
                  <tr className="font-bold text-accent"><td className="py-3 px-4">Total per product</td><td className="py-3 px-4">~2.5 min</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">What If One Click Did the Work?</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              ImageSnap turns that 2.5-minute process into a single click. 
              You browse a product page, click the extension, and let ImageSnap handle the rest.
              Your Sheet gets structured data, your Drive gets organized images, and you get your afternoon back.
            </p>
            <div className="bg-accent/10 p-8 rounded-3xl border border-accent/20">
               <p className="text-accent font-bold text-xl text-center">Time per product (ImageSnap): ~5 seconds.</p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">Side-by-Side Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Factor</th>
                    <th className="py-4 px-4 font-semibold">Manual Copy-Paste</th>
                    <th className="py-4 px-4 font-semibold text-accent">ImageSnap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Time per product</td>
                    <td className="py-4 px-4">2-5 minutes</td>
                    <td className="py-4 px-4 text-accent font-bold">~5 seconds</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Image handling</td>
                    <td className="py-4 px-4">Save → Upload → Link manually</td>
                    <td className="py-4 px-4 text-accent">Auto-saved to Drive</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Data accuracy</td>
                    <td className="py-4 px-4">Typos, missed fields</td>
                    <td className="py-4 px-4 text-accent">Consistent capture</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Custom fields</td>
                    <td className="py-4 px-4">Manual column management</td>
                    <td className="py-4 px-4 text-accent">Define once, auto-fill</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-muted">Scalability</td>
                    <td className="py-4 px-4">Gets painful after 20 products</td>
                    <td className="py-4 px-4 text-accent">Effortless for any volume</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">How to Switch (Takes 2 Minutes)</h2>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none counter-reset-step">
              {[
                "Install the ImageSnap extension from Chrome Web Store.",
                "Connect your Google account — ImageSnap uses your own Drive and Sheets.",
                "Open any product page and click the extension icon.",
                "See the data appear in your Sheet with images in your Drive."
              ].map((step, i) => (
                <li key={i} className="flex gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-bg font-black flex items-center justify-center">{i + 1}</span>
                  <p className="text-muted font-medium">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="faq" className="space-y-6">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            <div className="space-y-4">
              {[
                { q: "Does ImageSnap replace my Google Sheet?", a: "No. ImageSnap writes directly into your Google Sheet. It replaces the copy-paste process, not the spreadsheet." },
                { q: "Can I keep my existing Sheet columns?", a: "Yes. You define your own fields — ImageSnap captures into the structure you set up." },
                { q: "Is my data stored on ImageSnap servers?", a: "No. Images go to your Google Drive. Context goes to your Google Sheet. We don't store your research data." }
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
