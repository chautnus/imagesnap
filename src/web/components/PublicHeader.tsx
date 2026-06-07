"use client";
import React, { useState } from 'react';
import { Image as ImageIcon, Chrome, Zap, X, Menu, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { LoginModal } from './landing/LoginModal';
import { PUB } from '../styles/theme';

interface PublicHeaderProps { onLogin: () => void; }

const NAV_LINKS = {
  compare: [
    { href: '/compare/imagesnap-vs-manual-spreadsheet', label: 'vs Manual Spreadsheet' },
    { href: '/compare/imagesnap-vs-custom-scraper',     label: 'vs Custom Scraper' },
    { href: '/compare/imagesnap-vs-web-clipper',        label: 'vs Web Clippers' },
    { href: '/compare/imagesnap-vs-scraping-api',       label: 'vs Scraping APIs' },
  ],
  useCases: [
    { href: '/use-cases/competitor-tracking-beyond-keyword-tools', label: 'Competitor Tracking' },
    { href: '/use-cases/swipe-file-tool',    label: 'Swipe File Tool' },
    { href: '/use-cases/construction-teams', label: 'Construction Teams' },
    { href: '/use-cases/ecommerce-studios',  label: 'E-commerce Studios' },
  ],
};

export const PublicHeader: React.FC<PublicHeaderProps> = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {showLogin && <LoginModal onLogin={onLogin} onClose={() => setShowLogin(false)} />}

      <nav className={`fixed top-0 left-0 right-0 z-[100] ${PUB.navBg}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <ImageIcon size={18} className="text-white fill-current" />
              </div>
              <span className={`text-xl font-black tracking-tighter italic ${PUB.textPrimary}`}>ImageSnap_</span>
            </Link>
            <div className="hidden xl:block h-6 w-[1px] bg-white/10" />
            <span className={`hidden xl:block text-[10px] max-w-[300px] leading-tight uppercase tracking-[0.1em] font-bold ${PUB.textMuted}`}>
              Auto-organize team photos and web assets directly in Google Drive.
            </span>
          </div>

          {/* Desktop nav */}
          <div className={`hidden lg:flex items-center gap-8 text-sm font-bold ${PUB.textMuted}`}>
            <DropdownMenu label="Compare" items={NAV_LINKS.compare} />
            <DropdownMenu label="Use Cases" items={NAV_LINKS.useCases} />
            <Link href="/pricing" className={PUB.navText}>Pricing</Link>
            <Link href="/blog"    className={PUB.navText}>Blog</Link>
          </div>

          {/* CTA + mobile hamburger */}
          <div className="flex items-center gap-4">
            <button onClick={() => setShowLogin(true)}
              className={`hidden md:block px-6 py-2 font-bold rounded-full hover:opacity-90 transition-opacity ${PUB.btnPrimary}`}>
              Sign In
            </button>
            <button className={`lg:hidden ${PUB.textPrimary}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className={`lg:hidden border-b ${PUB.divider} ${PUB.navBg}`}>
            <div className={`p-6 flex flex-col gap-6 font-bold uppercase tracking-widest text-xs ${PUB.textMuted}`}>
              <Link href="/#how-it-works" className={PUB.navText} onClick={() => setIsMenuOpen(false)}>How it works</Link>
              <div className="space-y-4">
                <div className={`opacity-50 ${PUB.textPrimary}`}>Compare</div>
                <div className="pl-4 flex flex-col gap-3">
                  {NAV_LINKS.compare.slice(0, 2).map(l => (
                    <Link key={l.href} href={l.href} className={PUB.navText} onClick={() => setIsMenuOpen(false)}>{l.label}</Link>
                  ))}
                </div>
              </div>
              <Link href="/pricing" className={PUB.navText} onClick={() => setIsMenuOpen(false)}>Pricing</Link>
              <Link href="/blog"    className={PUB.navText} onClick={() => setIsMenuOpen(false)}>Blog</Link>
              <button onClick={() => { setIsMenuOpen(false); setShowLogin(true); }}
                className={`w-full py-4 text-sm font-bold rounded-xl ${PUB.btnPrimary}`}>
                Sign In
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

const DropdownMenu = ({ label, items }: { label: string; items: { href: string; label: string }[] }) => (
  <div className="group relative">
    <button className={`py-8 flex items-center gap-1.5 ${PUB.navText}`}>
      {label} <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform" />
    </button>
    <div className={`absolute top-full left-0 w-72 ${PUB.glassDark} p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all rounded-2xl shadow-2xl`}>
      {items.map(item => (
        <Link key={item.href} href={item.href}
          className={`block p-3 rounded-lg text-xs font-bold transition-colors hover:bg-white/5 ${PUB.textMuted} hover:text-white`}>
          {item.label}
        </Link>
      ))}
    </div>
  </div>
);
