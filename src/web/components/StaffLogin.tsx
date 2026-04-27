import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

const API_BASE_URL = (typeof window !== 'undefined' && (window.location.protocol === 'extension:' || window.location.protocol === 'chrome-extension:' || window.location.protocol === 'ms-browser-extension:')) 
  ? 'https://www.imagesnap.cloud' 
  : '';

interface StaffLoginProps {
  onLogin: (credentials: { username: string, masterSpreadsheetId: string, user: any }) => void;
  onBack: () => void;
  t: (key: string) => string;
}

export const StaffLogin: React.FC<StaffLoginProps> = ({ onLogin, onBack, t }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/staff-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        onLogin({ 
          username, 
          masterSpreadsheetId: data.masterSpreadsheetId, 
          user: data.user 
        });
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-sm p-8 flex flex-col gap-8 shadow-2xl border-line"
      >
        <div className="flex flex-col gap-2 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-2 border border-accent/20">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">Staff Access</h1>
          <p className="text-muted text-xs font-black tracking-widest uppercase opacity-60">Centralized Drive Sync</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="label-meta opacity-60 ml-1">USERNAME</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Staff ID"
                className="input pl-12 h-14"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label-meta opacity-60 ml-1">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input pl-12 h-14"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 text-red-500 text-[10px] font-black uppercase rounded border border-red-500/20 text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn btn-primary h-14 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? 'VERIFYING...' : 'LOGIN TO WORKSPACE'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <button onClick={onBack} className="text-muted text-[10px] font-black uppercase tracking-widest hover:text-accent transition-colors">
          &larr; BACK TO ADMIN PORTAL
        </button>
      </motion.div>
    </div>
  );
};
