import React from 'react';
import { SEOPage } from '../SEOPage';

export const SwipeFileTool = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <SEOPage 
      title="The Swipe File Tool Marketers Have Been Waiting For"
      description="Stop losing marketing inspiration in screenshot folders. ImageSnap turns your swipe file into a structured, searchable database with images in Drive and data in Sheets."
      headline={<>A Swipe File Tool That Actually <span className="text-accent italic">Works.</span></>}
      subheadline="Stop digital hoarding. Transform your inspiration into a structured database of marketing intelligence you can search, filter, and reuse."
      onCtaClick={onLogin}
      ctaText="Build your structured swipe file"
      content={
        <div className="space-y-16">
          <section>
            <h2 className="text-3xl font-black mb-6">The Swipe File Problem</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed font-medium">
              Every marketer has a swipe file. The problem is where it lives. Screenshots named `IMG_4392.png` or 400 Pinterest pins with no context. 
              When you actually need the inspiration — for a campaign brief or a pitch deck — you can't find it.
            </p>
            <div className="bg-red-400/5 border border-red-400/20 p-8 rounded-[2rem] text-center">
               <p className="text-red-400 font-bold text-xl">"A swipe file without context is just digital hoarding."</p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">What a Useful Swipe File Needs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <div className="text-4xl mb-4">👁️</div>
                  <h3 className="text-xl font-bold mb-2">The Visual</h3>
                  <p className="text-sm text-muted">The ad, the landing page, or the product shot worth remembering.</p>
               </div>
               <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <div className="text-4xl mb-4">🧠</div>
                  <h3 className="text-xl font-bold mb-2">The Context</h3>
                  <p className="text-sm text-muted">Brand, channel, technique, and why it caught your eye in the first place.</p>
               </div>
               <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-bold mb-2">The Structure</h3>
                  <p className="text-sm text-muted">A way to search, filter, and compare entries across your entire collection.</p>
               </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6 text-center">ImageSnap vs Other Methods</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Method</th>
                    <th className="py-4 px-4 font-semibold">Context</th>
                    <th className="py-4 px-4 font-semibold">Searchable</th>
                    <th className="py-4 px-4 font-semibold text-accent">Structured</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-4 px-4">Screenshots folder</td>
                    <td className="py-4 px-4 text-red-400">❌</td>
                    <td className="py-4 px-4">Filename only</td>
                    <td className="py-4 px-4 text-red-400">❌</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Pinterest board</td>
                    <td className="py-4 px-4">Link only</td>
                    <td className="py-4 px-4">Tags</td>
                    <td className="py-4 px-4 text-red-400">❌</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Notion database</td>
                    <td className="py-4 px-4">✅ (Manual)</td>
                    <td className="py-4 px-4">✅</td>
                    <td className="py-4 px-4">Semi</td>
                  </tr>
                  <tr className="bg-accent/5">
                    <td className="py-4 px-4 font-bold">ImageSnap</td>
                    <td className="py-4 px-4 font-bold text-accent">✅ (Auto-fill)</td>
                    <td className="py-4 px-4 font-bold text-accent">✅ (Sheets)</td>
                    <td className="py-4 px-4 font-bold text-accent">✅ (Native)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-accent/10 p-10 rounded-[3rem] border border-accent/20">
             <h2 className="text-3xl font-black mb-8">Set Up Your Marketing Swipe File</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <h3 className="text-xl font-bold">Recommended Fields:</h3>
                   <ul className="space-y-2 text-muted font-medium text-sm">
                      <li>• <strong>Brand</strong> — who made this?</li>
                      <li>• <strong>Channel</strong> — ad, email, landing page?</li>
                      <li>• <strong>Technique</strong> — social proof, urgency, UGC?</li>
                      <li>• <strong>Rating</strong> — how good is the execution?</li>
                      <li>• <strong>Notes</strong> — why did you save it?</li>
                   </ul>
                </div>
                <div className="space-y-4">
                   <h3 className="text-xl font-bold">The Workflow:</h3>
                   <p className="text-muted text-sm font-medium leading-relaxed">
                      Browsing social ads? Click. Checking competitor emails? Click. 
                      Everything goes to your shared Drive and Sheet. 
                      Two months later, filter by "Technique: social proof" and find your best examples instantly.
                   </p>
                </div>
             </div>
          </section>

          <section id="faq" className="space-y-6">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            <div className="space-y-4">
              {[
                { q: "Can I capture ads from social media?", a: "Yes. If you can see it in your browser, you can capture it. Facebook ads, Instagram, Twitter — images save to Drive, context to Sheets." },
                { q: "Can my whole marketing team share the swipe file?", a: "Yes. Share the Google Sheet and Drive folder with your team. Everyone captures into the same database. Filter by team member to see who found what." },
                { q: "What if I want to capture a full landing page?", a: "You can screenshot the page and capture that screenshot with context. ImageSnap handles the image upload and data extraction for you." }
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
