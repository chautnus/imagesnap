import React from 'react';
import { SEOPage } from '../SEOPage';

export const DriveFolderGenerator = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      title="Google Drive Folder Structure Generator — ImageSnap"
      description="Automatically generate consistent Google Drive folder structures for every new project, client, or shoot. ImageSnap creates the right folders on first capture — no manual setup required."
      headline={<>The right folder structure, <span className="text-accent italic">every time.</span></>}
      subheadline="Stop creating Drive folders by hand. ImageSnap generates your project folder structure automatically when you start a new capture — based on rules you define once."
      onCtaClick={onLogin}
      ctaText="Try ImageSnap free"
      content={
        <div className="space-y-16">

          <section>
            <h2 className="text-3xl font-black mb-6">The folder structure problem</h2>
            <p className="text-muted text-lg mb-6 leading-relaxed font-medium">
              Every team has a "correct" folder structure in theory. In practice, folders get created inconsistently — different people name things differently, subfolders are skipped when someone is in a hurry, and six months later nobody can find the Q3 shoot for Client X because it ended up in five different places depending on who created it.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-red-400/5 border border-red-400/10 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold text-red-400">Manual folder creation</h3>
                <ul className="space-y-2 text-muted text-sm leading-relaxed">
                  <li>• Inconsistent naming across team members</li>
                  <li>• Subfolders skipped when in a hurry</li>
                  <li>• Takes time to set up before every project</li>
                  <li>• Structure drifts over time — no enforcement</li>
                </ul>
              </div>
              <div className="p-8 bg-accent/5 border border-accent/20 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold text-accent">ImageSnap auto-generation</h3>
                <ul className="space-y-2 text-sm leading-relaxed">
                  <li>• Same structure for every project, every time</li>
                  <li>• Created automatically on first capture</li>
                  <li>• No setup time — just start capturing</li>
                  <li>• Rules defined once, applied forever</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">How folder generation works in ImageSnap</h2>
            <div className="space-y-6">
              {[
                { step: "01", title: "Define your folder template", desc: "In ImageSnap settings, configure the folder path pattern for each category. For example: Drive Root → Client Name → Project Code → Shoot Date. Variables like {client} and {date} are filled in from your metadata fields." },
                { step: "02", title: "Start a capture", desc: "When you capture the first image for a new project, ImageSnap checks whether the destination folder already exists. If it doesn't, it creates the full path automatically." },
                { step: "03", title: "All subsequent captures go to the same place", desc: "Every capture for that project routes to the same folder structure. Teammates using the same project config get the same structure on their captures too." },
                { step: "04", title: "Navigate in Drive like you planned it", desc: "Open Google Drive and the folder hierarchy looks exactly like your template — because it was generated from it, not created by hand." },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <div className="text-4xl font-black text-accent/30 leading-none">{item.step}</div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">Example folder structures by industry</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  industry: "E-commerce studio",
                  structure: ["ImageSnap Root/", "  → {Client Name}/", "    → {SKU}/", "      → {Angle}/"],
                  desc: "Each product has its own folder. Angles (front, back, detail) are subfolders.",
                },
                {
                  industry: "Real estate photography",
                  structure: ["ImageSnap Root/", "  → {Year}-{Month}/", "    → {Property Address}/", "      → {Room Type}/"],
                  desc: "Date-organized at the top level for volume; address and room below.",
                },
                {
                  industry: "Field inspections",
                  structure: ["ImageSnap Root/", "  → {Site Name}/", "    → {Inspection Date}/", "      → {Area}/"],
                  desc: "Site-first organization with date-stamped inspection sessions.",
                },
                {
                  industry: "Competitor research",
                  structure: ["ImageSnap Root/", "  → {Competitor}/", "    → {Category}/", "      → Captures/"],
                  desc: "Competitor-first, then product category for easy comparison across brands.",
                },
              ].map((item, i) => (
                <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                  <h3 className="font-bold text-accent">{item.industry}</h3>
                  <pre className="text-xs text-muted font-mono leading-relaxed bg-black/20 p-4 rounded-xl overflow-x-auto">{item.structure.join('\n')}</pre>
                  <p className="text-muted text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem]">
            <h2 className="text-3xl font-black mb-4">No lock-in — it&apos;s just Google Drive</h2>
            <p className="text-muted leading-relaxed font-medium">
              The folders ImageSnap creates are standard Google Drive folders. If you stop using ImageSnap tomorrow, every folder and file stays exactly where it is. You own the structure because it lives in your Drive, not in a proprietary system.
            </p>
          </section>

          <section id="faq" className="space-y-4">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            {[
              { q: "Can I change the folder structure template after I've already started capturing?", a: "Yes. You can update the template at any time. Future captures will use the new template. Existing captures stay in their original folders — ImageSnap won't move files that are already in Drive." },
              { q: "What happens if two team members capture at the same time?", a: "Google Drive handles concurrent folder creation gracefully — if both users trigger folder creation at the same moment, Drive deduplicates and both captures land in the same folder." },
              { q: "Can I use the folder generator for a one-time project setup without capturing?", a: "Currently, folder creation is triggered by the first capture in a project. Manual folder pre-generation (without a capture) is on the roadmap as a standalone feature." },
              { q: "Does ImageSnap support Google Shared Drives (Team Drives)?", a: "Yes. You can configure ImageSnap to write to a Shared Drive. All folder generation and capture logging works the same way — the only difference is the root destination." },
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
