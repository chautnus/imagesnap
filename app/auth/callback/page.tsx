"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setAccessToken } from '@shared/lib/google-auth';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get('code');
      const errorParam = queryParams.get('error');

      if (errorParam) {
        setError(`Authentication failed: ${errorParam}`);
        return;
      }

      if (!code) {
        setError("No authorization code found in callback URL.");
        return;
      }

      try {
        const response = await fetch('/api/auth/exchange-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            redirectUri: window.location.origin + '/auth/callback'
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.access_token) {
          setError(data.error || "Failed to exchange authorization code.");
          return;
        }

        setAccessToken(data.access_token);
        window.location.replace('/dashboard');
      } catch (e) {
        console.error("Auth Callback Error:", e);
        setError("An error occurred during authentication.");
      }
    };

    processCallback();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-white">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-3xl text-red-500">⚠️</span>
          <p className="text-sm font-bold text-red-400 uppercase tracking-widest">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 uppercase text-xs font-bold transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-white">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] uppercase tracking-widest font-bold text-accent/70 animate-pulse">
          Securing Session...
        </p>
      </div>
    </div>
  );
}
