"use client";
import React, { useState } from 'react';
import { ArrowRight, Share2, Database, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import { APP_VERSION } from '@shared/lib/version';
import { LoginModal } from './landing/LoginModal';

export const LandingPage = ({ onLogin, t, variant = 0 }: { onLogin: () => void, t: any, variant?: number }) => {
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLoginOptions(true);
  };

  return (
    <div className="bg-bg text-white font-sans antialiased min-h-screen">
      {showLoginOptions && (
        <LoginModal onLogin={onLogin} onClose={() => setShowLoginOptions(false)} />
      )}

      <header className="max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
          Your pictures are <span className="text-accent italic">worthless</span> without context.
        </h1>
        <p className="text-xl text-muted mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
          ImageSnap captures any image with your <span className="text-white">designed context</span> — the fields you choose, the categories you define, the details that make each picture useful forever.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-20">
          <button onClick={handleLoginClick} className="bg-accent text-bg px-10 py-4 rounded-2xl font-black text-lg hover:glow-accent transition-all hover:scale-105">
            Try free — 30 captures/month
          </button>
          <a href="#how-it-works" className="glass px-10 py-4 rounded-2xl font-black text-lg hover:bg-white/10 transition-all">
            See how it works ↓
          </a>
        </div>

        <div className="relative group max-w-5xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent to-blue-500 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative glass rounded-[3rem] aspect-video flex items-center justify-center overflow-hidden border-white/10">
            <img
              src={variant === 1 ? '/landing_variant_1_ecom.png' :
                   variant === 2 ? '/landing_variant_2_org.png' :
                   variant === 3 ? '/landing_variant_3_cloud.png' :
                   '/imagesnap_extension_form_preview.png'}
              alt="ImageSnap Chrome Extension — capture product images to Google Drive with context"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60"></div>
          </div>
        </div>
      </header>

      {/* PROBLEM SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-black text-center mb-16 tracking-tight">Sound familiar?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: "📜", text: "I saved 200 product screenshots but can't remember why I saved half of them." },
            { icon: "📁", text: "My research folder is full of images with no price, no source, no notes. Just dead files." },
            { icon: "🔍", text: "I did great research last month. Now I need it again and can't find anything useful." }
          ].map((item, i) => (
            <div key={i} className="glass p-10 rounded-[2.5rem] border-white/5 text-center flex flex-col items-center">
              <div className="text-5xl mb-6">{item.icon}</div>
              <p className="text-muted text-lg italic font-medium leading-relaxed">"{item.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section id="how-it-works" className="py-32 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-24 tracking-tighter italic">Save the image. <br/><span className="text-accent">Keep the meaning.</span></h2>
          <div className="grid md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center">
                <Share2 className="text-accent" size={32} />
              </div>
              <h3 className="text-2xl font-bold">Capture any image with context</h3>
              <p className="text-muted font-medium leading-relaxed">Click the extension on any page. ImageSnap saves the image to your Google Drive and captures the context — title, price, description, source. Auto-filled when possible, customizable always.</p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center">
                <Database className="text-accent" size={32} />
              </div>
              <h3 className="text-2xl font-bold">You design the context</h3>
              <p className="text-muted font-medium leading-relaxed">Add any fields your workflow needs: supplier name, rating, project code, season, status. Every category can have its own schema. Your context, your rules.</p>
            </div>
            <div className="space-y-6">
              <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="text-accent" size={32} />
              </div>
              <h3 className="text-2xl font-bold">Spend one time, use forever</h3>
              <p className="text-muted font-medium leading-relaxed">6 months later, you still know why you saved that image, where it came from, and what it means. Your data stays in your Drive and Sheets. Yours forever.</p>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section id="use-cases" className="max-w-6xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black mb-4">Every image tells a story.</h2>
          <p className="text-xl text-muted font-medium">ImageSnap remembers it for you.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { t: "Competitor Tracking", d: "Save competitor product images with price, positioning and source. Build a visual database that shows how competitors change over time.", link: "/use-cases/competitor-tracking-beyond-keyword-tools" },
            { t: "Market Research", d: "Capture product trends with images and context. Review visually, compare by fields, share with your team.", link: "/use-cases/ecommerce-studios" },
            { t: "Sourcing & Procurement", d: "Save supplier products with photos, specs and pricing. Compare visually across sources — no more juggling tabs.", link: "/use-cases/construction-teams" },
            { t: "Swipe File Tool", d: "Save anything visual from the web with the context that makes it findable later. Recipes, designs, references, inspiration.", link: "/use-cases/swipe-file-tool" }
          ].map((item, i) => (
            <div key={i} className="glass p-10 rounded-[3rem] border-white/5 hover:border-accent/20 transition-all group">
              <h3 className="text-2xl font-black mb-4 group-hover:text-accent transition-colors">{item.t}</h3>
              <p className="text-muted font-medium mb-8 leading-relaxed">{item.d}</p>
              <a href={item.link} className="flex items-center gap-2 text-accent font-black uppercase tracking-widest text-xs">
                See Workflow <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section id="pricing" className="bg-accent/5 py-32 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-12">Simple, predictable pricing.</h2>
          <div className="glass p-12 rounded-[3rem] border-accent/20 bg-accent/5">
            <div className="text-accent text-sm font-black uppercase tracking-[0.2em] mb-4">Solo Plan</div>
            <div className="text-5xl font-black mb-2">$9.99<span className="text-lg text-muted font-medium">/mo</span></div>
            <div className="text-sm font-bold text-accent mb-8">$99.9 / yearly</div>
            <ul className="space-y-4 mb-10 text-muted font-bold text-sm">
              <li className="flex items-center justify-center gap-2"><Check size={14} className="text-accent" /> Unlimited captures</li>
              <li className="flex items-center justify-center gap-2"><Check size={14} className="text-accent" /> Unlimited categories</li>
              <li className="flex items-center justify-center gap-2"><Check size={14} className="text-accent" /> Google Drive & Sheets Sync</li>
            </ul>
            <button onClick={handleLoginClick} className="btn btn-primary w-full py-5 rounded-2xl text-lg">
              Start Researching Now
            </button>
          </div>
          <p className="text-white/60 mb-8 font-medium">From $9.99/month for unlimited captures and AI extraction.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-32">
        <h2 className="text-4xl font-black mb-16 text-center italic">Questions?</h2>
        <div className="space-y-4">
          {[
            { q: "What is \"designed context\"?", a: "It means you decide what information gets attached to each image. ImageSnap auto-fills what it can from the page, but you can add any custom fields — project name, rating, supplier, status, notes — whatever makes the image useful for your work." },
            { q: "Is this a scraper?", a: "No. ImageSnap works inside your browser while you browse normally. You choose what to capture. It's human-guided, not automated." },
            { q: "Where does my data go?", a: "Images go to your Google Drive. Context goes to your Google Sheet. We don't store your research data on our servers." }
          ].map((item, i) => (
            <details key={i} className="glass p-8 rounded-3xl border-white/5 group">
              <summary className="font-black text-xl cursor-pointer list-none flex justify-between items-center">
                {item.q}
                <ChevronDown size={20} className="transition group-open:rotate-180 text-accent" />
              </summary>
              <p className="text-muted mt-6 font-medium leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-white/5 text-center">
        <p className="text-muted text-sm font-bold uppercase tracking-widest">
          © 2026 IMAGESNAP CLOUD. ALL RIGHTS RESERVED. <span className="ml-4 opacity-50">{APP_VERSION}</span>
        </p>
      </footer>
    </div>
  );
};
