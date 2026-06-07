"use client";
import React from 'react';
import { Chrome, Zap, X } from 'lucide-react';
import { PUB } from '../../styles/theme';

interface LoginModalProps { onLogin: () => void; onClose: () => void; }

const isExtensionContext = () =>
  typeof window !== 'undefined' &&
  (window.location.protocol === 'chrome-extension:' ||
   window.location.protocol === 'extension:' ||
   window.location.protocol === 'ms-browser-extension:');

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
    <div onClick={onClose} className={`absolute inset-0 ${PUB.overlay}`} />
    <div className={`relative w-full max-w-lg ${PUB.modal} p-10 overflow-hidden`}>
      <div className="absolute top-0 right-0 p-6">
        <button onClick={onClose} className={`${PUB.textMuted} hover:text-white transition-colors`}><X size={24} /></button>
      </div>

      <div className="text-center mb-10">
        <h2 className={`text-3xl font-black mb-2 ${PUB.textPrimary}`}>Welcome to ImageSnap</h2>
        <p className={`text-sm font-medium ${PUB.textMuted}`}>Sign in with Google to continue</p>
      </div>

      <div className={`grid gap-4 ${isExtensionContext() ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
        <button onClick={() => { onClose(); onLogin(); }}
          className={`flex flex-col items-center gap-4 p-8 rounded-3xl border ${PUB.divider} bg-white/5 hover:border-accent hover:bg-accent/10 transition-all group`}>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Chrome size={24} className="text-white group-hover:text-accent" />
          </div>
          <div className="text-center">
            <div className={`font-black text-sm uppercase tracking-widest mb-1 ${PUB.textPrimary}`}>Log in with Google</div>
            <div className={`text-[10px] font-bold ${PUB.textMuted}`}>Google OAuth — secure & instant</div>
          </div>
        </button>

        {!isExtensionContext() && (
          <button onClick={() => { onClose(); window.location.href = '/staff'; }}
            className={`flex flex-col items-center gap-4 p-8 rounded-3xl border ${PUB.divider} bg-white/5 hover:border-blue-500 hover:bg-blue-500/10 transition-all group`}>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap size={24} className="text-white group-hover:text-blue-500" />
            </div>
            <div className="text-center">
              <div className={`font-black text-sm uppercase tracking-widest mb-1 ${PUB.textPrimary}`}>Staff Access</div>
              <div className={`text-[10px] font-bold ${PUB.textMuted}`}>Username / Password</div>
            </div>
          </button>
        )}
      </div>
    </div>
  </div>
);
