import React from 'react';
import { SEOPage } from '../SEOPage';

export const RealEstatePhotographers = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      title="ImageSnap for Real Estate Photographers: Organize Property Photos — ImageSnap"
      description="Deliver property photos to agents and clients faster. ImageSnap organizes real estate shoots by address, MLS number, and room type — auto-saved to Google Drive and logged in Sheets."
      headline={<>Property photos, <span className="text-accent italic">delivered on time.</span></>}
      subheadline="Tag each shot with address, MLS number, and room type at capture time. Every photo lands in the right Drive folder automatically — no renaming, no sorting, no lost files."
      onCtaClick={onLogin}
      ctaText="Try ImageSnap free"
      content={
        <div className="space-y-16">

          <section>
            <h2 className="text-3xl font-black mb-6">The delivery problem in real estate photography</h2>
            <p className="text-muted text-lg mb-6 leading-relaxed font-medium">
              A real estate photographer shoots 4–8 properties a day. Each property needs 40–80 edited photos delivered to the listing agent by morning. The bottleneck isn&apos;t the shooting — it&apos;s organizing, naming, and routing hundreds of files to the right client folders after each shoot.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-red-400/5 border border-red-400/10 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold text-red-400">Without structure</h3>
                <ul className="space-y-2 text-muted text-sm leading-relaxed">
                  <li>• Photos from 3 properties mixed in one folder</li>
                  <li>• Filename is DSC_1234 — which address was this?</li>
                  <li>• Agent emails asking for "just the kitchen shots"</li>
                  <li>• Can't prove delivery date if agent disputes it</li>
                </ul>
              </div>
              <div className="p-8 bg-accent/5 border border-accent/20 rounded-3xl space-y-3">
                <h3 className="text-xl font-bold text-accent">With ImageSnap</h3>
                <ul className="space-y-2 text-sm leading-relaxed">
                  <li>• Each property gets its own Drive folder automatically</li>
                  <li>• Photos tagged with address, room, and MLS at capture</li>
                  <li>• Share the Sheet — agent filters by room type themselves</li>
                  <li>• Timestamp and delivery date logged for every photo</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">Your shoot-to-delivery workflow</h2>
            <div className="space-y-6">
              {[
                { step: "01", title: "Set up a project per listing", desc: "Create a new ImageSnap project for each property address. Folder structure in Drive is created automatically. Takes 30 seconds." },
                { step: "02", title: "Capture reference and context shots on-site", desc: "Use the mobile web app or extension to capture any reference material — listing details, floor plans, agent notes. Context stored with each shot." },
                { step: "03", title: "Upload edited photos with metadata", desc: "Drag finished photos into the ImageSnap web app. Tag with room type (kitchen, master bedroom, exterior) and they route to the right subfolder." },
                { step: "04", title: "Share one link to the agent", desc: "Send the agent a shared Google Sheet filtered to their listing. They see thumbnail links, room labels, and can download directly from Drive." },
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
            <h2 className="text-3xl font-black mb-4">Metadata fields for real estate shoots</h2>
            <p className="text-muted mb-8 font-medium leading-relaxed">Tag each photo with the fields that matter. Agents and brokerages can filter the Sheet to pull exactly what they need.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["Property Address", "MLS Number", "Agent Name", "Room / Area", "Shot Type", "Listing Date", "Delivery Status", "Notes"].map((field) => (
                <div key={field} className="px-4 py-3 bg-accent/5 border border-accent/20 rounded-xl text-sm font-medium text-accent">{field}</div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6 text-center">How it compares to manual workflows</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Task</th>
                    <th className="py-4 px-4 font-semibold text-muted">Without ImageSnap</th>
                    <th className="py-4 px-4 font-semibold text-accent">With ImageSnap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {[
                    ["Create client folder", "Manual in Drive", "Auto-created from project name"],
                    ["Name files by room", "Rename 40–80 files manually", "Tag room at upload time"],
                    ["Deliver to agent", "Share Drive folder, explain structure", "Share Sheet link — self-explanatory"],
                    ["Agent requests reshoots", "Hunt for original files", "Filter Sheet by address + room"],
                    ["Track delivery dates", "Check email thread", "Timestamps logged automatically"],
                    ["Scale to 8 properties/day", "Hours of admin work", "Same process, just more projects"],
                  ].map(([task, without, with_], i) => (
                    <tr key={i} className={i % 2 === 0 ? '' : 'bg-white/[0.01]'}>
                      <td className="py-3 px-4 font-medium">{task}</td>
                      <td className="py-3 px-4 text-muted">{without}</td>
                      <td className="py-3 px-4 font-bold text-accent">{with_}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="faq" className="space-y-4">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            {[
              { q: "Does ImageSnap work for video walkthroughs too?", a: "ImageSnap currently focuses on image capture and organization. For video files, you can still create the same folder structure in Google Drive manually and log the videos as rows in your Sheet — but the capture tool itself is image-specific." },
              { q: "Can I give agents direct access to upload requests or notes?", a: "Agents can be shared on the Google Sheet with comment or edit permissions. They can add notes, flag photos for reshoot, or mark delivery confirmed — all within the familiar Sheets interface." },
              { q: "How do I handle shoots that span multiple days?", a: "Each project in ImageSnap is a persistent folder. You can add more photos to the same project at any time — they append to the same Sheet and folder. Day 1 and Day 2 shots coexist with full metadata." },
              { q: "What happens to my existing Drive folders if I start using ImageSnap?", a: "ImageSnap only manages new captures going forward. Your existing Drive structure is untouched. You can gradually migrate by starting new listings in ImageSnap while keeping old ones as-is." },
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
