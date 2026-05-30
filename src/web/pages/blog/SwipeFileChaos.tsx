import React from 'react';
import { SEOPage } from '../SEOPage';

export const BlogPost_SwipeFileChaos = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      title="Swipe File Chaos — How to Fix Your Ad Inspiration Folder"
      description="Your swipe file is probably a mess of screenshots with no context. Here's why that happens and how to turn it into a searchable database you'll actually use."
      headline={<>Your Swipe File Is a <span className="text-accent italic">Mess.</span> Here's the Fix.</>}
      subheadline="A folder of screenshots with names like IMG_4392.png is not a swipe file. It's digital hoarding. Here's how to build one you can actually search, filter, and use."
      onCtaClick={onLogin}
      ctaText="Build a real swipe file"
      content={
        <div className="space-y-16">
          <section>
            <p className="text-muted text-lg leading-relaxed font-medium">
              Every marketer has the same intention: save great ads, landing pages, and emails for inspiration later. Most end up with the same result — a folder of 300 screenshots, no labels, no context, and zero memory of why they saved any of it.
            </p>
            <p className="text-muted text-lg mt-6 leading-relaxed font-medium">
              Two months after you saved something, you won't remember the brand, the platform, or why it caught your eye. Without that context, the image is useless. It's not inspiration — it's clutter.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">Why Swipe Files Break Down</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-accent">No context at save time</h3>
                <p className="text-sm text-muted leading-relaxed">
                  You're browsing and you see something great. You take a screenshot. But the why — the hook, the format, the brand — lives only in your head. By next week, it's gone.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-accent">Chaos compounds fast</h3>
                <p className="text-sm text-muted leading-relaxed">
                  The first 30 screenshots are fine. At 300, finding anything means scrolling through all of them. At 1,000, you stop looking entirely and start from scratch every time.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-accent">Expensive tools, same problem</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Dedicated swipe file tools exist — but the best ones cost $200+/month. And the core complaint about even the priciest tools? Users still can't categorize their saves effectively.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-red-400/5 border border-red-400/20 p-10 rounded-[3rem]">
            <h2 className="text-2xl font-black mb-4 text-red-400">The $249/month problem</h2>
            <p className="text-muted leading-relaxed font-medium">
              Foreplay, one of the most popular swipe file tools, starts at $249/month. Its users still complain that they "can't categorize the ads they save, which means chaos when they go back through their swipe files."
              The problem isn't the tool. It's that context has to be added at save time — and most tools don't make that easy enough.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">What a Good Swipe File Actually Needs</h2>
            <div className="space-y-4">
              {[
                {
                  n: '1',
                  title: 'Context captured at the moment of saving',
                  desc: 'Not after. Not when you "have time." Right then, in the same action as saving the image. Brand, platform, technique, why you saved it.',
                },
                {
                  n: '2',
                  title: 'A structure you can filter',
                  desc: "Random folders don't scale. You need rows and columns — something you can sort by channel, brand, format, or date. A spreadsheet you didn't have to build from scratch.",
                },
                {
                  n: '3',
                  title: 'Images linked to their data',
                  desc: 'The image and the metadata live together. You filter by "social proof ads from 2024" and see the actual images, not just a list of text rows you have to cross-reference.',
                },
                {
                  n: '4',
                  title: 'Data you own',
                  desc: 'If the tool disappears, your swipe file disappears too. Your Google Drive and Google Sheets stay yours — no platform lock-in.',
                },
              ].map((item) => (
                <div key={item.n} className="flex gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-accent/20 text-accent font-black flex items-center justify-center shrink-0">
                    {item.n}
                  </div>
                  <div>
                    <p className="font-bold mb-1">{item.title}</p>
                    <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">The Fields That Make a Swipe File Searchable</h2>
            <p className="text-muted mb-8 leading-relaxed font-medium">
              Not every field matters for every person. But these are the ones that make the difference between "I'll know it when I see it" and "let me filter for exactly what I need."
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { field: 'Brand', why: 'Who made this? Track which brands are consistently good.' },
                { field: 'Channel', why: 'Facebook ad, email, landing page, TikTok? Format affects what works.' },
                { field: 'Technique', why: 'Social proof, urgency, UGC, testimonial? Filter by what you need to replicate.' },
                { field: 'Hook type', why: 'Question, stat, bold claim, story? Find examples of the specific hook format you need.' },
                { field: 'Rating', why: 'Not everything you save is equally good. Rate 1–5 so you surface the best first.' },
                { field: 'Notes', why: 'The one-line reason you saved it. This is what vanishes without a system.' },
              ].map((item) => (
                <div key={item.field} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <p className="font-bold text-accent mb-1">{item.field}</p>
                  <p className="text-sm text-muted">{item.why}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">How ImageSnap Solves This</h2>
            <p className="text-muted text-lg leading-relaxed font-medium">
              ImageSnap is a Chrome extension. When you see an ad or page worth saving, you click it. A popup opens with your custom fields. You fill in brand, technique, and a quick note. Click capture. The image goes to your Google Drive folder. The data row goes to your Google Sheet.
            </p>
            <p className="text-muted text-lg mt-4 leading-relaxed font-medium">
              Three months later, you need social proof examples for a beauty brand campaign. You open your Sheet, filter by Technique = "social proof" and Brand category = "beauty." Every image you ever saved that matches appears instantly, with the note you wrote explaining why it worked.
            </p>
            <div className="mt-8 bg-accent/10 p-8 rounded-[2rem] border border-accent/20">
              <p className="font-black text-xl text-accent">That's a swipe file. Not a screenshot folder.</p>
            </div>
          </section>
        </div>
      }
    />
  );
};
