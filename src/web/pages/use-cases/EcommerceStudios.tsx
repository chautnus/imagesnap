import React from 'react';
import { SEOPage } from '../SEOPage';

export const EcommerceStudios = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      title="E-commerce Product Photo Management for Studios — ImageSnap"
      description="Stop losing product shots in unstructured Drive folders. ImageSnap lets e-commerce studios capture product images with SKU, variant, and client data — auto-organized to Google Drive and logged in Sheets."
      headline={<>Product photos, <span className="text-accent italic">finally organized.</span></>}
      subheadline="Capture product shots from supplier sites, tag them with SKU, variant, and client data — and have everything land in the right Drive folder automatically."
      onCtaClick={onLogin}
      ctaText="Try ImageSnap free"
      content={
        <div className="space-y-16">

          <section>
            <h2 className="text-3xl font-black mb-6">The problem every studio knows</h2>
            <p className="text-muted text-lg mb-6 leading-relaxed font-medium">
              Your photographer finishes a shoot. 200 photos land in a generic Drive folder. Someone has to rename them, move them, log them in a spreadsheet, and match them to the right SKU. That process takes hours. It&apos;s wrong half the time. And when a client asks &ldquo;where&apos;s the angle shot for variant B?&rdquo; — no one knows.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Misnamed files", desc: "IMG_4823.jpg tells you nothing. Which product? Which client? Which shoot date?" },
                { title: "Manual logging", desc: "Someone enters metadata into Sheets by hand, after the fact, from memory. Errors compound." },
                { title: "Wrong folders", desc: "New photos end up in the wrong client folder or last month's shoot directory." },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-red-400/5 border border-red-400/10 rounded-3xl space-y-2">
                  <h3 className="font-bold text-red-400">{item.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">How studios use ImageSnap</h2>
            <div className="space-y-6">
              {[
                { step: "01", title: "Set up your metadata fields", desc: "Create fields for SKU, client name, product variant, shoot date, and approval status. One-time setup, takes 2 minutes." },
                { step: "02", title: "Capture supplier and reference images as you source", desc: "When browsing supplier catalogs or competitor listings, capture with one click. Image goes to Drive, metadata to Sheets — no download/upload cycle." },
                { step: "03", title: "Tag each image at capture time", desc: "Fill in SKU and variant while the context is fresh — not hours later from a messy filename. The right folder is selected automatically based on your config." },
                { step: "04", title: "Share the Sheet with your client", desc: "The Google Sheet is your delivery database. Filter by client, SKU, or approval status. Clients can leave comments directly in Sheets." },
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
            <h2 className="text-3xl font-black mb-6 text-center">Workflow comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Workflow step</th>
                    <th className="py-4 px-4 font-semibold text-muted">Manual process</th>
                    <th className="py-4 px-4 font-semibold text-accent">With ImageSnap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {[
                    ["Save supplier reference image", "Download → rename → upload to Drive", "One-click capture with metadata"],
                    ["Attach SKU to image", "Edit filename or add note manually", "Fill SKU field at capture time"],
                    ["Organize by client folder", "Drag files into right directory", "Folder auto-selected by project config"],
                    ["Log to tracking sheet", "Enter row in Sheets manually", "Auto-logged on every capture"],
                    ["Share delivery with client", "Export, format, email", "Share the Sheet directly"],
                    ["Find a specific variant later", "Search Drive by guessing filename", "Filter Sheet by SKU or variant"],
                  ].map(([step, manual, snap], i) => (
                    <tr key={i} className={i % 2 === 0 ? '' : 'bg-white/[0.01]'}>
                      <td className="py-3 px-4 font-medium">{step}</td>
                      <td className="py-3 px-4 text-muted">{manual}</td>
                      <td className="py-3 px-4 font-bold text-accent">{snap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-4">Recommended metadata fields for studios</h2>
            <p className="text-muted mb-8 font-medium leading-relaxed">These are the fields studios set up most often. You can add, rename, or remove any of them.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["SKU / Product Code", "Client Name", "Color / Variant", "Angle / Shot Type", "Approval Status", "Shoot Date", "Photographer", "Notes"].map((field) => (
                <div key={field} className="px-4 py-3 bg-accent/5 border border-accent/20 rounded-xl text-sm font-medium text-accent">{field}</div>
              ))}
            </div>
          </section>

          <section id="faq" className="space-y-4">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            {[
              { q: "Can multiple photographers share the same Drive folder and Sheet?", a: "Yes. Each team member connects their own ImageSnap account to the shared Google Drive folder and Sheet. Captures are logged with user attribution so you always know who captured what." },
              { q: "What if I need to upload photos taken on a camera, not from a website?", a: "ImageSnap's web app supports direct file uploads. You can drag and drop images from your desktop and attach the same metadata fields before they land in Drive." },
              { q: "Can clients see the Sheet without seeing everything in Drive?", a: "Yes. Share the Google Sheet with view-only access to your client. Drive folder permissions are separate — you control what files they can see." },
              { q: "Is there a limit on how many images I can log?", a: "The free plan includes 30 captures per month. Paid plans have higher limits. The Google Sheet itself has no row limit imposed by ImageSnap — it's just a standard Google Sheet." },
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
