import React from 'react';
import { SEOPage } from '../SEOPage';

export const EcommerceStudios = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      title="E-commerce Product Photo Management for Studios — ImageSnap"
      description="Stop losing product shots in unstructured Drive folders. ImageSnap lets e-commerce studios capture product images with SKU, variant, and client data — auto-organized to Google Drive and logged in Sheets."
      headline={<>Your product shots deserve <span className="text-accent italic">better than a folder.</span></>}
      subheadline="Capture every product image with SKU, color, angle, and client name attached. Auto-sync to Google Drive. Log everything to Google Sheets. Ship faster."
      onCtaClick={onLogin}
      ctaText="Organize your studio workflow"
      content={
        <div className="space-y-16">

          <section>
            <h2 className="text-3xl font-black mb-6">The Studio Asset Problem</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed font-medium">
              A busy e-commerce studio can shoot 300+ products a week. The images land in a Drive folder named something like <code className="bg-white/5 px-2 py-0.5 rounded text-sm">shoot_2026_05_final_v2_FINAL</code>. The client asks for "the red hoodie, size M, front angle" — and you spend 20 minutes searching.
            </p>
            <div className="bg-red-400/5 border border-red-400/20 p-8 rounded-[2rem] text-center">
              <p className="text-red-400 font-bold text-xl">"If a product image can't be found in 10 seconds, it might as well not exist."</p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">What E-commerce Studios Need</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <div className="text-4xl mb-4">🏷️</div>
                <h3 className="text-xl font-bold mb-2">SKU-linked storage</h3>
                <p className="text-sm text-muted leading-relaxed">Every image should be searchable by product ID, variant, color, and client — not by filename.</p>
              </div>
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <div className="text-4xl mb-4">📁</div>
                <h3 className="text-xl font-bold mb-2">Auto-organized Drive</h3>
                <p className="text-sm text-muted leading-relaxed">Folders created per client and per shoot automatically — not manually reorganized at the end of every project.</p>
              </div>
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">Delivery tracking in Sheets</h3>
                <p className="text-sm text-muted leading-relaxed">A live Sheets log of every shot: client, SKU, angle, status. Share with clients for instant approval tracking.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">The ImageSnap Studio Workflow</h2>
            <div className="space-y-6">
              {[
                { step: "01", title: "Set up your studio category", desc: "Create a category called 'Product Shoot' with your standard fields: Client, SKU, Color, Variant, Angle, Status. One-time setup — reuse on every shoot." },
                { step: "02", title: "Capture as you shoot", desc: "After each product is shot, open ImageSnap on the web or extension. Drop the image, fill the pre-designed fields, hit save. Image goes to Drive, row goes to Sheets." },
                { step: "03", title: "Share the Sheet with your client", desc: "Your client gets a live view of the Google Sheet with every delivered image, SKU, and its Drive link. No more delivery emails with 40 attachments." },
                { step: "04", title: "Retrieve any image in seconds", desc: "Filter the Sheet by SKU, color, or status. Click the Drive link. Done. No folder hunting, no asking your assistant." },
              ].map((item) => (
                <div key={item.step} className="flex gap-8 items-start p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <div className="text-4xl font-black text-accent/40 shrink-0">{item.step}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted font-medium leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6 text-center">ImageSnap vs Your Current System</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Method</th>
                    <th className="py-4 px-4 font-semibold">SKU tagging</th>
                    <th className="py-4 px-4 font-semibold">Auto-organized</th>
                    <th className="py-4 px-4 font-semibold">Client delivery log</th>
                    <th className="py-4 px-4 font-semibold text-accent">Search speed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  <tr>
                    <td className="py-4 px-4">Drive folders manually named</td>
                    <td className="py-4 px-4 text-red-400">❌</td>
                    <td className="py-4 px-4 text-red-400">❌</td>
                    <td className="py-4 px-4 text-red-400">❌</td>
                    <td className="py-4 px-4 text-red-400">Minutes</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Lightroom + manual export</td>
                    <td className="py-4 px-4">Partial</td>
                    <td className="py-4 px-4">Partial</td>
                    <td className="py-4 px-4 text-red-400">❌</td>
                    <td className="py-4 px-4">Seconds (in LR only)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Spreadsheet + manual upload</td>
                    <td className="py-4 px-4">✅ (Manual)</td>
                    <td className="py-4 px-4 text-red-400">❌</td>
                    <td className="py-4 px-4">✅ (Manual)</td>
                    <td className="py-4 px-4">Fast (if kept up to date)</td>
                  </tr>
                  <tr className="bg-accent/5">
                    <td className="py-4 px-4 font-bold">ImageSnap</td>
                    <td className="py-4 px-4 font-bold text-accent">✅ Auto-fill</td>
                    <td className="py-4 px-4 font-bold text-accent">✅ Drive</td>
                    <td className="py-4 px-4 font-bold text-accent">✅ Live Sheets</td>
                    <td className="py-4 px-4 font-bold text-accent">Instant</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-accent/10 p-10 rounded-[3rem] border border-accent/20">
            <h2 className="text-3xl font-black mb-8">Recommended Fields for Product Studios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-xl font-bold mb-4">Standard fields</h3>
                <ul className="space-y-2 text-muted font-medium text-sm">
                  <li>• <strong>Client</strong> — brand or retailer name</li>
                  <li>• <strong>SKU</strong> — product identifier</li>
                  <li>• <strong>Product name</strong> — human-readable label</li>
                  <li>• <strong>Color / Variant</strong> — size, color, material</li>
                  <li>• <strong>Angle</strong> — front, back, detail, lifestyle</li>
                  <li>• <strong>Status</strong> — shot, edited, delivered, approved</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Why it works</h3>
                <p className="text-muted text-sm font-medium leading-relaxed">
                  You capture these fields once at upload time — 15 seconds per image. In return, you get a fully queryable asset library.
                  Filter by Client + Status = "delivered" to pull your delivery report in one click.
                  Share the Drive folder link in the Sheet for zero-friction client handoffs.
                </p>
              </div>
            </div>
          </section>

          <section id="faq" className="space-y-6">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            <div className="space-y-4">
              {[
                { q: "Does it work with photos taken on a DSLR or phone?", a: "Yes. Any image file you can open in a browser or upload from your device can be captured. Drag and drop the exported JPEG from Lightroom, or capture it directly from a product listing URL." },
                { q: "Can multiple photographers on my team use the same Sheet?", a: "Yes. Share the Google Sheet and Google Drive folder with your team. Every upload from any team member lands in the same organized database." },
                { q: "What if my client uses a different system like Dropbox?", a: "ImageSnap stores in Google Drive. You can always download from Drive and deliver however your client prefers — the structured metadata stays in your Sheets for your own records." },
                { q: "How long does it take to set up a studio category?", a: "About 3 minutes. Name the category, add your fields (Client, SKU, Angle, Status), and you're done. The same category reuses across every future shoot." },
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
