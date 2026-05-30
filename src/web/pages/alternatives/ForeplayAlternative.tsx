import React from 'react';
import { SEOPage } from '../SEOPage';

export const ForeplayAlternative = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      title="Foreplay Alternative — Swipe File Tool at $9.99/month | ImageSnap"
      description="Foreplay costs $249/month. ImageSnap gives you a structured swipe file with images in Google Drive and data in Sheets — for $9.99. Your data, your Drive, no lock-in."
      headline={<>The Foreplay Alternative That Costs <span className="text-accent italic">$9.99.</span></>}
      subheadline="Foreplay starts at $249/month. ImageSnap gives you structured ad capture with custom fields, Google Drive storage, and Google Sheets logging — for $9.99/month. No proprietary database."
      onCtaClick={onLogin}
      ctaText="Switch to ImageSnap for $9.99"
      content={
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-black mb-6">Why Marketers Are Looking for a Foreplay Alternative</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-red-400">The Foreplay experience</h3>
                <ul className="space-y-2 text-muted text-sm font-medium">
                  <li>• $249+/month for solo marketers</li>
                  <li>• Users report they can't effectively categorize saved ads — chaos accumulates</li>
                  <li>• Mobile experience is limited</li>
                  <li>• Proprietary database — if you cancel, you lose your library</li>
                  <li>• No API access for downstream workflows</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-accent">The ImageSnap experience</h3>
                <ul className="space-y-2 text-muted text-sm font-medium">
                  <li>• $9.99/month — 25x less than Foreplay</li>
                  <li>• Custom fields defined by you — capture exactly what matters</li>
                  <li>• Images in Google Drive, data in Google Sheets</li>
                  <li>• Cancel anytime — your Drive and Sheet stay yours forever</li>
                  <li>• Works on any website, not just ad libraries</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6 text-center">Side-by-Side Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted"> </th>
                    <th className="py-4 px-4 font-semibold">Foreplay</th>
                    <th className="py-4 px-4 font-semibold text-accent">ImageSnap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {[
                    ['Monthly price', '$249+', '$9.99'],
                    ['Custom metadata fields', 'Limited', '✅ Fully customizable'],
                    ['Image storage', 'Foreplay servers', '✅ Your Google Drive'],
                    ['Data if you cancel', 'Lost access', '✅ Yours forever'],
                    ['Works on any website', '❌ Ad libraries only', '✅ Any URL'],
                    ['Google Sheets integration', '❌', '✅ Native'],
                    ['Team sharing', 'Paid seats', '✅ Share Drive + Sheet'],
                  ].map(([label, fore, snap]) => (
                    <tr key={label}>
                      <td className="py-4 px-4 font-medium text-muted">{label}</td>
                      <td className={`py-4 px-4 ${label === 'Monthly price' ? 'text-red-400 font-bold' : 'text-muted'}`}>{fore}</td>
                      <td className="py-4 px-4 text-accent font-semibold">{snap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">What You Give Up (Honestly)</h2>
            <p className="text-muted leading-relaxed font-medium mb-6">
              Foreplay has a curated ad library — you can browse other people's swipe files. ImageSnap doesn't. ImageSnap is a capture tool for your own research, not a browsing platform.
              If you're a solo marketer building your own structured database from what you find, ImageSnap is the better fit. If you mainly want to browse a shared ad library, Foreplay solves a different problem.
            </p>
          </section>

          <section id="faq" className="space-y-4">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            {[
              {
                q: 'Can ImageSnap save ads from Facebook Ad Library?',
                a: 'Yes. If you can see it in your Chrome browser, ImageSnap can capture it. Open the Facebook Ad Library, find an ad, and click capture. Image goes to Drive, your custom fields go to Sheets.',
              },
              {
                q: "What happens to my data if I cancel?",
                a: 'Nothing. Your Google Drive folder and Google Sheet stay exactly where they are — in your Google account. ImageSnap never holds your data.',
              },
              {
                q: 'Can I import my existing Foreplay library?',
                a: 'Not directly — ImageSnap starts fresh. If you export your Foreplay data, you can manually build your categories and start capturing going forward.',
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
