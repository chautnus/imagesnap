import React from 'react';
import { BookOpen, Camera, Globe, Smartphone, Zap, Save, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface HelpTabProps {
  t: (key: string) => string;
}

export const HelpTab: React.FC<HelpTabProps> = ({ t }) => {
  const steps = [
    {
      icon: <Zap className="text-blue-400" />,
      title: "1. Design your context",
      desc: "Define the fields that matter for your research — or use defaults. Each category can have its own schema."
    },
    {
      icon: <Camera className="text-accent" />,
      title: "2. Browse and capture",
      desc: "Click the extension on any image worth saving. Context fills automatically. Choose what matters, skip the rest."
    },
    {
      icon: <Globe className="text-green-400" />,
      title: "3. Search and reuse",
      desc: "Find any image by its context in the web app, or open your Google Sheet directly. Your research, ready for any later work."
    }
  ];

  return (
    <div className="pb-24 p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
          <BookOpen className="text-accent" size={32} />
          {t('userGuide') || 'USER_GUIDE'}
        </h2>
        <p className="text-muted text-sm font-medium leading-relaxed">
          Welcome to ImageSnap. Here are the three steps to start building your visual database with designed context.
        </p>
      </div>

      <div className="grid gap-4">
        {steps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card/30 border border-white/5 p-5 rounded-2xl flex gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              {step.icon}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-black tracking-tight text-white uppercase text-sm">{step.title}</h3>
              <p className="text-xs text-muted leading-relaxed font-medium">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-accent/5 border border-accent/20 p-6 rounded-3xl mt-4">
        <h4 className="font-black text-accent text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
          <CheckCircle2 size={14} /> Pro Tips
        </h4>
        <ul className="space-y-3">
          <li className="flex gap-3 text-xs font-bold text-white/80">
            <span className="text-accent">•</span>
            Use custom fields in Settings to adapt ImageSnap to your workflow.
          </li>
          <li className="flex gap-3 text-xs font-bold text-white/80">
            <span className="text-accent">•</span>
            For ecommerce sites, prices and titles are auto-extracted when possible.
          </li>
          <li className="flex gap-3 text-xs font-bold text-white/80">
            <span className="text-accent">•</span>
            All images are saved directly to your Google Drive to protect your privacy.
          </li>
        </ul>
      </div>

      <div className="flex justify-center mt-4">
        <span className="text-[10px] font-black text-muted tracking-widest uppercase opacity-30">
          ImageSnap v1.3.1 • Documentation Snapshot
        </span>
      </div>
    </div>
  );
};
