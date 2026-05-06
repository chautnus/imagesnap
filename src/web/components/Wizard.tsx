import React from 'react';
import { requestToken } from '@shared/lib/google-auth';
import { LogIn } from 'lucide-react';

interface WizardProps {
  t: (key: string) => string;
}

export const Wizard: React.FC<WizardProps> = ({ t }) => {
  return (
    <div className="fixed inset-0 bg-bg z-[100] flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle_at_center,_#1c1c1f_0%,_#0f0f11_100%)]">
      <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(212,255,0,0.2)]">
        <LogIn size={40} className="text-bg" />
      </div>
      
      <h1 className="text-5xl font-bold tracking-tight mb-4 ">{t('setupWizardTitle')}</h1>
      <p className="text-muted mb-12 max-w-xs">{t('setupWizardDesc')}</p>
      
      <button 
        onClick={() => requestToken()}
        className="btn btn-primary w-full max-w-xs py-4 flex items-center justify-center gap-3 text-lg"
      >
        <LogIn size={20} />
        {t('connectWithGoogle')}
      </button>
      
      <div className="mt-16 label-meta opacity-50">
        ImageSnap / V5.1 Stable
      </div>
    </div>
  );
};
