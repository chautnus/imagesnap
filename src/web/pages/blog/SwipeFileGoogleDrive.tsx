import React from 'react';
import { SEOPage } from '../SEOPage';

export const BlogPost_SwipeFileGoogleDrive = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      headline={<>How to Build a Swipe File in <span className="text-accent italic">Google Drive</span> (That You'll Actually Use)</>}
      subheadline="Most swipe files die within a week. Here's the setup that keeps yours useful — organized by campaign type, searchable, and accessible from any device."
      onCtaClick={onLogin}
      ctaText="Build your swipe file with ImageSnap"
      blogPosting={{ headline: "How to Build a Swipe File in Google Drive (That You'll Actually Use)", datePublished: "2026-06-10", author: "ImageSnap Founder", url: "https://www.imagesnap.cloud/blog/swipe-file-google-drive" }}
      content={
        <div className="space-y-16">
          <section>
            <p className="text-muted text-lg leading-relaxed font-medium">
              Every marketer has a swipe file. Almost nobody actually uses it. The problem isn't motivation — it's structure. Screenshots buried in a Downloads folder, Pinterest boards with 400 pins and zero context, Notion databases you stopped updating after week two.
            </p>
            <p className="text-muted text-lg mt-6 leading-relaxed font-medium">
              The fix isn't a fancier tool. It's a system that captures context at the moment you find something interesting — before you forget why you saved it.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">Why Most Swipe Files Fail</h2>
            <p className="text-muted text-lg leading-relaxed font-medium mb-6">
              The classic swipe file workflow: you see a great ad, take a screenshot, save it somewhere, and move on. Three months later, you search for "good email examples" and find 200 unnamed PNG files with no context about what made them good, what brand ran them, or what channel they came from.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">No context at capture</h3>
                <p className="text-sm text-muted leading-relaxed">You know why you saved it in the moment. Two weeks later you don't. Without a note, the swipe is useless.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">No structure at retrieval</h3>
                <p className="text-sm text-muted leading-relaxed">When you need a "high-converting landing page example," you can't filter by technique. You scroll through everything.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">Wrong tool for the job</h3>
                <p className="text-sm text-muted leading-relaxed">Pinterest is for inspiration boards. Notion is for notes. Neither is designed to store structured marketing intelligence.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">The Google Drive Swipe File Setup</h2>
            <p className="text-muted text-lg leading-relaxed font-medium mb-8">
              Google Drive gives you something most swipe file tools don't: you already use it. Your whole team is there. It's searchable, sharable, and permanent. Here's the folder structure that works:
            </p>
            <div className="bg-white/5 rounded-2xl p-8 font-mono text-sm text-muted space-y-2">
              <div>📁 Swipe File/</div>
              <div className="pl-6">📁 Ads/</div>
              <div className="pl-12">📁 Social — Facebook, TikTok, Instagram</div>
              <div className="pl-12">📁 Search — Google, Bing</div>
              <div className="pl-12">📁 Display</div>
              <div className="pl-6">📁 Landing Pages/</div>
              <div className="pl-12">📁 SaaS</div>
              <div className="pl-12">📁 E-commerce</div>
              <div className="pl-6">📁 Emails/</div>
              <div className="pl-6">📁 Copywriting/</div>
              <div className="pl-12">📁 Headlines</div>
              <div className="pl-12">📁 CTAs</div>
            </div>
            <p className="text-muted text-lg leading-relaxed font-medium mt-8">
              Pair this folder structure with a Google Sheet that acts as your index. Every row is one swipe entry: image filename, source URL, brand, channel, technique, rating, and notes.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">The Fields That Make Your Swipe File Useful</h2>
            <p className="text-muted text-lg leading-relaxed font-medium mb-6">
              The metadata is what separates a useful swipe file from a folder of screenshots. At minimum, capture these fields for every entry:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-muted border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-6 text-white font-black">Field</th>
                    <th className="text-left py-3 pr-6 text-white font-black">Why It Matters</th>
                    <th className="text-left py-3 text-white font-black">Example</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {[
                    { field: 'Brand', why: 'Know who ran it', ex: 'Notion, Apple, Dollar Shave Club' },
                    { field: 'Channel', why: 'Technique often only works on one channel', ex: 'Facebook Feed, Google Search, Newsletter' },
                    { field: 'Technique', why: 'Filter by what you need', ex: 'Social proof, Scarcity, UGC, Before/After' },
                    { field: 'Rating (1-5)', why: 'Quickly surface your best examples', ex: '5 = steal this immediately' },
                    { field: 'Why I saved it', why: 'Future you will forget', ex: 'Brilliant use of negative space, best CTA copy I\'ve seen' },
                    { field: 'Source URL', why: 'Go back to the original', ex: 'facebook.com/ads/library/…' },
                  ].map(row => (
                    <tr key={row.field} className="border-b border-white/5">
                      <td className="py-3 pr-6 font-bold text-white">{row.field}</td>
                      <td className="py-3 pr-6">{row.why}</td>
                      <td className="py-3 text-white/60 italic">{row.ex}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">Capturing Without Friction</h2>
            <p className="text-muted text-lg leading-relaxed font-medium mb-6">
              The number one reason swipe files die: the capture process takes too long. If it takes more than 30 seconds to add something, you'll skip it. Here's the fastest workflow for each scenario:
            </p>
            <div className="space-y-6">
              {[
                {
                  scenario: 'Web ads and landing pages',
                  method: 'Use a Chrome extension that captures the image + auto-fills source URL, brand, and page title — then lets you add your technique tag and rating before saving. ImageSnap does exactly this: one click saves the image to your Drive folder and logs the metadata row in your Sheet.',
                },
                {
                  scenario: 'Email examples',
                  method: 'Forward to a dedicated Gmail label. Once a week, screenshot and log the best ones. The friction is worth it for email — a screenshot tool that also logs metadata works best here.',
                },
                {
                  scenario: 'Social media ads',
                  method: 'Most ad library tools (Facebook Ad Library, TikTok Creative Center) let you screenshot directly. Capture the image and immediately add context before switching tabs.',
                },
              ].map(item => (
                <div key={item.scenario} className="bg-white/5 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-white mb-3">{item.scenario}</h3>
                  <p className="text-muted leading-relaxed">{item.method}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">Making the Swipe File Searchable</h2>
            <p className="text-muted text-lg leading-relaxed font-medium mb-6">
              The Google Sheet index is what makes your swipe file a database instead of a folder. Once your metadata is in Sheets, you can:
            </p>
            <ul className="space-y-4 text-muted">
              <li className="flex gap-4">
                <span className="text-accent font-black mt-1">→</span>
                <span><strong className="text-white">Filter by technique</strong> — "Show me all social proof examples rated 4+" before writing a testimonial section</span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent font-black mt-1">→</span>
                <span><strong className="text-white">Search by brand</strong> — "What has Notion done for Black Friday?" across your entire collection</span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent font-black mt-1">→</span>
                <span><strong className="text-white">Sort by rating</strong> — Instantly surface your highest-rated examples when you need inspiration fast</span>
              </li>
              <li className="flex gap-4">
                <span className="text-accent font-black mt-1">→</span>
                <span><strong className="text-white">Share with your team</strong> — Anyone with Drive access has the full swipe file. No tool subscription required.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: 'How is this different from just using Pinterest?', a: 'Pinterest is optimized for discovery, not retrieval. You can\'t filter a Pinterest board by "technique" or "rating," and there\'s no way to attach a source URL or brand note to a pin in a structured way. Google Sheets gives you a queryable database.' },
                { q: 'What if I already have a swipe file in Notion?', a: 'Notion works fine as the database layer. The key is capturing with context at the moment you find something. If you\'re already in Notion, use a capture tool that can log to Notion directly. If you\'re in Google Drive, ImageSnap logs to your Sheets.' },
                { q: 'How often should I review my swipe file?', a: 'Weekly is ideal for an active swipe file. Set a 30-minute block to rate anything you captured that week and remove anything that doesn\'t hold up. Monthly pruning keeps the quality high.' },
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
