import React from 'react';
import { Camera, Globe, Zap, CheckCircle2 } from 'lucide-react';
import { APP_VERSION } from '@shared/lib/version';

interface HelpTabProps {
  t: (key: string) => string;
}

export const HelpTab: React.FC<HelpTabProps> = ({ t }) => {
  const steps = [
    {
      icon: <Zap size={22} className="text-accent" />,
      title: "1. Design your context",
      desc: "Define the fields that matter for your research — or use defaults. Each category can have its own schema."
    },
    {
      icon: <Camera size={22} className="text-accent" />,
      title: "2. Browse and Capture",
      desc: "Capture or Share any pictures worth saving. Capture the only matter context."
    },
    {
      icon: <Globe size={22} className="text-accent" />,
      title: "3. Search and reuse",
      desc: "Find any image by its context in the web app, or open your Google Sheet directly. Your research, ready for any later work."
    }
  ];

  return (
    <div className="pb-24 p-5 flex flex-col gap-6">
      <p className="text-muted text-sm font-medium leading-relaxed">
        Welcome to ImageSnap. Here are the three steps to start building your visual database with designed context.
      </p>

      <div className="grid gap-3">
        {steps.map((step, idx) => (
          <div key={idx} className="card p-5 flex gap-4 hover:border-accent/40 hover:shadow-sm transition-all">
            <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              {step.icon}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-ink text-sm">{step.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-accent/5 border border-accent/20 p-5 rounded-2xl">
        <h4 className="font-semibold text-accent text-xs tracking-wide uppercase mb-3 flex items-center gap-2">
          <CheckCircle2 size={14} /> Pro Tips
        </h4>
        <ul className="space-y-2.5">
          {[
            "Use custom fields in Settings to adapt ImageSnap to your workflow.",
            "For ecommerce sites, prices and titles are auto-extracted when possible.",
            "All images are saved directly to your Google Drive to protect your privacy."
          ].map((tip, i) => (
            <li key={i} className="flex gap-2.5 text-xs text-ink/80 leading-relaxed">
              <span className="text-accent font-bold mt-0.5">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center">
        <span className="text-[10px] text-muted tracking-widest uppercase">
          ImageSnap {APP_VERSION}
        </span>
      </div>
    </div>
  );
};
