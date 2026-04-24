import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Zap, Shield, Image, ArrowRight, Download } from 'lucide-react';

export const LandingPage = ({ onLogin, t }: { onLogin: () => void, t: any }) => {
  return (
    <div className="min-h-screen bg-bg selection:bg-accent/30">
      {/* Hero Section */}
      <nav className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tight">
          ImageSnap<span className="text-accent">_</span>
        </div>
        <button 
          onClick={onLogin}
          className="px-6 py-2 bg-accent text-bg font-bold rounded-full hover:shadow-[0_0_20px_rgba(212,255,0,0.3)] transition-all"
        >
          {t('title') || 'Login'}
        </button>
      </nav>

      <main>
        <section className="px-6 pt-20 pb-32 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
              Dữ liệu Dropship<br />
              <span className="text-accent underline decoration-4 underline-offset-8">Trong nháy mắt</span>
            </h1>
            <p className="text-muted text-xl max-w-2xl mx-auto mb-10">
              Công cụ mạnh mẽ giúp bạn lấy toàn độ ảnh sản phẩm, thông tin meta và đồng bộ trực tiếp lên Google Sheets & Drive chỉ với 1 cú click.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onLogin}
                className="w-full sm:w-auto px-8 py-4 bg-accent text-bg font-black rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform"
              >
                BẮT ĐẦU MIỄN PHÍ <ArrowRight size={20} />
              </button>
              <a 
                href="#extension"
                className="w-full sm:w-auto px-8 py-4 bg-muted/10 text-muted hover:text-white font-bold rounded-lg transition-colors border border-muted/20"
              >
                TẢI EXTENSION
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative px-4"
          >
            <div className="absolute inset-0 bg-accent/10 blur-[120px] rounded-full -z-10" />
            <div className="border border-white/10 rounded-2xl p-4 bg-muted/5 backdrop-blur-3xl shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" 
                alt="Dashboard Preview" 
                className="rounded-xl w-full grayscale opacity-50 contrast-125"
              />
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="px-6 py-32 bg-muted/5 border-y border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Zap className="text-accent" />}
              title="Tốc độ tức thì"
              desc="Quét hàng nghìn ảnh sản phẩm chỉ trong vài giây. Không còn phải lưu thủ công từng tấm."
            />
            <FeatureCard 
              icon={<Shield className="text-accent" />}
              title="An toàn tuyệt đối"
              desc="Dữ liệu của bạn được lưu trực tiếp vào Google Drive cá nhân. Chúng tôi không bao giờ lưu trữ file của bạn."
            />
            <FeatureCard 
              icon={<Image className="text-accent" />}
              title="Phân loại thông minh"
              desc="Tự động nhận diện ảnh chính, ảnh biến thể và icon sản phẩm để SEO tốt hơn."
            />
          </div>
        </section>

        <section id="extension" className="px-6 py-32 max-w-7xl mx-auto">
          <div className="bg-accent/10 rounded-3xl p-12 border border-accent/20 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
            <div className="flex-1">
              <h2 className="text-4xl font-black mb-4">ImageSnap Browser Extension</h2>
              <p className="text-muted text-lg mb-8">
                Cài đặt Extension để trải nghiệm sức mạnh toàn diện. Cho phép lấy dữ liệu từ bất kỳ website thương mại điện tử nào trên thế giới.
              </p>
              <button className="px-8 py-4 bg-white text-bg font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-muted/10 transition-colors mx-auto md:mx-0">
                <Download size={20} /> INSTALL FROM WEB STORE
              </button>
            </div>
            <div className="w-64 h-64 bg-accent/20 rounded-full flex items-center justify-center outline outline-accent/10 outline-offset-8">
              <Image size={80} className="text-accent" />
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-20 border-t border-white/5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-xl font-bold">ImageSnap<span className="text-accent">.cloud</span></div>
          <div className="flex gap-8 text-sm text-muted">
            <button onClick={() => window.location.hash = 'privacy'} className="hover:text-accent transition-colors">Privacy Policy</button>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            <a href="mailto:loch7444@gmail.com" className="hover:text-accent transition-colors">Contact</a>
          </div>
          <div className="text-xs text-muted/50">© 2026 ImageSnap Cloud. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="space-y-4 p-8 rounded-2xl border border-white/5 bg-muted/5 hover:border-accent/20 transition-colors">
    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-muted leading-relaxed">{desc}</p>
  </div>
);
