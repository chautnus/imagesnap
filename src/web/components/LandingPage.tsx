import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Chrome, 
  FolderOpen, 
  Image as ImageIcon, 
  Tag, 
  Zap, 
  ShieldAlert, 
  Clock, 
  Database, 
  Layout, 
  Download, 
  ArrowRight, 
  Check, 
  Globe, 
  Palette, 
  ShoppingBag, 
  Video,
  X
} from 'lucide-react';

export const LandingPage = ({ onLogin, t }: { onLogin: () => void, t: any }) => {
  const [activeTab, setActiveTab] = useState<'designer' | 'ecom' | 'creator'>('designer');
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-accent/30 font-sans overflow-x-hidden">
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
                  onClick={() => { setShowLoginOptions(false); window.location.hash = '#staff'; }}
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

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-bg/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <ImageIcon size={18} className="text-bg fill-current" />
            </div>
            <span className="text-xl font-black tracking-tighter italic">ImageSnap_</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            <a href="#problem" className="hover:text-white transition-colors">The Problem</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#use-cases" className="hover:text-white transition-colors">Use Cases</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <button 
            onClick={() => setShowLoginOptions(true)}
            className="px-6 py-2 bg-accent text-bg font-bold rounded-full hover:glow-accent transition-all hover:scale-105"
          >
            Sign In
          </button>
        </div>
      </nav>

      <main className="pt-20">
        {/* 1. Hero Section */}
        <section className="px-6 pt-24 pb-32 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] mb-8">
              Stop saving images as <span className="text-red-500 line-through decoration-white/20 decoration-4">`IMG_8472.jpg`</span>.
            </h1>
            <p className="text-muted text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-xl">
              Save images from the web directly to Google Drive, auto-classify into folders, and attach detailed metadata without downloading to your computer.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setShowLoginOptions(true)}
                className="w-fit px-10 py-5 bg-accent text-bg font-black text-xl rounded-2xl flex items-center gap-3 hover:glow-accent transition-all hover:-translate-y-1"
              >
                <Chrome size={24} strokeWidth={3} /> ADD TO CHROME - FREE 100 IMAGES
              </button>
              <p className="text-xs text-muted font-bold tracking-widest uppercase flex items-center gap-2">
                <Check size={14} className="text-accent" /> No credit card required — Works directly in your browser.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full animate-pulse-glow" />
            <div className="relative glass rounded-[2rem] overflow-hidden border-white/20 shadow-2xl">
              <img 
                src="/imagesnap_extension_form_preview_1777046460505.png" 
                alt="ImageSnap Workflow Illustration" 
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </section>

        {/* 2. Problem Section */}
        <section id="problem" className="bg-[#111113] py-32 border-y border-white/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-20 tracking-tight">
              Your current image workflow is <span className="text-red-500 italic">"broken"</span>.
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ProblemCard 
                icon={<FolderOpen className="text-red-500" />}
                title="Downloads folder is a dumpster"
                desc="You download hundreds of reference images with meaningless names. When you need a specific one, you have to open every file."
              />
              <ProblemCard 
                icon={<X className="text-red-500" />}
                title="Google Photos isn't for work"
                desc="It sucks everything into one timeline, ignores folder structures, and mixes work with personal photos."
              />
              <ProblemCard 
                icon={<ShieldAlert className="text-red-500" />}
                title="Images lose context"
                desc="When you download an image, you lose the article title, the source link, and the value of that image."
              />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full" />
        </section>

        {/* 3. Solution & Core Features */}
        <section id="features" className="py-40 px-6 max-w-7xl mx-auto space-y-40">
          <div className="text-center">
             <h2 className="text-4xl md:text-6xl font-black mb-4">ImageSnap: Turning images into a data system.</h2>
          </div>

          <FeatureRow 
             image="/imagesnap_hero_abstract_1777043515455.png"
             title="Fly straight to Google Drive, in the right folder."
             desc="Forget the 'Downloads' folder. ImageSnap connects directly to your Drive. Just right-click, choose a project folder, and the image sits neatly in your cloud."
             icon={<Globe size={20} />}
          />

          <FeatureRow 
             image="/imagesnap_extension_form_preview_1777046460505.png"
             title="Tag, categorize, and never get lost."
             desc="Don't just save images, save the context. ImageSnap lets you attach custom fields: Description, Color, Origin. This data stays with the image forever."
             icon={<Tag size={20} />}
             reverse
          />

          <FeatureRow 
             image="/imagesnap_hero_abstract_1777043515455.png"
             title="Auto-extract data from websites."
             desc="Collecting competitor products? ImageSnap can automatically 'read' the page to grab product titles, prices, and source links to save alongside the image."
             icon={<Database size={20} />}
          />
        </section>

        {/* 4. Use Case Section */}
        <section id="use-cases" className="bg-[#0D0D0E] py-40 px-6 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tight">Born for your specific workflow.</h2>
            
            <div className="flex flex-wrap justify-center gap-4 mb-16">
               <TabButton active={activeTab === 'designer'} onClick={() => setActiveTab('designer')} label="Designer & Artist" icon={<Palette size={18} />} />
               <TabButton active={activeTab === 'ecom'} onClick={() => setActiveTab('ecom')} label="E-commerce & Research" icon={<ShoppingBag size={18} />} />
               <TabButton active={activeTab === 'creator'} onClick={() => setActiveTab('creator')} label="Content Creator" icon={<Video size={18} />} />
            </div>

            <div className="glass rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
               <AnimatePresence mode="wait">
                 <motion.div 
                   key={activeTab}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   transition={{ duration: 0.4 }}
                   className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                 >
                   <div>
                      <h3 className="text-4xl font-black mb-6">
                        {activeTab === 'designer' && "Build personal Moodboards on Drive"}
                        {activeTab === 'ecom' && "Competitor Asset Scraper"}
                        {activeTab === 'creator' && "Project-Specific Asset Storage"}
                      </h3>
                      <p className="text-xl text-muted font-medium leading-relaxed">
                        {activeTab === 'designer' && "Organize visual inspiration with clear tags for color and style. No more retracing web history to find that one reference image."}
                        {activeTab === 'ecom' && "Collect competitor product photos with price and title automatically from Shopee, Amazon directly to your Google Sheets or Drive."}
                        {activeTab === 'creator' && "Store memes, stock photos, and video assets in designated project folders while browsing. Keep your creative pipeline clean."}
                      </p>
                   </div>
                   <div className="aspect-video rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
                        <ImageIcon size={40} className="text-accent" />
                      </div>
                   </div>
                 </motion.div>
               </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 5. Pricing Section */}
        <section id="pricing" className="py-40 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <h2 className="text-4xl md:text-6xl font-black mb-4">Start for free, upgrade when you need.</h2>
             <p className="text-muted text-xl">The simplest pricing for professional asset management.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
             {/* Free Tier */}
             <div className="glass p-12 rounded-[2.5rem] border-white/5 flex flex-col h-full">
                <div className="mb-10">
                   <div className="text-sm font-black uppercase tracking-[0.2em] text-muted mb-4">EXPLORE</div>
                   <div className="text-6xl font-black">$0<span className="text-xl text-muted ml-2">/ lifetime</span></div>
                </div>
                <ul className="space-y-6 mb-12 flex-1">
                   <PricingItem text="Max 100 image captures" />
                   <PricingItem text="Basic metadata (Desc, Source Link)" />
                   <PricingItem text="Save directly to Google Drive" />
                   <PricingItem text="Browser extension access" />
                </ul>
                <button onClick={onLogin} className="w-full py-5 glass rounded-2xl font-black text-lg hover:bg-white/10 transition-colors">
                   INSTALL FOR FREE
                </button>
             </div>

             {/* Pro Tier */}
             <div className="glass p-12 rounded-[2.5rem] border-accent/30 bg-accent/[0.03] flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-8 right-8 px-3 py-1 bg-accent text-bg text-[10px] font-black rounded-full uppercase tracking-widest">MOST POPULAR</div>
                <div className="mb-10">
                   <div className="text-sm font-black uppercase tracking-[0.2em] text-accent mb-4">PROFESSIONAL</div>
                   <div className="text-6xl font-black">$9<span className="text-xl text-muted ml-2">/ month</span></div>
                </div>
                <ul className="space-y-6 mb-12 flex-1">
                   <PricingItem text="Unlimited image captures" accent />
                   <PricingItem text="Custom metadata fields (Unlimited)" accent />
                   <PricingItem text="Auto-Extract from any website" accent />
                   <PricingItem text="Bulk export to CSV/Sheets" accent />
                   <PricingItem text="Priority support" accent />
                </ul>
                <button onClick={onLogin} className="w-full py-5 bg-accent text-bg rounded-2xl font-black text-lg hover:glow-accent transition-all shadow-[0_0_30px_rgba(212,255,0,0.2)]">
                   UPGRADE TO PRO
                </button>
             </div>
          </div>
        </section>

        {/* 6. Footer & Final CTA */}
        <section className="px-6 pb-20">
           <div className="max-w-7xl mx-auto">
              <div className="bg-gradient-to-br from-accent/20 to-transparent rounded-[3rem] p-12 md:p-20 border border-accent/20 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                   <div className="grid grid-cols-12 gap-4 w-full h-full">
                      {[...Array(48)].map((_, i) => <div key={i} className="aspect-square bg-white border border-white/10 rounded-lg" />)}
                   </div>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tight leading-none relative z-10">Ready to clean up your image library?</h2>
                <button 
                  onClick={onLogin}
                  className="px-16 py-6 bg-accent text-bg font-black text-2xl rounded-3xl hover:scale-110 active:scale-95 transition-all shadow-[0_0_50px_rgba(212,255,0,0.4)] relative z-10"
                >
                  ADD TO CHROME NOW
                </button>
              </div>

              <footer className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-sm text-muted">
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/10 rounded-md flex items-center justify-center">
                       <ImageIcon size={14} className="text-white" />
                    </div>
                    <span className="font-black italic text-white">ImageSnap_</span>
                 </div>
                 <div className="flex gap-8 font-bold uppercase tracking-widest text-[10px]">
                    <button onClick={() => window.location.hash = 'privacy'} className="hover:text-accent transition-colors">Privacy Policy</button>
                    <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
                    <a href="mailto:loch7444@gmail.com" className="hover:text-accent transition-colors">Contact</a>
                 </div>
                 <div className="font-mono text-[10px] opacity-30">© 2026 IMAGESNAP CLOUD. ALL RIGHTS RESERVED.</div>
              </footer>
           </div>
        </section>
      </main>
    </div>
  );
};

const ProblemCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-all group">
    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4">{title}</h3>
    <p className="text-muted font-medium leading-relaxed">{desc}</p>
  </div>
);

const FeatureRow = ({ image, title, desc, icon, reverse }: { image: string, title: string, desc: string, icon: React.ReactNode, reverse?: boolean }) => (
  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-20 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
    <motion.div 
      initial={{ opacity: 0, x: reverse ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={reverse ? 'lg:order-2' : ''}
    >
       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest mb-6">
          {icon} Core Solution
       </div>
       <h3 className="text-4xl font-black mb-6 leading-tight">{title}</h3>
       <p className="text-xl text-muted font-medium leading-relaxed">{desc}</p>
    </motion.div>
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`relative group ${reverse ? 'lg:order-1' : ''}`}
    >
       <div className="absolute inset-0 bg-accent/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
       <div className="relative glass rounded-[3rem] p-3 border-white/10 overflow-hidden shadow-2xl">
          <img src={image} alt={title} className="w-full h-auto rounded-[2.5rem] grayscale group-hover:grayscale-0 transition-all duration-700" />
       </div>
    </motion.div>
  </div>
);

const TabButton = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`px-8 py-4 rounded-2xl flex items-center gap-3 font-bold transition-all ${active ? 'bg-accent text-bg shadow-[0_0_20px_rgba(212,255,0,0.3)]' : 'bg-white/5 text-muted hover:text-white'}`}
  >
    {icon} {label}
  </button>
);

const PricingItem = ({ text, accent }: { text: string, accent?: boolean }) => (
  <li className="flex items-center gap-4 text-sm font-medium">
    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${accent ? 'bg-accent/20 text-accent' : 'bg-white/10 text-muted'}`}>
      <Check size={12} strokeWidth={3} />
    </div>
    <span className={accent ? 'text-white' : 'text-muted'}>{text}</span>
  </li>
);
