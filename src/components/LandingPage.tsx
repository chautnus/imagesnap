import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle, 
  Zap, 
  Shield, 
  Image as ImageIcon, 
  ArrowRight, 
  Download, 
  Layers, 
  Database, 
  Share2,
  MousePointer2,
  Layout,
  ExternalLink
} from 'lucide-react';

export const LandingPage = ({ onLogin, t }: { onLogin: () => void, t: any }) => {
  return (
    <div className="min-h-screen bg-bg selection:bg-accent/30 text-ink overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto backdrop-blur-sm">
        <div className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(212,255,0,0.4)]">
            <ImageIcon size={18} className="text-bg fill-current" />
          </div>
          <div className="text-2xl font-black tracking-tighter italic">
            ImageSnap<span className="text-accent">_</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
          <a href="#features" className="hover:text-accent transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-accent transition-colors">Workflow</a>
          <a href="#extension" className="hover:text-accent transition-colors">Extension</a>
        </div>
        <button 
          onClick={onLogin}
          className="px-6 py-2 bg-accent/10 border border-accent/30 text-accent font-bold rounded-full hover:bg-accent hover:text-bg transition-all hover:scale-105 active:scale-95"
        >
          {t('login') || 'Sign In'}
        </button>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 pt-24 pb-32 max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              The Ultimate Ecom Asset Scraper
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-white">
              Dropship Data<br />
              <span className="text-accent italic">In a Snap.</span>
            </h1>
            
            <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Extract high-res product images, SEO metadata, and variants instantly. Sync directly to Google Sheets & Drive. Stop wasting hours on manual downloads.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onLogin}
                className="w-full sm:w-auto px-10 py-5 bg-accent text-bg font-black text-lg rounded-2xl flex items-center justify-center gap-3 hover:glow-accent transition-all hover:-translate-y-1"
              >
                START FOR FREE <ArrowRight size={22} strokeWidth={3} />
              </button>
              <a 
                href="#extension"
                className="w-full sm:w-auto px-10 py-5 glass text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
              >
                <Download size={20} /> GET EXTENSION
              </a>
            </div>
          </motion.div>

          {/* Hero Preview Card */}
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            className="mt-24 relative max-w-5xl mx-auto group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/50 to-transparent blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative glass rounded-[2.5rem] p-3 shadow-2xl overflow-hidden border-white/20">
              <div className="aspect-[16/9] rounded-[2rem] overflow-hidden bg-[#000] relative">
                <img 
                  src="/imagesnap_hero_abstract_1777043515455.png" 
                  alt="App Preview" 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                
                {/* Floating UI Elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-1/4 right-10 glass p-4 rounded-xl border-accent/30 shadow-2xl hidden md:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center"><ImageIcon className="text-accent" /></div>
                    <div>
                      <div className="text-[10px] font-black text-accent uppercase tracking-wider">Syncing</div>
                      <div className="text-sm font-bold">48 Images Found</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }} 
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                  className="absolute bottom-1/4 left-10 glass p-4 rounded-xl border-white/10 shadow-2xl hidden md:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center"><Database className="text-white" /></div>
                    <div>
                      <div className="text-[10px] font-black text-muted uppercase tracking-wider">Storage</div>
                      <div className="text-sm font-bold">Google Sheets API</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-32 bg-card/30 border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-4">Built for High-Speed Sourcing</h2>
              <p className="text-muted text-lg max-w-2xl mx-auto font-medium">Stop wasting time downloading assets one by one. Our engine does the heavy lifting for you.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Zap size={24} />}
                title="Instant Asset Capture"
                desc="Crawl any product page and grab every high-res image, video, and meta field in milliseconds."
              />
              <FeatureCard 
                icon={<Shield size={24} />}
                title="Privacy First Sync"
                desc="Your data is your own. We sync directly to your Google ecosystem. We never touch or store your files."
              />
              <FeatureCard 
                icon={<ImageIcon size={24} />}
                title="AI Auto-Categorization"
                desc="Smart detection identifies main images, variants, and swatches automatically for a perfect import."
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="px-6 py-32 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-6">Capture Workflow</h2>
                <p className="text-muted text-lg font-medium">Three simple steps to transform your product sourcing efficiency.</p>
              </div>
              
              <div className="space-y-8">
                <Step 
                  number="01"
                  title="Browse & Snap"
                  desc="Visit any shopify, Amazon, or custom store. Click the 'Snap' button in your browser."
                  icon={<MousePointer2 size={20} />}
                />
                <Step 
                  number="02"
                  title="AI Validation"
                  desc="Our AI identifies products, cleans titles, and sorts images into clean folders."
                  icon={<Layers size={20} />}
                />
                <Step 
                  number="03"
                  title="Sync to Sheets"
                  desc="One click sends everything to your designated Google Sheet and Drive folder."
                  icon={<Share2 size={20} />}
                />
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full animate-pulse" />
              <div className="relative glass rounded-3xl p-8 border-white/20 aspect-square flex items-center justify-center overflow-hidden">
                <div className="grid grid-cols-2 gap-4 w-full h-full opacity-40">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white/5 rounded-2xl border border-white/10 animate-float" style={{ animationDelay: `${i * 1.5}s` }} />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-24 h-24 rounded-full bg-accent shadow-[0_0_50px_rgba(212,255,0,0.5)] flex items-center justify-center animate-bounce">
                     <ImageIcon size={40} className="text-bg" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Extension Promo */}
        <section id="extension" className="px-6 py-32 max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-accent/20 to-transparent rounded-[3rem] p-12 md:p-20 border border-accent/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
              <Layout size={400} className="text-accent translate-x-20 -translate-y-20" />
            </div>
            
            <div className="max-w-2xl relative z-10 text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Master Asset Capture with our Extension</h2>
              <p className="text-muted text-xl font-medium mb-10">
                Unlock the full power of ImageSnap. The browser extension allows you to scrape data from ANY website with a single hotkey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-10 py-5 bg-white text-bg font-black text-lg rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform">
                  <Download size={22} strokeWidth={3} /> ADD TO CHROME
                </button>
                <button className="px-10 py-5 glass text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                  VIEW DOCS <ExternalLink size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-40 text-center relative">
          <div className="max-w-4xl mx-auto">
             <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tight leading-none">Ready to Snap?</h2>
             <button 
               onClick={onLogin}
               className="px-16 py-6 bg-accent text-bg font-black text-2xl rounded-3xl hover:scale-110 active:scale-95 transition-all glow-accent"
             >
               GET STARTED NOW
             </button>
             <p className="mt-8 text-muted font-medium">Free for up to 30 captures. No credit card required.</p>
          </div>
        </section>
      </main>

      <footer className="px-6 py-20 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="text-2xl font-black italic">ImageSnap<span className="text-accent">.</span>cloud</div>
              <p className="text-muted text-sm max-w-[300px] text-center md:text-left">
                The most efficient asset scraping tool for modern dropshippers and content creators.
              </p>
            </div>
            <div className="flex gap-12 text-sm font-bold uppercase tracking-widest">
              <div className="flex flex-col gap-4">
                <div className="text-accent text-[10px]">Product</div>
                <a href="#features" className="hover:text-white transition-colors">Features</a>
                <a href="#extension" className="hover:text-white transition-colors">Extension</a>
                <a href="#" className="hover:text-white transition-colors">Pricing</a>
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-accent text-[10px]">Legal</div>
                <button onClick={() => window.location.hash = 'privacy'} className="hover:text-white transition-colors text-left">Privacy</button>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="mailto:loch7444@gmail.com" className="hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-white/5">
            <div className="text-xs text-muted font-medium italic">Handcrafted with precision for the ecommerce elite.</div>
            <div className="text-xs text-muted/50 font-mono tracking-tighter">© 2026 IMAGESNAP CLOUD CORE_V5.1_STABLE</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="group p-10 rounded-[2rem] glass hover:bg-accent/5 hover:border-accent/30 transition-all duration-500 hover:-translate-y-2">
    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4 group-hover:text-accent transition-colors">{title}</h3>
    <p className="text-muted leading-relaxed font-medium">{desc}</p>
  </div>
);

const Step = ({ number, title, desc, icon }: { number: string, title: string, desc: string, icon: React.ReactNode }) => (
  <div className="flex gap-6 items-start group">
    <div className="flex flex-col items-center">
      <div className="text-[10px] font-black text-accent mb-2 tracking-tighter group-hover:scale-125 transition-transform">{number}</div>
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-accent/40 transition-colors">
        {icon}
      </div>
      <div className="w-px h-full bg-gradient-to-b from-white/10 to-transparent mt-2" />
    </div>
    <div className="pt-5 pb-8">
      <h4 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{title}</h4>
      <p className="text-muted text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);
