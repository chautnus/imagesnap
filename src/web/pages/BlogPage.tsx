import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Clock, User } from 'lucide-react';
import { SEO } from '../components/SEO';

const posts = [
  {
    title: "Why Copy-Paste Research Breaks at Scale",
    slug: "why-copy-paste-research-breaks-at-scale",
    description: "Copy-paste product research works for 10 products. At 100, it falls apart. Here's why — and what to do instead.",
    date: "May 5, 2026",
    readTime: "6 min read"
  },
  {
    title: "Building a Competitor Database Without a Scraper",
    slug: "building-competitor-database-without-scraper",
    description: "You don't need a web scraper to track competitors. Here's how to build a structured database using your browser and Google Sheets.",
    date: "May 3, 2026",
    readTime: "8 min read"
  },
  {
    title: "Human-Guided Capture vs Full Automation",
    slug: "human-guided-capture-vs-full-automation",
    description: "Automated scraping and human-guided capture solve different problems. An honest comparison of when each works best.",
    date: "May 1, 2026",
    readTime: "7 min read"
  },
  {
    title: "Why I Built ImageSnap (And Why I Almost Didn't)",
    slug: "why-i-built-imagesnap",
    description: "The story behind ImageSnap — how a frustrating product research workflow led to a Chrome extension that saves images with context.",
    date: "April 28, 2026",
    readTime: "5 min read"
  }
];

export const BlogPage = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <SEO title="Blog — ImageSnap" description="Tips and tricks for product research, competitive intelligence, and visual organization." />
      
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">The <span className="text-accent italic">Context</span> Blog</h1>
        <p className="text-xl text-muted max-w-2xl mx-auto font-medium">
          Insights on product research, market intelligence, and building better workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post, i) => (
          <motion.a
            key={post.slug}
            href={`/blog/${post.slug}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group glass p-8 rounded-[2.5rem] border-white/5 hover:border-accent/20 transition-all hover:-translate-y-1 block"
          >
            <div className="flex items-center gap-4 text-xs font-black text-muted uppercase tracking-widest mb-6">
              <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1"><User size={14} /> Founder</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-4 group-hover:text-accent transition-colors leading-tight">
              {post.title}
            </h2>
            <p className="text-muted font-medium mb-8 line-clamp-2">
              {post.description}
            </p>
            
            <div className="flex items-center gap-2 text-accent font-black uppercase tracking-widest text-sm">
              Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};
