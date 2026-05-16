import React from 'react';
import { Crown, Image as ImageIcon } from 'lucide-react';
import { SubscriptionStatus } from '@shared/lib/types';

interface HeaderProps {
  activeTab: string;
  user: any;
  subStatus: SubscriptionStatus;
  isSyncing: boolean;
  version: string;
  dataStatus?: 'idle' | 'loading' | 'success' | 'error';
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  user, 
  subStatus, 
  isSyncing, 
  version,
  dataStatus = 'idle'
}) => {
  return (
    <header className="px-4 py-5 flex bg-bg items-center justify-between border-b border-white/5 shadow-xl">
      <div className="flex flex-col">
        <div 
          className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
          onClick={() => {
            const now = Date.now();
            const last = (window as any)._lastLogoTap || 0;
            const count = (window as any)._logoTapCount || 0;
            if (now - last < 500) {
              const newCount = count + 1;
              (window as any)._logoTapCount = newCount;
              if (newCount >= 5) {
                window.dispatchEvent(new CustomEvent('SYS_DEBUG_TOGGLE'));
                (window as any)._logoTapCount = 0;
              }
            } else {
              (window as any)._logoTapCount = 1;
            }
            (window as any)._lastLogoTap = now;
          }}
        >
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
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
              subStatus.isAdmin ? 'bg-accent text-bg' : 
              subStatus.role === 'staff' ? 'bg-blue-500 text-white' : 
              'bg-card text-muted border border-line'
            }`}>
              {subStatus.isAdmin ? 'ADMIN' : subStatus.role === 'staff' ? 'STAFF' : 'USER'}
            </span>
            <span className="text-[11px] font-bold text-white max-w-[200px] truncate">
              {user?.email || user?.username || 'OFFLINE'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {subStatus.isPro && (
              <span className="text-[8px] font-black text-yellow-500 flex items-center gap-0.5">
                <Crown size={8} /> PRO
              </span>
            )}
            
            {dataStatus === 'loading' && (
              <span className="text-[9px] text-muted font-mono font-bold animate-pulse">
                .../{subStatus.limit} • {version}
              </span>
            )}
            {dataStatus === 'error' && (
              <span className="text-[9px] text-yellow-500 font-mono font-bold flex items-center gap-1" title="Usage unavailable - using safe fallback">
                ?/{subStatus.limit} • {version}
              </span>
            )}
            {(dataStatus === 'success' || dataStatus === 'idle') && (
              <span className="text-[9px] text-muted font-mono font-bold">
                {subStatus.usage}/{subStatus.limit} • {version}
              </span>
            )}

            <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-muted animate-pulse' : 'bg-accent shadow-[0_0_8px_var(--accent)]'}`} />
          </div>
        </div>
      </div>
    </header>
  );
};
