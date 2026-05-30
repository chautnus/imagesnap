import React from 'react';
import { SEOPage } from '../SEOPage';

export const BlogPost_OrganizeProductImages = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      title="How to Organize Product Images for Ecommerce Research"
      description="Stop losing product images in a Downloads folder. Here's the system ecommerce researchers use to keep images linked to prices, suppliers, and notes — at any scale."
      headline={<>How to Organize Product Images <span className="text-accent italic">That Don't Get Lost.</span></>}
      subheadline="You've saved 200 product images for your research. They're in a folder called 'Downloads'. Three of them are named image(47).jpg. Here's the system that fixes that — permanently."
      onCtaClick={onLogin}
      ctaText="Try the organized workflow"
      content={
        <div className="space-y-16">
          <section>
            <p className="text-muted text-lg leading-relaxed font-medium">
              Every ecommerce researcher hits the same wall. You spend a week finding great products. The images are saved. The prices are in a spreadsheet — sort of. A month later, you can't remember which image matches which supplier, what that price included, or why you flagged that product in the first place.
            </p>
            <p className="text-muted text-lg mt-6 leading-relaxed font-medium">
              The problem isn't that you didn't save the information. It's that the image and the data were never in the same place.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">The Three-Layer Problem</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <div className="text-4xl mb-4">📁</div>
                <h3 className="text-xl font-bold mb-2">Images are orphaned</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Downloaded to a generic folder with no connection to the product data. `image(47).jpg` tells you nothing about supplier, price, or why you saved it.
                </p>
              </div>
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">Data is incomplete</h3>
                <p className="text-sm text-muted leading-relaxed">
                  The spreadsheet has some products but is missing images, or has images linked to broken Drive URLs that were renamed later.
                </p>
              </div>
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">Can't search what you saved</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Looking for "all red products under $5 from Chinese suppliers"? Without structured data, you're scrolling through images manually.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">The System That Works at Scale</h2>
            <p className="text-muted mb-8 leading-relaxed font-medium">
              The fix is simple in concept: images and data need to be captured together, at the same moment, and stored in a way that links them permanently.
            </p>
            <div className="space-y-6">
              {[
                {
                  title: 'Step 1: Define your categories first',
                  desc: 'Before you start saving, create your category structure. For ecommerce research, typical categories are: Winning products, Supplier shortlist, Competitor products, Archive. Each category becomes a folder in Drive and a sheet tab.',
                },
                {
                  title: 'Step 2: Capture image + data in one action',
                  desc: 'The key constraint: if adding data requires a separate step, it will be skipped when you are busy. Image capture and data entry must happen in the same popup, the same moment, from the same page you are already on.',
                },
                {
                  title: 'Step 3: Use consistent fields across every product',
                  desc: 'Define your fields once (price, supplier, URL, category, notes, rating) and use the same fields for every product. Consistency is what makes filtering possible later.',
                },
                {
                  title: 'Step 4: Store in Drive, log in Sheets',
                  desc: 'Image files go to a named Drive folder. A link to that image, plus all your metadata fields, goes into a Sheets row. When you open the Sheet, every row is a product — click the image link to see the photo.',
                },
              ].map((step, i) => (
                <div key={i} className="flex gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-accent/20 text-accent font-black flex items-center justify-center shrink-0 text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-bold mb-2">{step.title}</p>
                    <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-light p-10 rounded-[3rem] border border-white/5">
            <h2 className="text-3xl font-black mb-6">The Recommended Field Set for Product Research</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { field: 'Product name', note: 'Keep it descriptive, not just the listing title' },
                { field: 'Category', note: 'Maps to your Drive folder structure' },
                { field: 'Source URL', note: 'Auto-captured — always know where you found it' },
                { field: 'Price', note: 'Include currency and whether shipping is included' },
                { field: 'Supplier', note: 'AliExpress, Temu, CJ, direct — important for sourcing later' },
                { field: 'My notes', note: 'The one thing you noticed that made it worth saving' },
                { field: 'Rating', note: '1–5 stars — lets you sort by quality at a glance' },
                { field: 'Status', note: 'Shortlisted / Researching / Rejected / Ordered' },
              ].map((item) => (
                <div key={item.field} className="p-4 bg-white/[0.03] rounded-xl">
                  <p className="font-bold text-accent text-sm">{item.field}</p>
                  <p className="text-xs text-muted mt-1">{item.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">Why Google Drive + Sheets is the Right Stack</h2>
            <p className="text-muted leading-relaxed font-medium mb-6">
              Dedicated product research databases exist, but they're either too expensive, too complex, or they lock your data in a proprietary format. Google Drive and Sheets solve the core problem:
            </p>
            <ul className="space-y-3 text-muted font-medium">
              <li className="flex gap-3"><span className="text-accent">✓</span> Images stored in Drive are permanent — no expiry, no broken links</li>
              <li className="flex gap-3"><span className="text-accent">✓</span> Sheets can be filtered, sorted, and exported anytime</li>
              <li className="flex gap-3"><span className="text-accent">✓</span> Shareable with a team instantly — no account setup for collaborators</li>
              <li className="flex gap-3"><span className="text-accent">✓</span> Your data stays yours — no platform lock-in</li>
            </ul>
          </section>
        </div>
      }
    />
  );
};
