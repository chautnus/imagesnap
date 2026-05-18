import React from 'react';
import { SEOPage } from '../SEOPage';

export const BulkPhotoRenamer = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      title="Bulk Photo Renamer: Batch Rename Files for Google Drive — ImageSnap"
      description="Stop renaming photos one by one. ImageSnap captures images with structured metadata at the source — so your files are named correctly from the start, not fixed after the fact."
      headline={<>Never rename a photo <span className="text-accent italic">again.</span></>}
      subheadline="The best renaming strategy is capturing with the right context from the start. ImageSnap tags every image with your metadata fields at capture — the filename and log are correct before the file hits Drive."
      onCtaClick={onLogin}
      ctaText="Try ImageSnap free"
      content={
        <div className="space-y-16">

          <section>
            <h2 className="text-3xl font-black mb-6">Why bulk renaming is a symptom, not the problem</h2>
            <p className="text-muted text-lg mb-6 leading-relaxed font-medium">
              You reach for a bulk renamer when photos already exist with bad names — DSC_4821.jpg, Screenshot 2024-01-15.png, image(3).jpg. The rename happens after the fact, from memory or a spreadsheet, and it&apos;s always incomplete. You rename the files but not the log. Or rename the log but forget the subfolder names.
            </p>
            <p className="text-muted text-lg mb-8 leading-relaxed font-medium">
              ImageSnap solves the root cause: the metadata — name, category, project, SKU — is captured at the moment the image is saved. The file lands in Drive already tagged. The Sheet row is already logged. Nothing needs to be renamed because nothing was unnamed to begin with.
            </p>
            <div className="bg-accent/5 border border-accent/20 p-8 rounded-[2rem] text-center">
              <p className="font-bold text-xl">The best time to name a file is <span className="text-muted">when you save it</span>, not <span className="text-accent">after you realize you can&apos;t find it.</span></p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">How ImageSnap eliminates the rename workflow</h2>
            <div className="space-y-6">
              {[
                { step: "01", title: "Define your naming fields once", desc: "Set up metadata fields that matter to your workflow — SKU, client, project code, date. These become the schema for every capture in that category." },
                { step: "02", title: "Fill context at capture time", desc: "When you capture an image from a website or upload a file, you fill in the relevant fields immediately — while the context is in front of you. Takes 10 seconds." },
                { step: "03", title: "File routes to the right folder with a meaningful name", desc: "ImageSnap uses your metadata to determine the destination folder. The Google Sheet row is the canonical record — SKU, client, date, and thumbnail link all in one row." },
                { step: "04", title: "Find anything instantly", desc: "Filter the Sheet by any field. 'Show me all kitchen shots for Client A from last month' is a filter, not a search through nested Drive folders." },
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
            <h2 className="text-3xl font-black mb-6 text-center">Rename workflow vs. ImageSnap workflow</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Step</th>
                    <th className="py-4 px-4 font-semibold text-muted">Bulk rename approach</th>
                    <th className="py-4 px-4 font-semibold text-accent">ImageSnap approach</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {[
                    ["Save image", "Download with auto-generated name", "Capture with metadata in one click"],
                    ["Add context", "Rename file post-hoc from memory", "Fill fields at capture time"],
                    ["Organize into folder", "Manually drag to correct directory", "Auto-routed by project config"],
                    ["Log to spreadsheet", "Enter row manually or skip it", "Auto-logged on every capture"],
                    ["Find image later", "Search Drive, guess the filename", "Filter Sheet by any field"],
                    ["Time per image", "2–5 minutes (rename + move + log)", "~10 seconds"],
                  ].map(([step, old_, new_], i) => (
                    <tr key={i} className={i % 2 === 0 ? '' : 'bg-white/[0.01]'}>
                      <td className="py-3 px-4 font-medium">{step}</td>
                      <td className="py-3 px-4 text-muted">{old_}</td>
                      <td className="py-3 px-4 font-bold text-accent">{new_}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">When you still need a bulk renamer</h2>
            <p className="text-muted mb-6 font-medium leading-relaxed">ImageSnap works best for ongoing capture workflows. If you have existing files with bad names that predate ImageSnap, a one-time bulk rename may still be useful. Here&apos;s how to think about the two tools:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold text-muted">Use a bulk renamer for:</h3>
                <ul className="space-y-2 text-muted text-sm leading-relaxed">
                  <li>• Migrating an existing library of badly named files</li>
                  <li>• One-time cleanup of legacy archives</li>
                  <li>• Files from cameras/scanners with auto-generated names</li>
                </ul>
              </div>
              <div className="p-8 bg-accent/5 border border-accent/20 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold text-accent">Use ImageSnap for:</h3>
                <ul className="space-y-2 text-sm leading-relaxed">
                  <li>• Any ongoing capture workflow going forward</li>
                  <li>• Attaching structured metadata beyond just the filename</li>
                  <li>• Building a searchable, auditable Google Sheets database</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="faq" className="space-y-4">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            {[
              { q: "Can ImageSnap rename existing files already in Google Drive?", a: "ImageSnap manages new captures going forward — it doesn't retroactively rename or reorganize existing Drive files. For existing files, use a standalone bulk rename tool, then use ImageSnap for all new captures." },
              { q: "Does ImageSnap set the actual filename in Google Drive?", a: "The file is saved to Drive with a system-generated name. The meaningful metadata — SKU, client, project — lives in the Google Sheet row alongside a link to the file. This separation means the Sheet is the searchable index, not the filename." },
              { q: "What if my team uses a specific filename convention like SKU_ClientName_Date.jpg?", a: "You can log those fields in the Sheet columns. If you specifically need the Drive filename to follow a convention, that's a feature on the roadmap — currently the Sheet row is the canonical named record." },
              { q: "Can I export the Sheet as a rename manifest for another tool?", a: "Yes. The Google Sheet contains the file Drive link, your metadata fields, and the capture timestamp. You can export to CSV and feed it into any bulk rename script or tool that accepts filename mappings." },
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
