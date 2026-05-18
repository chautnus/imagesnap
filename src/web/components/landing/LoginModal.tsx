"use client";
import React from 'react';
import { Chrome, Zap, X } from 'lucide-react';

interface LoginModalProps {
  onLogin: () => void;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
    <div
      onClick={onClose}
      className="absolute inset-0 bg-black/80 backdrop-blur-sm"
    />
    <div className="relative w-full max-w-lg glass rounded-[2.5rem] p-10 border-white/10 shadow-2xl overflow-hidden">
      <div className="absolute top-0 right-0 p-6">
        <button onClick={onClose} className="text-muted hover:text-white"><X size={24} /></button>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-black mb-2">Welcome to ImageSnap</h2>
        <p className="text-muted font-medium text-sm">Choose your login type to continue</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => { onClose(); onLogin(); }}
          className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-accent hover:bg-accent/10 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Chrome size={24} className="text-white group-hover:text-accent" />
          </div>
          <div className="text-center">
            <div className="font-black text-sm uppercase tracking-widest mb-1">ADMIN_ACCESS</div>
            <div className="text-[10px] text-muted font-bold">Log in with Google</div>
          </div>
        </button>

        <button
          onClick={() => { onClose(); window.location.href = '/staff'; }}
          className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500 hover:bg-blue-500/10 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap size={24} className="text-white group-hover:text-blue-500" />
          </div>
          <div className="text-center">
            <div className="font-black text-sm uppercase tracking-widest mb-1">STAFF_ACCESS</div>
            <div className="text-[10px] text-muted font-bold">Username / Password</div>
          </div>
        </button>
      </div>
    </div>
  </div>
);
