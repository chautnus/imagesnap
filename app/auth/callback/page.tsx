"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { establishSession, getUserInfo, setAccessToken } from '@shared/lib/google-auth';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      // Extract token from URL hash (e.g., #access_token=...)
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const token = params.get('access_token');
      const errorParam = params.get('error');

      if (errorParam) {
        setError(`Authentication failed: ${errorParam}`);
        return;
      }

      if (!token) {
        // Fallback: check query string just in case
        const queryParams = new URLSearchParams(window.location.search);
        const qToken = queryParams.get('access_token');
        if (qToken) {
          // Token found in query string
          await handleToken(qToken);
        } else {
          setError("No access token found in callback URL.");
        }
        return;
      }

      await handleToken(token);
    };

    const handleToken = async (token: string) => {
      try {
        setAccessToken(token); // Temporary RAM set to fetch profile
        const profile = await getUserInfo(token);
        
        if (profile?.email) {
          // Exchange token for secure HTTP-only session cookie
          await establishSession(token, profile.email);
          // Redirect to dashboard, removing token from URL history
          window.location.replace('/dashboard');
        } else {
          setError("Failed to verify user profile.");
        }
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
