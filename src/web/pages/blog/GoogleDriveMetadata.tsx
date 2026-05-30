import React from 'react';
import { SEOPage } from '../SEOPage';

export const BlogPost_GoogleDriveMetadata = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      title="Google Drive Image Metadata — The Missing Layer"
      description="Google Drive stores your images but can't understand them. Here's how to add searchable metadata to your Drive images without switching platforms."
      headline={<>Google Drive Stores Your Images. <span className="text-accent italic">But Can It Find Them?</span></>}
      subheadline="You have 500 product images in Google Drive. You need 'all red items from Supplier A, under $10'. Google Drive returns nothing useful. Here's why — and the layer that fixes it."
      onCtaClick={onLogin}
      ctaText="Add metadata to your Drive images"
      content={
        <div className="space-y-16">
          <section>
            <p className="text-muted text-lg leading-relaxed font-medium">
              Google Drive is the default storage layer for millions of small businesses. It's free (or nearly so), accessible from everywhere, and already part of most workflows. But it has one critical limitation that rarely gets discussed: it cannot search the meaning of an image.
            </p>
            <p className="text-muted text-lg mt-6 leading-relaxed font-medium">
              You can search by filename. You can search by date. That's it. Want to find "all product photos with red background from AliExpress saved in April"? You're scrolling manually.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">What Google Drive Can and Can't Do</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 font-semibold text-muted">Task</th>
                    <th className="py-4 px-4 font-semibold text-red-400">Google Drive alone</th>
                    <th className="py-4 px-4 font-semibold text-accent">Drive + ImageSnap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {[
                    ['Search by filename', '✅', '✅'],
                    ['Search by folder', '✅', '✅'],
                    ['Search by custom tag', '❌', '✅ (via Sheets)'],
                    ['Search by price range', '❌', '✅ (filter in Sheets)'],
                    ['Search by supplier', '❌', '✅ (filter in Sheets)'],
                    ['Search by capture date', 'File date only', '✅ (row timestamp)'],
                    ['View image + its data together', '❌', '✅ (image link in row)'],
                    ['Share with team (view only)', '✅', '✅'],
                  ].map(([task, drive, snap]) => (
                    <tr key={task}>
                      <td className="py-4 px-4 font-medium">{task}</td>
                      <td className={`py-4 px-4 ${drive === '❌' ? 'text-red-400' : 'text-muted'}`}>{drive}</td>
                      <td className="py-4 px-4 text-accent font-semibold">{snap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">Why Not Just Use a DAM Tool?</h2>
            <p className="text-muted text-lg mb-6 leading-relaxed font-medium">
              Digital Asset Management (DAM) platforms like Bynder, Canto, or Pics.io solve this problem — for enterprise teams with enterprise budgets. Most start at $500/month. Some require custom quotes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                <p className="text-3xl font-black text-red-400 mb-2">$500+</p>
                <p className="text-sm text-muted">Average DAM monthly cost for small teams</p>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                <p className="text-3xl font-black text-red-400 mb-2">New platform</p>
                <p className="text-sm text-muted">Move everything out of Drive, learn a new system</p>
              </div>
              <div className="p-6 bg-accent/10 border border-accent/20 rounded-2xl text-center">
                <p className="text-3xl font-black text-accent mb-2">$9.99</p>
                <p className="text-sm text-muted">ImageSnap — metadata layer on top of Drive you already use</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">How the Metadata Layer Works</h2>
            <p className="text-muted mb-8 leading-relaxed font-medium">
              The architecture is straightforward: Google Drive stores the image files. Google Sheets stores the metadata. ImageSnap is the tool that captures both simultaneously and keeps them linked.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <div className="text-4xl mb-4">🖼️</div>
                <h3 className="text-lg font-bold mb-2">Drive</h3>
                <p className="text-sm text-muted">Stores the actual image file, organized into your folder structure by category.</p>
              </div>
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-bold mb-2">Sheets</h3>
                <p className="text-sm text-muted">Each row is one image. Columns are your custom fields — supplier, price, tags, notes, date. Fully filterable.</p>
              </div>
              <div className="p-8 bg-accent/10 border border-accent/20 rounded-3xl">
                <div className="text-4xl mb-4">🔗</div>
                <h3 className="text-lg font-bold mb-2">The link</h3>
                <p className="text-sm text-muted">Every Sheet row contains a direct link to its image in Drive. Click to see the image — no hunting across folders.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">The Practical Difference</h2>
            <div className="space-y-4">
              {[
                {
                  scenario: 'Find all products from Supplier X',
                  without: 'Open Drive, scroll through the supplier folder, open each image',
                  with: 'Filter Sheet column "Supplier" = "X" — see all rows with image links instantly',
                },
                {
                  scenario: 'Find products under $5',
                  without: 'No way — price is not stored in Drive',
                  with: 'Filter Sheet column "Price" ≤ 5',
                },
                {
                  scenario: 'Share research with a colleague',
                  without: 'Send Drive folder link — they see images with no context',
                  with: 'Share the Sheet — they see images, prices, notes, everything together',
                },
              ].map((item) => (
                <div key={item.scenario} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <p className="font-bold mb-3">{item.scenario}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-red-400/5 border border-red-400/10 rounded-xl">
                      <p className="text-red-400 font-semibold mb-1">Without metadata</p>
                      <p className="text-muted">{item.without}</p>
                    </div>
                    <div className="p-3 bg-accent/5 border border-accent/10 rounded-xl">
                      <p className="text-accent font-semibold mb-1">With ImageSnap</p>
                      <p className="text-muted">{item.with}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      }
    />
  );
};
