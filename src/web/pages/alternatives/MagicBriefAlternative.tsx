import React from 'react';
import { SEOPage } from '../SEOPage';

export const MagicBriefAlternative = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      title="MagicBrief Alternative — No Custom Quote, No $249/month | ImageSnap"
      description="MagicBrief requires a custom quote and costs $249+/month. ImageSnap is $9.99/month, no sales call required. Capture ads with custom fields to your own Google Drive."
      headline={<>MagicBrief Costs How Much? <span className="text-accent italic">There's an Alternative.</span></>}
      subheadline="MagicBrief requires a custom pricing call and starts at $249/month. ImageSnap is $9.99/month, no demo required. Your ad creative research goes to your Google Drive and Sheets — not a third-party database."
      onCtaClick={onLogin}
      ctaText="Get started for $9.99"
      content={
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-black mb-6">The MagicBrief Pricing Problem</h2>
            <p className="text-muted text-lg leading-relaxed font-medium mb-8">
              MagicBrief is a good tool for large ad teams. But for solo performance marketers or small teams, the pricing structure creates a clear problem: you need a custom quote just to find out what you'll pay. The starting point is $249/month or more, depending on ad spend and team size.
            </p>
            <div className="bg-red-400/5 border border-red-400/20 p-8 rounded-[2rem]">
              <p className="text-red-400 font-bold text-xl mb-2">The comparison users make:</p>
              <p className="text-muted font-medium">
                "MagicBrief is great for organizing ideas — but it stops short of helping you improve results. And for $249/month, I need more than inspiration."
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6 text-center">Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted"> </th>
                    <th className="py-4 px-4 font-semibold">MagicBrief</th>
                    <th className="py-4 px-4 font-semibold text-accent">ImageSnap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {[
                    ['Price', '$249+/month (custom)', '$9.99/month'],
                    ['Pricing transparency', '❌ Requires a call', '✅ Listed publicly'],
                    ['Custom metadata fields', 'Preset only', '✅ Define your own'],
                    ['Ad capture from browser', '✅', '✅'],
                    ['Works on any website', '❌ Ad libraries focus', '✅ Any URL'],
                    ['Images stored in', 'MagicBrief servers', '✅ Your Google Drive'],
                    ['Data export to Sheets', '❌', '✅ Native'],
                    ['Data ownership on cancel', '❌', '✅ Stays in your Drive'],
                  ].map(([label, magic, snap]) => (
                    <tr key={label}>
                      <td className="py-4 px-4 font-medium text-muted">{label}</td>
                      <td className={`py-4 px-4 ${label === 'Price' ? 'text-red-400 font-bold' : 'text-muted'}`}>{magic}</td>
                      <td className="py-4 px-4 text-accent font-semibold">{snap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">Who ImageSnap Is Right For</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-accent/10 border border-accent/20 rounded-3xl">
                <h3 className="text-xl font-bold text-accent mb-4">Great fit</h3>
                <ul className="space-y-2 text-muted text-sm font-medium">
                  <li>• Solo performance marketers building a structured swipe file</li>
                  <li>• Small teams who need to share an ad creative library</li>
                  <li>• Brands tracking competitor ads across multiple sites, not just ad libraries</li>
                  <li>• Anyone who wants their data in Google Drive, not a third-party server</li>
                </ul>
              </div>
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <h3 className="text-xl font-bold text-muted mb-4">Might not be the right fit</h3>
                <ul className="space-y-2 text-muted text-sm font-medium">
                  <li>• Large media agencies managing hundreds of clients</li>
                  <li>• Teams that need deep ad performance analytics built in</li>
                  <li>• Users who primarily want to browse a shared community ad library</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="faq" className="space-y-4">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            {[
              {
                q: 'Can I capture ads from Facebook and TikTok?',
                a: 'Yes. ImageSnap works inside your browser. Open the Facebook Ad Library or TikTok Creative Center, browse normally, and click capture on any ad you want to save. Image to Drive, metadata to Sheets.',
              },
              {
                q: 'Does ImageSnap have a shared ad database like MagicBrief?',
                a: "No — ImageSnap is a capture tool for building your own library, not a community browsing platform. If you need to browse other people's swipe files, that's a different use case.",
              },
              {
                q: 'How quickly can I get started?',
                a: 'Install the Chrome extension, connect your Google account, and start capturing in under 5 minutes. No demo, no sales call, no custom quote.',
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
