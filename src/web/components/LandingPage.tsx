"use client";
import React, { useState } from 'react';
import { ArrowRight, Share2, Database, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import { APP_VERSION } from '@shared/lib/version';
import { PublicPageShell } from './PublicPageShell';
import { LoginModal } from './landing/LoginModal';
import { PUB } from '../styles/theme';

export const LandingPage = ({ onLogin, t, variant = 0 }: { onLogin: () => void; t: any; variant?: number }) => {
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLoginOptions(true);
  };

  return (
    <PublicPageShell>
      {showLoginOptions && <LoginModal onLogin={onLogin} onClose={() => setShowLoginOptions(false)} />}

      {/* Hero */}
      <header className="max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
        <h1 className={`text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] ${PUB.textPrimary}`}>
          Your pictures are <span className={`${PUB.textAccent} italic`}>worthless</span> without context.
        </h1>
        <p className={`text-xl mb-12 max-w-3xl mx-auto font-medium leading-relaxed ${PUB.textMuted}`}>
          ImageSnap captures any image with your <span className={PUB.textPrimary}>designed context</span> — the fields you choose, the categories you define, the details that make each picture useful forever.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-20">
          <button onClick={handleLoginClick} className={`px-10 py-4 text-lg hover:scale-105 transition-all ${PUB.btnPrimary}`}>
            Try free — 30 captures/month
          </button>
          <a href="#how-it-works" className={`px-10 py-4 text-lg ${PUB.btnGhost}`}>
            See how it works ↓
          </a>
        </div>

        <div className="relative group max-w-5xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent to-blue-500 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
          <div className={`relative ${PUB.glass} rounded-[3rem] aspect-video flex items-center justify-center overflow-hidden`}>
            <img
              src={variant === 1 ? '/landing_variant_1_ecom.png' : variant === 2 ? '/landing_variant_2_org.png' : variant === 3 ? '/landing_variant_3_cloud.png' : '/imagesnap_extension_form_preview.png'}
              alt="ImageSnap Chrome Extension — capture product images to Google Drive with context"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-60" />
          </div>
        </div>
      </header>

      {/* Problem */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className={`text-4xl font-black text-center mb-16 tracking-tight ${PUB.textPrimary}`}>Sound familiar?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: "📜", text: "I saved 200 product screenshots but can't remember why I saved half of them." },
            { icon: "📁", text: "My research folder is full of images with no price, no source, no notes. Just dead files." },
            { icon: "🔍", text: "I did great research last month. Now I need it again and can't find anything useful." }
          ].map((item, i) => (
            <div key={i} className={`${PUB.glass} p-10 rounded-[2.5rem] text-center flex flex-col items-center`}>
              <div className="text-5xl mb-6">{item.icon}</div>
              <p className={`text-lg italic font-medium leading-relaxed ${PUB.textMuted}`}>"{item.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className={`py-32 ${PUB.section}`}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={`text-4xl md:text-6xl font-black text-center mb-24 tracking-tighter italic ${PUB.textPrimary}`}>
            Save the image. <br /><span className={PUB.textAccent}>Keep the meaning.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { icon: Share2, title: "Capture any image with context", desc: "Click the extension on any page. ImageSnap saves the image to your Google Drive and captures the context — title, price, description, source. Auto-filled when possible, customizable always." },
              { icon: Database, title: "You design the context", desc: "Add any fields your workflow needs: supplier name, rating, project code, season, status. Every category can have its own schema. Your context, your rules." },
              { icon: ShieldCheck, title: "Spend one time, use forever", desc: "6 months later, you still know why you saved that image, where it came from, and what it means. Your data stays in your Drive and Sheets. Yours forever." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="space-y-6">
                <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center">
                  <Icon className={PUB.iconAccent} size={32} />
                </div>
                <h3 className={`text-2xl font-bold ${PUB.textPrimary}`}>{title}</h3>
                <p className={`font-medium leading-relaxed ${PUB.textMuted}`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="max-w-6xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className={`text-4xl font-black mb-4 ${PUB.textPrimary}`}>Every image tells a story.</h2>
          <p className={`text-xl font-medium ${PUB.textMuted}`}>ImageSnap remembers it for you.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { t: "Competitor Tracking", d: "Save competitor product images with price, positioning and source. Build a visual database that shows how competitors change over time.", link: "/use-cases/competitor-tracking-beyond-keyword-tools" },
            { t: "Market Research", d: "Capture product trends with images and context. Review visually, compare by fields, share with your team.", link: "/use-cases/ecommerce-studios" },
            { t: "Sourcing & Procurement", d: "Save supplier products with photos, specs and pricing. Compare visually across sources — no more juggling tabs.", link: "/use-cases/construction-teams" },
            { t: "Swipe File Tool", d: "Save anything visual from the web with the context that makes it findable later. Recipes, designs, references, inspiration.", link: "/use-cases/swipe-file-tool" }
          ].map((item, i) => (
            <div key={i} className={`${PUB.glass} p-10 rounded-[3rem] ${PUB.cardHover} group`}>
              <h3 className={`text-2xl font-black mb-4 group-hover:${PUB.textAccent} transition-colors ${PUB.textPrimary}`}>{item.t}</h3>
              <p className={`font-medium mb-8 leading-relaxed ${PUB.textMuted}`}>{item.d}</p>
              <a href={item.link} className={`flex items-center gap-2 font-black uppercase tracking-widest text-xs ${PUB.textAccent}`}>
                See Workflow <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section id="pricing" className={`py-32 ${PUB.section}`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className={`text-4xl font-black mb-12 ${PUB.textPrimary}`}>Simple, predictable pricing.</h2>
          <div className={`${PUB.glass} p-12 rounded-[3rem] border-accent/20 bg-accent/5`}>
            <div className={`text-sm font-black uppercase tracking-[0.2em] mb-4 ${PUB.textAccent}`}>Solo Plan</div>
            <div className={`text-5xl font-black mb-2 ${PUB.textPrimary}`}>$9.99<span className={`text-lg font-medium ml-2 ${PUB.textMuted}`}>/mo</span></div>
            <div className={`text-sm font-bold mb-8 ${PUB.textAccent}`}>$99.9 / yearly</div>
            <ul className={`space-y-4 mb-10 text-sm font-bold ${PUB.textMuted}`}>
              {["Unlimited captures", "Unlimited categories", "Google Drive & Sheets Sync"].map(f => (
                <li key={f} className="flex items-center justify-center gap-2"><Check size={14} className={PUB.textAccent} /> {f}</li>
              ))}
            </ul>
            <button onClick={handleLoginClick} className={`w-full py-5 rounded-2xl text-lg ${PUB.btnPrimary}`}>
              Start Researching Now
            </button>
          </div>
          <p className={`mt-8 font-medium ${PUB.textMuted}`}>From $9.99/month for unlimited captures and AI extraction.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-32">
        <h2 className={`text-4xl font-black mb-16 text-center italic ${PUB.textPrimary}`}>Questions?</h2>
        <div className="space-y-4">
          {[
            { q: "What is \"designed context\"?", a: "It means you decide what information gets attached to each image. ImageSnap auto-fills what it can from the page, but you can add any custom fields — project name, rating, supplier, status, notes — whatever makes the image useful for your work." },
            { q: "Is this a scraper?", a: "No. ImageSnap works inside your browser while you browse normally. You choose what to capture. It's human-guided, not automated." },
            { q: "Where does my data go?", a: "Images go to your Google Drive. Context goes to your Google Sheet. We don't store your research data on our servers." }
          ].map((item, i) => (
            <details key={i} className={`${PUB.glass} p-8 rounded-3xl group`}>
              <summary className={`font-black text-xl cursor-pointer list-none flex justify-between items-center ${PUB.textPrimary}`}>
                {item.q}
                <ChevronDown size={20} className={`transition group-open:rotate-180 ${PUB.textAccent}`} />
              </summary>
              <p className={`mt-6 font-medium leading-relaxed ${PUB.textMuted}`}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`max-w-6xl mx-auto px-6 py-12 border-t ${PUB.divider} text-center`}>
        <p className={`text-sm font-bold uppercase tracking-widest ${PUB.textMuted}`}>
          © 2026 IMAGESNAP CLOUD. ALL RIGHTS RESERVED. <span className="ml-4 opacity-50">{APP_VERSION}</span>
        </p>
      </footer>
    </PublicPageShell>
  );
};
