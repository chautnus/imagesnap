import React from 'react';
import { SEOPage } from '../SEOPage';

export const GooglePhotosVsImageSnap = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      title="Google Photos vs ImageSnap: Which is Right for Your Team? — ImageSnap"
      description="Google Photos is great for personal memories. ImageSnap is built for professional workflows — web capture, structured metadata, Google Sheets logging, and Drive organization by project or client."
      headline={<>Google Photos is for memories. <span className="text-accent italic">ImageSnap is for work.</span></>}
      subheadline="Both sync to Google. Only one lets you attach custom context to every image, organize by project, log to Sheets, and capture directly from any website."
      onCtaClick={onLogin}
      ctaText="Try ImageSnap for free"
      content={
        <div className="space-y-16">

          <section>
            <h2 className="text-3xl font-black mb-6">The core difference</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed font-medium">
              Google Photos solves personal storage: your phone uploads everything, AI organizes by face and location, and you can search "beach 2023." That's genuinely useful — for personal use.
            </p>
            <p className="text-muted text-lg mb-8 leading-relaxed font-medium">
              For professional teams — researchers, e-commerce buyers, construction managers, marketing teams — you need a different set of guarantees: controlled folder structure, business-defined metadata fields, spreadsheet logging, and the ability to capture images directly from the web without downloading and re-uploading.
            </p>
            <div className="bg-accent/5 border border-accent/20 p-8 rounded-[2rem] text-center">
              <p className="font-bold text-xl">Google Photos asks: <span className="text-muted">"When was this taken?"</span><br/>ImageSnap asks: <span className="text-accent">"What does this mean for your work?"</span></p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6 text-center">Side-by-side comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Feature</th>
                    <th className="py-4 px-4 font-semibold text-muted">Google Photos</th>
                    <th className="py-4 px-4 font-semibold text-accent">ImageSnap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {[
                    ["Stores in Google Drive",           "❌ (separate storage)", "✅ Native Drive folders"],
                    ["Custom metadata fields",           "❌",                   "✅ You design them"],
                    ["Google Sheets logging",            "❌",                   "✅ Every capture logged"],
                    ["Capture from any website",         "❌",                   "✅ One-click extension"],
                    ["Folder structure by project",      "❌ AI-organized only", "✅ Your rules"],
                    ["Team access control",              "Shared albums only",   "✅ Via Drive permissions"],
                    ["Search by custom field",           "❌",                   "✅ Filter in Sheets"],
                    ["No AI scanning your biz photos",   "❌ AI-analyzed",       "✅ Your data, your control"],
                    ["Works without a phone upload",     "❌",                   "✅ Web capture"],
                    ["Free tier",                        "15GB storage",         "30 captures/month"],
                  ].map(([feature, gp, snap], i) => (
                    <tr key={i} className={i % 2 === 0 ? '' : 'bg-white/[0.01]'}>
                      <td className="py-3 px-4 font-medium">{feature}</td>
                      <td className="py-3 px-4 text-muted">{gp}</td>
                      <td className="py-3 px-4 font-bold text-accent">{snap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">Where Google Photos falls short for teams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-red-400/5 border border-red-400/10 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold text-red-400">No structured metadata</h3>
                <p className="text-muted text-sm leading-relaxed">Google Photos captures EXIF data (device, date, GPS). It can't store your custom fields — product SKU, supplier name, project code, competitor name. The context that makes images useful for work simply doesn't exist.</p>
              </div>
              <div className="p-8 bg-red-400/5 border border-red-400/10 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold text-red-400">AI owns your organization</h3>
                <p className="text-muted text-sm leading-relaxed">Google Photos organizes by its own AI logic — faces, locations, events. You can create albums manually, but there's no way to enforce a folder hierarchy that matches your business workflow.</p>
              </div>
              <div className="p-8 bg-red-400/5 border border-red-400/10 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold text-red-400">Can't capture from the web</h3>
                <p className="text-muted text-sm leading-relaxed">If you want to save a competitor's product image, a supplier photo, or a reference from a website, Google Photos requires download → upload. ImageSnap captures in one click directly from the browser.</p>
              </div>
              <div className="p-8 bg-red-400/5 border border-red-400/10 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold text-red-400">No Sheets integration</h3>
                <p className="text-muted text-sm leading-relaxed">Google Photos has no concept of a log or a database. Every image is an isolated island. You can't filter by custom field, build a delivery report, or share a structured view with a client or teammate.</p>
              </div>
            </div>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem]">
            <h2 className="text-3xl font-black mb-4">They solve different problems — use both</h2>
            <p className="text-muted leading-relaxed mb-4 font-medium">
              You don't have to choose. Google Photos is still the best place for personal photos from your phone. ImageSnap is for your professional image workflow — product research, field documentation, competitor tracking, supplier sourcing.
            </p>
            <p className="text-muted leading-relaxed font-medium">
              The key distinction: Google Photos asks "when and where was this taken?" ImageSnap asks "what does this mean for your project, and what data should be attached to it?"
            </p>
          </section>

          <section id="faq" className="space-y-4">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            {[
              { q: "Can ImageSnap replace Google Photos for my team?", a: "For professional use cases — yes. For personal phone photo backup, Google Photos is still the right tool. ImageSnap is designed for structured work workflows, not personal memory storage." },
              { q: "Does ImageSnap use Google Drive storage quota?", a: "Yes. Images captured by ImageSnap are stored in your Google Drive and count toward your storage quota, like any other Drive file." },
              { q: "Can I use ImageSnap if my team is on Google Workspace?", a: "Absolutely. ImageSnap connects to Google Workspace accounts the same way it connects to personal Google accounts. Drive permissions and folder sharing work exactly as you'd expect." },
              { q: "What if I already have 50,000 photos in Google Photos?", a: "ImageSnap only manages new captures going forward. Your existing Google Photos library stays untouched. If you want to migrate specific assets to Drive, you can download and re-upload them, but there's no automated migration tool." },
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
