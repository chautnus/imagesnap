import React from 'react';
import { SEOPage } from '../SEOPage';

export const PicsioAlternative = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      title="Pics.io Alternative: Simpler DAM Built on Google Drive — ImageSnap"
      description="Looking for a Pics.io alternative? ImageSnap gives you structured asset management on top of Google Drive — with web capture, custom metadata fields, and Sheets logging. No new platform to learn."
      headline={<>DAM without the <span className="text-accent italic">overhead.</span></>}
      subheadline="Pics.io is a full DAM platform. If you live in Google Drive and need to capture, tag, and organize assets fast — ImageSnap does that without the onboarding, the pricing tiers, or the extra tool to maintain."
      onCtaClick={onLogin}
      ctaText="Try ImageSnap free"
      content={
        <div className="space-y-16">

          <section>
            <h2 className="text-3xl font-black mb-6">Who actually needs Pics.io vs ImageSnap</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                <h3 className="text-xl font-bold text-muted">You need Pics.io if:</h3>
                <ul className="space-y-3 text-muted text-sm font-medium leading-relaxed">
                  <li>• You manage 100,000+ existing assets in multiple cloud sources</li>
                  <li>• You need AI-powered facial recognition or duplicate detection</li>
                  <li>• You have a dedicated DAM admin and a $500+/mo budget</li>
                  <li>• Your team is already off Google Workspace entirely</li>
                </ul>
              </div>
              <div className="p-8 bg-accent/5 border border-accent/20 rounded-3xl space-y-4">
                <h3 className="text-xl font-bold text-accent">ImageSnap is the better fit if:</h3>
                <ul className="space-y-3 text-sm font-medium leading-relaxed">
                  <li>• Your team already uses Google Drive and Sheets</li>
                  <li>• You need to capture images from the web with context attached</li>
                  <li>• You want structured metadata without a new platform</li>
                  <li>• You're a small team or solo operator who needs to move fast</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6 text-center">Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Feature</th>
                    <th className="py-4 px-4 font-semibold text-muted">Pics.io</th>
                    <th className="py-4 px-4 font-semibold text-accent">ImageSnap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {[
                    ["Built on Google Drive",       "Connects to it",  "✅ Native"],
                    ["Capture from any webpage",    "❌",              "✅ One-click extension"],
                    ["Custom metadata fields",      "✅ (complex setup)", "✅ (set up in 2 min)"],
                    ["Auto-log to Google Sheets",   "❌",              "✅"],
                    ["Team sharing",                "✅",              "✅ Via Drive"],
                    ["No new platform to learn",    "❌",              "✅"],
                    ["Free tier",                   "14-day trial",    "✅ 30 captures/mo"],
                    ["Starting price",              "$50+/mo",         "$9.99/mo"],
                  ].map(([feature, picsio, snap], i) => (
                    <tr key={i} className={i % 2 === 0 ? '' : 'bg-white/[0.01]'}>
                      <td className="py-3 px-4 font-medium">{feature}</td>
                      <td className="py-3 px-4 text-muted">{picsio}</td>
                      <td className="py-3 px-4 font-bold text-accent">{snap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">What ImageSnap does differently</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <h3 className="text-xl font-bold text-accent">Capture as you browse</h3>
                <p className="text-muted leading-relaxed text-sm">Pics.io manages assets you already have. ImageSnap captures them the moment you find them — on a competitor's site, a supplier's catalog, or a reference you're browsing. Image to Drive, metadata to Sheets, in one click.</p>
              </div>
              <div className="space-y-4 p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <h3 className="text-xl font-bold text-accent">Your data, your structure</h3>
                <p className="text-muted leading-relaxed text-sm">You design the metadata fields. ImageSnap doesn't impose a schema on you. Add fields for SKU, supplier, rating, project code — whatever your workflow needs. Change them per category without touching a settings panel.</p>
              </div>
              <div className="space-y-4 p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <h3 className="text-xl font-bold text-accent">Google Sheets as your database</h3>
                <p className="text-muted leading-relaxed text-sm">Every captured asset is automatically logged as a row in Sheets. Filter, pivot, share, build reports. No proprietary query language — just the spreadsheet tool your whole team already knows.</p>
              </div>
              <div className="space-y-4 p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <h3 className="text-xl font-bold text-accent">Zero migration risk</h3>
                <p className="text-muted leading-relaxed text-sm">Your assets live in your Google Drive. If you ever stop using ImageSnap, your files and Sheets stay exactly where they are. No export, no vendor lock-in, no data hostage situation.</p>
              </div>
            </div>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem]">
            <h2 className="text-3xl font-black mb-4">The migration story</h2>
            <p className="text-muted leading-relaxed mb-8 font-medium">
              Most teams that switch from Pics.io to ImageSnap aren't replacing a full DAM. They're simplifying. They had Pics.io for asset management but realized 80% of their daily work was just capturing new images from the web and tagging them for a project. ImageSnap handles that workflow end-to-end — no import scripts, no new admin panel, no retraining the team.
            </p>
            <p className="text-muted leading-relaxed font-medium">
              The Google Drive folder you already have becomes your asset library. The Google Sheet ImageSnap creates becomes your database. Setup takes 5 minutes.
            </p>
          </section>

          <section id="faq" className="space-y-4">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            {[
              { q: "Can ImageSnap replace Pics.io for a team of 10+?", a: "For teams whose primary need is capturing and tagging assets from the web into an organized Google Drive library — yes. If you need AI duplicate detection, multi-cloud ingestion, or enterprise compliance features, you'll want to stay on a full DAM." },
              { q: "What happens to my existing Pics.io assets if I switch?", a: "Your Pics.io assets are separate from ImageSnap. ImageSnap adds new assets to your Google Drive going forward. You can export your existing assets from Pics.io and drop them into Drive manually — or run both in parallel during a transition." },
              { q: "Does ImageSnap have a desktop app?", a: "ImageSnap is a Chrome/Edge browser extension and a web app. There's no separate desktop app. If you need to capture images from local files, you can upload them directly through the web app." },
              { q: "Is there a team plan?", a: "Yes. Multiple team members can use ImageSnap with a shared Google Drive folder and Google Sheet. Each user gets their own account and captures are logged with user attribution." },
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
