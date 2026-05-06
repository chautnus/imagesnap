import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Chrome, Zap, X, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface PublicHeaderProps {
  onLogin: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ onLogin }) => {
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Login Options Modal */}
      <AnimatePresence>
        {showLoginOptions && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginOptions(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass rounded-[2.5rem] p-10 border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setShowLoginOptions(false)} className="text-muted hover:text-white"><X size={24} /></button>
              </div>

              <div className="text-center mb-10">
                <h2 className="text-3xl font-black mb-2">Welcome to ImageSnap</h2>
                <p className="text-muted font-medium text-sm">Choose your login type to continue</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => { setShowLoginOptions(false); onLogin(); }}
                  className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-accent hover:bg-accent/10 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Chrome size={24} className="text-white group-hover:text-accent" />
                  </div>
                  <div className="text-center">
                    <div className="font-black text-sm uppercase tracking-widest mb-1">ADMIN_ACCESS</div>
                    <div className="text-[10px] text-muted font-bold">Log in with Google</div>
                  </div>
                </button>

                <button 
                  onClick={() => { setShowLoginOptions(false); window.location.hash = '#staff'; navigate('/'); }}
                  className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500 hover:bg-blue-500/10 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Zap size={24} className="text-white group-hover:text-blue-500" />
                  </div>
                  <div className="text-center">
                    <div className="font-black text-sm uppercase tracking-widest mb-1">STAFF_ACCESS</div>
                    <div className="text-[10px] text-muted font-bold">Username / Password</div>
                  </div>
                </button>
              </div>

              <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-dashed border-white/10 text-[11px] text-center text-muted font-medium">
                Note: Staff accounts must be created by an Admin in the Settings tab.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-bg/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <ImageIcon size={18} className="text-bg fill-current" />
            </div>
            <span className="text-xl font-black tracking-tighter italic">ImageSnap_</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted">
            <div className="group relative">
              <button className="hover:text-white transition-colors py-8">Features</button>
              <div className="absolute top-full left-0 w-64 glass p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all rounded-2xl border border-white/10">
                <Link to="/features/auto-folder-organization" className="block p-2 hover:bg-white/5 rounded-lg">Auto Organization</Link>
                <Link to="/features/team-collaboration" className="block p-2 hover:bg-white/5 rounded-lg">Team Collaboration</Link>
                <Link to="/features/web-image-import" className="block p-2 hover:bg-white/5 rounded-lg">Web Import</Link>
                <Link to="/features/metadata-auto-fill" className="block p-2 hover:bg-white/5 rounded-lg">Metadata Auto-fill</Link>
              </div>
            </div>
            <div className="group relative">
              <button className="hover:text-white transition-colors py-8">Compare</button>
              <div className="absolute top-full left-0 w-72 glass p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all rounded-2xl border border-white/10">
                <Link to="/compare/imagesnap-vs-manual-spreadsheet" className="block p-2 hover:bg-white/5 rounded-lg text-xs">vs Manual Spreadsheet</Link>
                <Link to="/compare/imagesnap-vs-custom-scraper" className="block p-2 hover:bg-white/5 rounded-lg text-xs">vs Custom Scraper</Link>
                <Link to="/compare/imagesnap-vs-web-clipper" className="block p-2 hover:bg-white/5 rounded-lg text-xs">vs Web Clippers</Link>
                <Link to="/compare/imagesnap-vs-scraping-api" className="block p-2 hover:bg-white/5 rounded-lg text-xs">vs Scraping APIs</Link>
              </div>
            </div>
            <div className="group relative">
              <button className="hover:text-white transition-colors py-8">Use Cases</button>
              <div className="absolute top-full left-0 w-72 glass p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all rounded-2xl border border-white/10">
                <Link to="/use-cases/competitor-tracking-beyond-keyword-tools" className="block p-2 hover:bg-white/5 rounded-lg text-xs">Competitor Tracking</Link>
                <Link to="/use-cases/swipe-file-tool" className="block p-2 hover:bg-white/5 rounded-lg text-xs">Swipe File Tool</Link>
                <Link to="/use-cases/construction-teams" className="block p-2 hover:bg-white/5 rounded-lg text-xs">Construction Teams</Link>
                <Link to="/use-cases/ecommerce-studios" className="block p-2 hover:bg-white/5 rounded-lg text-xs">E-commerce Studios</Link>
              </div>
            </div>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowLoginOptions(true)}
              className="hidden md:block px-6 py-2 bg-accent text-bg font-bold rounded-full hover:glow-accent transition-all hover:scale-105"
            >
              Sign In
            </button>
            <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-bg border-b border-white/5 overflow-hidden"
            >
              <div className="p-6 flex flex-col gap-4 text-muted font-medium">
                <Link to="/features" className="hover:text-white" onClick={() => setIsMenuOpen(false)}>Features</Link>
                <Link to="/use-cases" className="hover:text-white" onClick={() => setIsMenuOpen(false)}>Use Cases</Link>
                <Link to="/pricing" className="hover:text-white" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                <Link to="/blog" className="hover:text-white" onClick={() => setIsMenuOpen(false)}>Blog</Link>
                <button 
                  onClick={() => { setIsMenuOpen(false); setShowLoginOptions(true); }}
                  className="w-full py-3 bg-accent text-bg font-bold rounded-xl"
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};
