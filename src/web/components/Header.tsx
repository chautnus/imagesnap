"use client";

import React from 'react';
import { Crown, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { SubscriptionStatus } from '@shared/lib/types';

interface HeaderProps {
  activeTab: string;
  user: any;
  subStatus: SubscriptionStatus;
  isSyncing: boolean;
  version: string;
  dataStatus?: 'idle' | 'loading' | 'success' | 'error';
}

const TAB_LABELS: Record<string, string> = {
  capture: 'Capture',
  data: 'My Data',
  settings: 'Settings',
  help: 'Help',
};

export const Header: React.FC<HeaderProps> = ({
  activeTab, user, subStatus, isSyncing, version, dataStatus = 'idle'
}) => {
  const roleLabel = subStatus.isAdmin ? 'Admin' : subStatus.role === 'staff' ? 'Staff' : null;

  return (
    <header className="px-5 py-4 flex bg-white items-center justify-between border-b border-line shadow-sm">
      {/* Left: logo + page title */}
      <div className="flex flex-col gap-0.5">
        <div
          className="flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
          onClick={() => {
            const now = Date.now();
            const last = (window as any)._lastLogoTap || 0;
            const count = (window as any)._logoTapCount || 0;
            if (now - last < 500) {
              const next = count + 1;
              (window as any)._logoTapCount = next;
              if (next >= 5) { window.dispatchEvent(new CustomEvent('SYS_DEBUG_TOGGLE')); (window as any)._logoTapCount = 0; }
            } else { (window as any)._logoTapCount = 1; }
            (window as any)._lastLogoTap = now;
          }}
        >
          <div className="w-5 h-5 bg-accent rounded-md flex items-center justify-center shadow-sm shadow-accent/40">
            <ImageIcon size={11} className="text-white fill-current" />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-muted uppercase">ImageSnap</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-ink">
          {TAB_LABELS[activeTab] || activeTab}
        </h1>
      </div>

      {/* Right: user info */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1.5">
            {subStatus.isPro && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                <Crown size={9} /> Pro
              </span>
            )}
            {roleLabel && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20">
                {roleLabel}
              </span>
            )}
            <span className="text-sm font-semibold text-ink max-w-[160px] truncate">
              {user?.email || user?.username || 'Offline'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-mono text-muted ${dataStatus === 'loading' ? 'animate-pulse' : ''}`}>
              {dataStatus === 'error' ? `?/${subStatus.limit}` : `${subStatus.usage}/${subStatus.limit}`} · {version}
            </span>
            {isSyncing
              ? <RefreshCw size={10} className="text-muted animate-spin" />
              : <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
            }
          </div>
        </div>
      </div>
    </header>
  );
};
