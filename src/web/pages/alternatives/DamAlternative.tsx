import React from 'react';
import { SEOPage } from '../SEOPage';

export const DamAlternative = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      title="Affordable DAM Alternative on Google Drive — $9.99/month | ImageSnap"
      description="Enterprise DAMs cost $500+/month. ImageSnap adds structured metadata and custom fields on top of Google Drive you already use — for $9.99/month. No new platform."
      headline={<>A DAM Tool That Costs <span className="text-accent italic">$9.99.</span></>}
      subheadline="Digital Asset Management platforms like Bynder and Canto start at $500/month. ImageSnap adds the metadata layer you need — on top of Google Drive you already use — for $9.99/month."
      onCtaClick={onLogin}
      ctaText="Add metadata to your Drive images"
      content={
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-black mb-6">The Problem With Enterprise DAM Pricing</h2>
            <p className="text-muted text-lg leading-relaxed font-medium mb-8">
              Every small business eventually hits the same wall: Google Drive is free but can't search image content, and enterprise DAM platforms solve the problem but cost 50–200x more per month than most SMBs can justify.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-3xl font-black text-muted mb-2">$0</p>
                <p className="font-bold mb-1">Google Drive</p>
                <p className="text-xs text-muted">No metadata, no custom fields, can't search by content</p>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-3xl font-black text-red-400 mb-2">$500+</p>
                <p className="font-bold mb-1">Enterprise DAM</p>
                <p className="text-xs text-muted">Bynder, Canto, Cloudinary — powerful but priced for large teams</p>
              </div>
              <div className="p-6 bg-accent/10 border border-accent/20 rounded-2xl">
                <p className="text-3xl font-black text-accent mb-2">$9.99</p>
                <p className="font-bold mb-1">ImageSnap</p>
                <p className="text-xs text-muted">Custom metadata + structured capture on top of Drive you already have</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">What ImageSnap Adds to Google Drive</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: '🏷️',
                  title: 'Custom metadata fields',
                  desc: 'Define any fields you need — supplier, category, price, status, notes. Each image capture fills these fields in a connected Google Sheet.',
                },
                {
                  icon: '🔍',
                  title: 'Searchable image library',
                  desc: 'Use Google Sheets filters to search your image collection by any field. "Show all product images from Supplier A, under $10, rated 4+."',
                },
                {
                  icon: '📎',
                  title: 'Images linked to their data',
                  desc: 'Each Sheet row contains a direct link to the image in Drive. Click to see the photo — no hunting across folders.',
                },
                {
                  icon: '🚀',
                  title: 'One-click web capture',
                  desc: 'Capture images from any website in one click. The image uploads to Drive and the metadata row is added to Sheets simultaneously.',
                },
              ].map((item) => (
                <div key={item.title} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex gap-6">
                  <div className="text-4xl shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">Honest Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted"> </th>
                    <th className="py-4 px-4 font-semibold">Google Drive alone</th>
                    <th className="py-4 px-4 font-semibold text-red-400">Enterprise DAM</th>
                    <th className="py-4 px-4 font-semibold text-accent">ImageSnap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {[
                    ['Price', '$0–$12/user', '$500–$2000+/mo', '$9.99/mo'],
                    ['Custom metadata', '❌', '✅', '✅'],
                    ['Search by metadata', '❌', '✅', '✅ (via Sheets)'],
                    ['Works with existing Drive', '—', '❌ Migrate files', '✅ No migration'],
                    ['Web capture extension', '❌', 'Sometimes', '✅ Built-in'],
                    ['Team sharing', '✅', '✅', '✅ (Drive + Sheet)'],
                    ['Setup time', '0 min', 'Days–weeks', '5 minutes'],
                  ].map(([label, gd, dam, snap]) => (
                    <tr key={label}>
                      <td className="py-4 px-4 font-medium text-muted">{label}</td>
                      <td className="py-4 px-4 text-muted">{gd}</td>
                      <td className={`py-4 px-4 ${label === 'Price' ? 'text-red-400 font-bold' : 'text-muted'}`}>{dam}</td>
                      <td className="py-4 px-4 text-accent font-semibold">{snap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">What ImageSnap Doesn't Do</h2>
            <p className="text-muted leading-relaxed font-medium">
              ImageSnap is not an enterprise DAM. It doesn't have version control, watermarking, rights management, or brand portals. If you need those, you need an enterprise tool.
              What ImageSnap does well: capture images from the web with custom metadata and store them in your own Google Drive and Sheets — with zero migration cost and a $9.99/month price tag.
            </p>
          </section>

          <section id="faq" className="space-y-4">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>
            {[
              {
                q: 'Do I need to move my existing Drive files?',
                a: 'No. ImageSnap creates its own workspace folder inside your Drive. Your existing folders stay untouched. You start fresh with the captures going forward.',
              },
              {
                q: 'Can I use this for my whole team?',
                a: 'Yes. Share the Google Drive folder and Sheet with teammates. Everyone captures into the same library.',
              },
              {
                q: 'Is my data safe if I stop using ImageSnap?',
                a: 'Yes. Your images stay in your Google Drive and your metadata stays in your Google Sheet. Both are owned by your Google account — ImageSnap never holds your data.',
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
