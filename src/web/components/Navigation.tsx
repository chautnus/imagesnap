import React from 'react';
import { Camera, TableProperties, Settings, HelpCircle } from 'lucide-react';

interface NavigationProps {
  activeTab: 'capture' | 'data' | 'settings' | 'help';
  setActiveTab: (tab: 'capture' | 'data' | 'settings' | 'help') => void;
  t: (key: string) => string;
}

const tabs = [
  { id: 'capture', icon: Camera, label: (t: (k: string) => string) => t('capture') },
  { id: 'data',    icon: TableProperties, label: (t: (k: string) => string) => t('data') },
  { id: 'help',    icon: HelpCircle, label: () => 'Help' },
  { id: 'settings',icon: Settings, label: (t: (k: string) => string) => t('settings') },
] as const;

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, t }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-line flex justify-around items-center px-4 py-2 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
    {tabs.map(({ id, icon: Icon, label }) => {
      const active = activeTab === id;
      return (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all"
        >
          <div className={`p-2 rounded-xl transition-all ${active ? 'bg-accent/10' : ''}`}>
            <Icon size={21} className={active ? 'text-accent' : 'text-muted'} strokeWidth={active ? 2.5 : 1.8} />
          </div>
          <span className={`text-[11px] font-semibold transition-all capitalize ${active ? 'text-accent' : 'text-muted'}`}>
            {label(t)}
          </span>
        </button>
      );
    })}
  </nav>
);
