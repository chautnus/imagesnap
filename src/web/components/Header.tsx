import React from 'react';
import { Crown, Image as ImageIcon } from 'lucide-react';
import { SubscriptionStatus } from '@shared/lib/types';

interface HeaderProps {
  activeTab: string;
  user: any;
  subStatus: SubscriptionStatus;
  isSyncing: boolean;
  version: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  user, 
  subStatus, 
  isSyncing, 
  version 
}) => {
  return (
    <header className="px-4 py-5 flex bg-bg items-center justify-between border-b border-white/5 shadow-xl">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-accent rounded flex items-center justify-center">
            <ImageIcon size={12} className="text-bg fill-current" />
          </div>
          <span className="text-[10px] font-black tracking-widest text-white uppercase italic">ImageSnap_</span>
        </div>
        <h1 className="text-2xl font-black tracking-tighter mt-1">
          {activeTab.toUpperCase()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${subStatus.isAdmin ? 'bg-accent text-bg' : 'bg-blue-500 text-white'}`}>
              {subStatus.isAdmin ? 'ADMIN' : 'STAFF'}
            </span>
            <span className="text-[11px] font-bold text-white max-w-[120px] truncate">
              {user?.email || user?.username || 'OFFLINE'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {subStatus.isPro && (
              <span className="text-[8px] font-black text-yellow-500 flex items-center gap-0.5">
                <Crown size={8} /> PRO
              </span>
            )}
            <span className="text-[9px] text-muted font-mono font-bold">
              {subStatus.usage}/{subStatus.limit} • {version}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-muted animate-pulse' : 'bg-accent shadow-[0_0_8px_var(--accent)]'}`} />
          </div>
        </div>
      </div>
    </header>
  );
};
