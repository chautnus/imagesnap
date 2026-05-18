"use client";

import React from 'react';
import { APP_VERSION } from '@shared/lib/version';

type InitStage = 'IDLE' | 'DATA_READ' | 'AUTH_PROCESS' | 'COMPLETED';

interface DashboardGuardScreenProps {
  authError: string | null;
  initStage: InitStage;
  isAuthReady: boolean;
}

export function DashboardGuardScreen({ authError, initStage, isAuthReady }: DashboardGuardScreenProps) {
  if (authError) {
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
    if (isTooLarge) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg text-white">
          <div className="flex flex-col items-center gap-6 p-8 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <span className="text-2xl text-accent">⚠️</span>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-black tracking-widest uppercase opacity-60">
                File Too Large
              </div>
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
        <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}