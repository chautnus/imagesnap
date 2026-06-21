import React from 'react';
import { SEOPage } from '../SEOPage';

export const BlogPost_ProductResearchWorkflow = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <SEOPage
      headline={<>The Product Research Workflow That <span className="text-accent italic">Scales</span> (Without a Scraper)</>}
      subheadline="Scrapers break. Manual copy-paste doesn't scale. Here's the middle path: a structured research workflow using your browser and Google Drive that handles 200+ products per session."
      onCtaClick={onLogin}
      ctaText="Try the faster workflow"
      blogPosting={{ headline: "The Product Research Workflow That Scales (Without a Scraper)", datePublished: "2026-06-14", author: "ImageSnap Founder", url: "https://www.imagesnap.cloud/blog/product-research-workflow" }}
      content={
        <div className="space-y-16">
          <section>
            <p className="text-muted text-lg leading-relaxed font-medium">
              There are two ways product researchers usually end up frustrated. The first: they try to scale manual copy-paste and spend half their day on data entry. The second: they try to automate it with scrapers and spend the other half fighting IP blocks, broken selectors, and changing page layouts.
            </p>
            <p className="text-muted text-lg mt-6 leading-relaxed font-medium">
              Neither is the answer. The better workflow sits between them — human-guided capture that's fast enough to handle real research volumes without the maintenance overhead of automation.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">Why Scrapers Fail Product Researchers</h2>
            <p className="text-muted text-lg leading-relaxed font-medium mb-6">
              Scrapers are built for data pipelines, not research workflows. The problems compound quickly:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Sites actively block scrapers', desc: 'Cloudflare, rate limiting, and bot detection mean your scraper stops working the moment the site updates. Then you spend an afternoon debugging instead of researching.' },
                { title: 'No qualitative context', desc: 'A scraper captures data. It doesn\'t capture why something is interesting. You end up with a CSV of prices but no notes on positioning, visual direction, or the observation that caught your eye.' },
                { title: 'Setup cost is high', desc: 'Writing a scraper for one site takes hours. Maintaining it across 10 competitor sites across 6 months is a part-time job.' },
                { title: 'Images are hard', desc: 'Scraping product images and linking them to their metadata row is genuinely complicated. Most scrapers either skip images or save them without context.' },
              ].map(item => (
                <div key={item.title} className="bg-white/5 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-muted leading-relaxed text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">The Human-Guided Capture Workflow</h2>
            <p className="text-muted text-lg leading-relaxed font-medium mb-6">
              The model: you browse, you decide what's worth capturing, the tool handles the logging. You bring judgment; the tool handles the busywork. Here's what the workflow looks like in practice:
            </p>
            <div className="space-y-4">
              {[
                { time: '0:00', action: 'Open a competitor product page in Chrome' },
                { time: '0:05', action: 'Click the ImageSnap extension — the side panel opens' },
                { time: '0:10', action: 'The extension auto-fills: product name, price, description, source URL' },
                { time: '0:20', action: 'You add your context: category, rating, note ("interesting bundle offer")' },
                { time: '0:25', action: 'Click save — image goes to Drive, row goes to your Sheet' },
                { time: '0:30', action: 'Move to the next product' },
              ].map(item => (
                <div key={item.time} className="flex gap-6 items-start">
                  <div className="text-accent font-mono font-black text-sm w-16 shrink-0 pt-1">{item.time}</div>
                  <div className="bg-white/5 rounded-xl px-6 py-4 flex-1 text-muted">{item.action}</div>
                </div>
              ))}
            </div>
            <p className="text-muted text-lg leading-relaxed font-medium mt-8">
              30 seconds per product. 200 products = 100 minutes instead of 6.5 hours of manual entry. And every capture has an image, a source link, and your notes attached.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">Setting Up Your Research Categories</h2>
            <p className="text-muted text-lg leading-relaxed font-medium mb-6">
              The key to a research workflow that stays useful: define your categories before you start. Categories determine your Drive folder structure and your Sheet columns. Getting this right once saves hours of reorganization later.
            </p>
            <p className="text-muted text-lg leading-relaxed font-medium mb-8">
              For e-commerce research, a typical category setup:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { category: 'Competitor Products', fields: ['Product name', 'Price', 'Category', 'Positioning copy', 'Rating', 'Notes'] },
                { category: 'Supplier Sourcing', fields: ['Product name', 'MOQ', 'Price per unit', 'Lead time', 'Supplier name', 'Quality notes'] },
                { category: 'Market Research', fields: ['Product name', 'Trend signal', 'Source platform', 'Volume estimate', 'Opportunity score', 'Notes'] },
              ].map(item => (
                <div key={item.category} className="bg-white/5 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-accent mb-4">{item.category}</h3>
                  <ul className="space-y-2 text-sm text-muted">
                    {item.fields.map(f => <li key={f} className="flex gap-2"><span className="text-white/40">—</span>{f}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8">The Math: Manual vs. Human-Guided</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-muted border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-6 text-white font-black">Task</th>
                    <th className="text-left py-3 pr-6 text-white font-black">Manual (per product)</th>
                    <th className="text-left py-3 text-white font-black">Human-guided (per product)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { task: 'Copy product name + price', manual: '30s', guided: 'Auto-filled (0s)' },
                    { task: 'Save + upload image', manual: '45s', guided: 'Auto-saved to Drive (0s)' },
                    { task: 'Add source URL', manual: '10s', guided: 'Auto-filled (0s)' },
                    { task: 'Add notes + category', manual: '30s', guided: '15s (you add context)' },
                    { task: 'Link image in Sheet', manual: '15s', guided: 'Auto-linked (0s)' },
                    { task: 'Total per product', manual: '~2 min', guided: '~15 sec' },
                    { task: 'For 200 products', manual: '6.5 hours', guided: '50 minutes' },
                  ].map((row, i) => (
                    <tr key={row.task} className={`border-b border-white/5 ${i === row.task.length - 1 || row.task.includes('Total') || row.task.includes('200') ? 'bg-white/5 font-bold' : ''}`}>
                      <td className="py-3 pr-6 text-white">{row.task}</td>
                      <td className="py-3 pr-6 text-red-400">{row.manual}</td>
                      <td className="py-3 text-green-400">{row.guided}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: 'Does this work for any type of product research?', a: 'Yes. The workflow works for e-commerce competitor tracking, supplier sourcing, market research, swipe file building, and any task where you\'re collecting product data from multiple web pages. The category system lets you customize the fields for each type of research.' },
                { q: 'What if a site blocks image capture?', a: 'Human-guided capture works because you\'re using a real browser with a real user session — most anti-bot measures don\'t affect it. If a specific site blocks right-click saving, you can still manually upload the image after capture. This is far rarer than with automated scrapers.' },
                { q: 'Can multiple team members contribute to the same research database?', a: 'Yes. Because everything lives in Google Drive and Sheets, sharing is just normal Google sharing. Multiple people can capture to the same Drive folder and Sheet simultaneously, each with their own context and notes.' },
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
