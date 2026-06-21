import React from 'react';
import { SEOPage } from '../SEOPage';

export const BlogPost_CompetitorResearchSheets = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      headline={<>How to Track Competitors in <span className="text-accent italic">Google Sheets</span> (Without a $500/mo Tool)</>}
      subheadline="You don't need Crayon or Klue to run structured competitor intelligence. Here's the exact Google Sheets setup that e-commerce teams use to track pricing, product lines, and visual positioning."
      onCtaClick={onLogin}
      ctaText="Automate your competitor tracking"
      blogPosting={{ headline: "How to Track Competitors in Google Sheets (Without a $500/mo Tool)", datePublished: "2026-06-12", author: "ImageSnap Founder", url: "https://www.imagesnap.cloud/blog/competitor-research-google-sheets" }}
      content={
        <div className="space-y-16">
          <section>
            <p className="text-muted text-lg leading-relaxed font-medium">
              Enterprise competitor intelligence platforms cost $500–$2,000 per month. For most e-commerce teams, that's not justifiable — especially when the core need is simple: know what your competitors are doing with their products, pricing, and positioning.
            </p>
            <p className="text-muted text-lg mt-6 leading-relaxed font-medium">
              Google Sheets can do 80% of what Crayon does, at zero cost. The missing piece is structured capture — getting competitor data into your Sheet without spending hours on manual copy-paste.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">What to Track (And What to Skip)</h2>
            <p className="text-muted text-lg leading-relaxed font-medium mb-6">
              The mistake most teams make: tracking everything. You end up with a 40-column Sheet that nobody updates because it takes 45 minutes per competitor per week.
            </p>
            <p className="text-muted text-lg leading-relaxed font-medium mb-8">
              Track only signals that connect to decisions you'll actually make:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-accent mb-4">Track this</h3>
                <ul className="space-y-3 text-muted text-sm">
                  {['Pricing changes (especially sales/promos)', 'New product launches', 'Hero image and positioning copy', 'Category additions or removals', 'Customer reviews on new products', 'Ad creative direction (if running paid)'].map(item => (
                    <li key={item} className="flex gap-2"><span className="text-green-400">✓</span>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/5 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-muted mb-4">Skip this</h3>
                <ul className="space-y-3 text-muted text-sm">
                  {['Every blog post they publish', 'Social media engagement rates', 'Alexa rank or DA scores', 'Their team size on LinkedIn', 'Press releases and press coverage', 'Anything you can\'t act on'].map(item => (
                    <li key={item} className="flex gap-2"><span className="text-red-400">✗</span>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">The Competitor Tracking Sheet Structure</h2>
            <p className="text-muted text-lg leading-relaxed font-medium mb-8">
              One Sheet, one tab per competitor. Each row is a product or observation. Here are the columns that matter:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-muted border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-6 text-white font-black">Column</th>
                    <th className="text-left py-3 pr-6 text-white font-black">Format</th>
                    <th className="text-left py-3 text-white font-black">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { col: 'Date captured', fmt: 'YYYY-MM-DD', note: 'Critical — lets you see what changed and when' },
                    { col: 'Product name', fmt: 'Text', note: 'Exact name from their site' },
                    { col: 'Category', fmt: 'Dropdown', note: 'Your category taxonomy, not theirs' },
                    { col: 'Price', fmt: 'Number', note: 'Regular price — track sale price separately' },
                    { col: 'Sale price', fmt: 'Number', note: 'Empty if not on sale' },
                    { col: 'Image', fmt: 'Drive link', note: 'Link to the captured product image in Drive' },
                    { col: 'Positioning copy', fmt: 'Text', note: 'Their hero headline or key selling point' },
                    { col: 'Source URL', fmt: 'URL', note: 'Lets you revisit the exact page' },
                    { col: 'Notes', fmt: 'Text', note: 'What stood out, what changed from last time' },
                  ].map(row => (
                    <tr key={row.col} className="border-b border-white/5">
                      <td className="py-3 pr-6 font-bold text-white">{row.col}</td>
                      <td className="py-3 pr-6 text-accent">{row.fmt}</td>
                      <td className="py-3">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">Pairing Images with Your Sheet</h2>
            <p className="text-muted text-lg leading-relaxed font-medium mb-6">
              The most common gap in competitor Sheets: no visual record. You note that a competitor changed their hero image, but you don't have a screenshot of what it looked like before. Three months later, you can't see the trend.
            </p>
            <p className="text-muted text-lg leading-relaxed font-medium mb-6">
              The fix: save product images to a Google Drive folder that mirrors your Sheet. Every row in your Sheet has a corresponding image in Drive. When you look at a product entry, you can see the image at the time of capture.
            </p>
            <p className="text-muted text-lg leading-relaxed font-medium">
              ImageSnap automates this connection. When you click the extension on a competitor's product page, the image goes to Drive and the row (with price, name, URL, and your notes) goes to your Sheet simultaneously. What used to take 3 minutes per product takes under 10 seconds.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">The Weekly Competitor Check Routine</h2>
            <p className="text-muted text-lg leading-relaxed font-medium mb-6">
              Consistency beats comprehensiveness. A 30-minute weekly check on 3–5 key competitors yields more actionable insight than a monthly 4-hour deep dive.
            </p>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Check their sale section', desc: 'What\'s discounted tells you what\'s underperforming or what they\'re pushing this week.' },
                { step: '2', title: 'Look at new arrivals', desc: 'Product launches are the clearest signal of where they\'re investing. Capture the first listing image and price immediately.' },
                { step: '3', title: 'Check the homepage hero', desc: 'The hero changes when their positioning changes. Screenshot it and compare to last week\'s capture.' },
                { step: '4', title: 'Note anything unusual', desc: 'Price drop? New category? Out of stock on a bestseller? Log the observation in your Sheet before you forget.' },
              ].map(item => (
                <div key={item.step} className="flex gap-6 bg-white/5 rounded-2xl p-6">
                  <div className="text-4xl font-black text-accent/30 shrink-0">{item.step}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: 'How many competitors should I track?', a: 'Start with 3–5 direct competitors. More than 10 and the system becomes unmanageable. Focus depth over breadth — a detailed picture of 5 competitors beats a shallow picture of 20.' },
                { q: 'Do I need to check every page on their site?', a: 'No. Focus on: homepage hero, new arrivals/products, sale section, and any category where you compete directly. That\'s it. Everything else is noise.' },
                { q: 'What about automated monitoring tools?', a: 'Tools like Visualping can alert you to page changes. Combine automation for change detection with human capture for context. When Visualping alerts you, go capture the change in ImageSnap with your notes attached.' },
              ].map((item, i) => (
                <details key={i} className="bg-white/5 p-8 rounded-2xl group">
                  <summary className="font-black text-xl cursor-pointer list-none flex justify-between items-center text-white">
                    {item.q}
                    <span className="text-accent group-open:rotate-180 transition-transform inline-block">↓</span>
                  </summary>
                  <p className="mt-6 text-muted leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      }
    />
  );
};
