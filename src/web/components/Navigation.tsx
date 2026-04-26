import React from 'react';
import { Camera, TableProperties, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: 'capture' | 'data' | 'settings';
  setActiveTab: (tab: 'capture' | 'data' | 'settings') => void;
  t: (key: string) => string;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, t }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg/80 backdrop-blur-lg border-t border-line flex justify-around items-center px-6 py-3 z-50">
      <button 
        onClick={() => setActiveTab('capture')}
        className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'capture' ? 'text-accent' : 'text-muted'}`}
      >
        <div className={`p-2 rounded-xl transition-all ${activeTab === 'capture' ? 'bg-accent/10' : ''}`}>
          <Camera size={22} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${activeTab === 'capture' ? 'opacity-100' : 'opacity-40'}`}>{t('capture')}</span>
      </button>

      <button 
        onClick={() => setActiveTab('data')}
        className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'data' ? 'text-accent' : 'text-muted'}`}
      >
        <div className={`p-2 rounded-xl transition-all ${activeTab === 'data' ? 'bg-accent/10' : ''}`}>
          <TableProperties size={22} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${activeTab === 'data' ? 'opacity-100' : 'opacity-40'}`}>{t('data')}</span>
      </button>

      <button 
        onClick={() => setActiveTab('settings')}
        className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'settings' ? 'text-accent' : 'text-muted'}`}
      >
        <div className={`p-2 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-accent/10' : ''}`}>
          <Settings size={22} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${activeTab === 'settings' ? 'opacity-100' : 'opacity-40'}`}>{t('settings')}</span>
      </button>
    </nav>
  );
};
