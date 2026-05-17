import React from 'react';
import { SEOPage } from '../SEOPage';

export const FieldInspections = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      title="Field Inspection Photo Documentation — ImageSnap"
      description="Capture site photos directly to Google Drive with location, inspector, and defect data attached. ImageSnap turns field inspection documentation into a searchable, auditable record — no app downloads required."
      headline={<>Field photos that <span className="text-accent italic">document themselves.</span></>}
      subheadline="Capture site conditions, tag with location and inspector name, and have every photo land in the right Drive folder — with a full audit log in Google Sheets."
      onCtaClick={onLogin}
      ctaText="Try ImageSnap free"
      content={
        <div className="space-y-16">

          <section>
            <h2 className="text-3xl font-black mb-6">Why field documentation breaks down</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed font-medium">
              Field inspectors take dozens of photos per site. At the end of the day, those photos need to be matched to specific locations, defects, and inspection items — then delivered to a client or supervisor as an organized record. Most teams do this by memory, which means errors, missing context, and hours of post-processing.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-red-400">What usually goes wrong</h3>
                <ul className="space-y-3 text-muted text-sm font-medium leading-relaxed">
                  <li>• Inspector can&apos;t remember which photo matches which defect</li>
                  <li>• Context added after the fact from rough notes</li>
                  <li>• No audit trail — when was the photo taken, by whom?</li>
                  <li>• Photos emailed in batches with no structure</li>
                  <li>• Client disputes a finding — no timestamped evidence</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">What ImageSnap fixes</h3>
                <ul className="space-y-3 text-sm font-medium leading-relaxed">
                  <li>• Context captured at the moment of the photo</li>
                  <li>• Inspector name, site, and defect type tagged instantly</li>
                  <li>• Automatic timestamp logged to Sheets on capture</li>
                  <li>• All photos organized by site in Drive</li>
                  <li>• Share the Sheet as the formal inspection record</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">Inspection documentation workflow</h2>
            <div className="space-y-6">
              {[
                { step: "01", title: "Create a project for each site or inspection", desc: "Set up a project in ImageSnap before the inspection. The Drive folder and Sheet are created automatically. Share with the inspection team in one step." },
                { step: "02", title: "Capture on-site with the mobile web app", desc: "Open ImageSnap in your mobile browser during the inspection. Capture photos directly — no app download needed. Tag defect type, location, and severity before moving to the next item." },
                { step: "03", title: "Photos route to Drive automatically", desc: "Each captured photo lands in the correct site folder with metadata attached. No manual file transfer at the end of the day." },
                { step: "04", title: "Share the Sheet as the inspection record", desc: "The Google Sheet is your formal report. Filter by defect type, severity, or area. Export to PDF or share directly with the client or supervisor." },
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
            <h2 className="text-3xl font-black mb-4">Metadata fields for field inspections</h2>
            <p className="text-muted mb-8 font-medium leading-relaxed">Configure these fields once per inspection type. Inspectors fill them in at capture — the context is saved automatically alongside the photo.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["Site / Location", "Inspector Name", "Defect Type", "Severity", "Area / Zone", "Inspection Date", "Reference Number", "Follow-up Required"].map((field) => (
                <div key={field} className="px-4 py-3 bg-accent/5 border border-accent/20 rounded-xl text-sm font-medium text-accent">{field}</div>
              ))}
            </div>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem]">
            <h2 className="text-3xl font-black mb-4">Works in any browser, on any device</h2>
            <p className="text-muted leading-relaxed font-medium">
              No app download. No MDM enrollment. No IT approval required. ImageSnap runs in Chrome and Edge on any device — phone, tablet, or laptop. Inspectors use the same browser they already have, and photos go to the same Google Drive the team already uses.
            </p>
          </section>

          <section id="faq" className="space-y-4">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            {[
              { q: "Does ImageSnap work offline during site inspections?", a: "ImageSnap requires an internet connection to capture and upload photos in real time. For sites with poor connectivity, we recommend capturing photos locally and uploading via the web app when back on network. Offline capture is on the roadmap." },
              { q: "Can multiple inspectors work on the same site project?", a: "Yes. Multiple team members can be added to the same Google Drive folder and Sheet. Each capture is logged with the inspector's account name, so you always know who documented what." },
              { q: "How do I export the inspection record for a client report?", a: "The Google Sheet is the inspection record. You can filter by site, date, or defect type, then export to PDF or CSV. Alternatively, share the Sheet directly with the client in view-only mode." },
              { q: "Is the photo evidence admissible if a defect is disputed?", a: "ImageSnap logs a capture timestamp for every photo in the Google Sheet. The original file in Google Drive also retains its creation metadata. This creates a verifiable record — but consult your legal team for jurisdiction-specific requirements." },
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
