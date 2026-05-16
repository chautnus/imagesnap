import React from 'react';
import { APP_VERSION } from '@shared/lib/version';

type InitStage = 'IDLE' | 'DATA_READ' | 'AUTH_PROCESS' | 'COMPLETED';

interface DashboardGuardScreenProps {
  authError: string | null;
  initStage: InitStage;
  isAuthReady: boolean;
}

export function DashboardGuardScreen({ authError, initStage, isAuthReady }: DashboardGuardScreenProps) {
  if (authError && initStage === 'COMPLETED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-white">
        <div className="flex flex-col items-center gap-6 p-8 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
            <span className="text-2xl text-accent">⚠️</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="text-xs font-black tracking-widest uppercase opacity-60">
                Critical Error
              </div>
              <p className="text-[10px] text-accent mt-2 max-w-[220px] mx-auto leading-relaxed">
                {authError}
              </p>
            </div>

            <div className="pt-4 animate-pulse">
              <div className="text-[9px] uppercase tracking-[0.2em] text-accent/50 font-bold">
                Build {APP_VERSION}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.href = '/'}
              className="px-8 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (initStage !== 'COMPLETED') {
    const isTooLarge = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('error') === 'file_too_large';
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-white">
        <div className="flex flex-col items-center gap-6 p-8 text-center">
          {!isTooLarge ? (
            <div className="relative">
              <div className="w-16 h-16 border-4 border-white/5 rounded-full" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <span className="text-2xl text-accent">⚠️</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="text-xs font-black tracking-widest uppercase opacity-60">
                {isTooLarge ? "File Too Large" : "System Diagnostics"}
              </div>

              {!isTooLarge && (
                <div className="flex flex-col gap-1 text-[9px] text-muted uppercase tracking-tighter opacity-40">
                  <span className={initStage === 'DATA_READ' ? 'text-accent font-bold' : ''}>
                    {initStage === 'DATA_READ' ? '●' : '○'} A. Dynamic Nonce Sync ({APP_VERSION})
                  </span>
                  <span className={initStage === 'AUTH_PROCESS' ? 'text-accent font-bold' : ''}>
                    {initStage === 'AUTH_PROCESS' ? '●' : '○'} B. Google Session Recovery
                  </span>
                  <span className={isAuthReady ? 'text-accent font-bold' : ''}>
                    {isAuthReady ? '●' : '○'} C. Encrypted Session Established
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 animate-pulse">
              <div className="text-[9px] uppercase tracking-[0.2em] text-accent/50 font-bold">
                Build {APP_VERSION}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={async () => {
                if ('serviceWorker' in navigator) {
                  try {
                    const regs = await navigator.serviceWorker.getRegistrations();
                    for (let reg of regs) await reg.unregister();
                    if ('caches' in window) {
                      const keys = await caches.keys();
                      for (let key of keys) await caches.delete(key);
                    }
                    window.location.reload();
                  } catch (e) {
                    window.location.reload();
                  }
                }
              }}
              className="text-[9px] text-muted underline decoration-accent/30 underline-offset-4 hover:text-white transition-colors"
            >
              Hard Reset & Update
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('SYS_DEBUG_TOGGLE'))}
              className="text-[9px] text-accent/50 font-black uppercase tracking-widest border border-accent/20 px-4 py-2 rounded-lg hover:bg-accent/5 transition-all mt-2"
            >
              Enable System Logs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
        <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
