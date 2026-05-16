"use client";

import { useState, useEffect, useRef } from 'react';
import { setAccessToken } from '@shared/lib/google-auth';
import { findOrCreateWorkspace } from '@shared/lib/sheets';
import { apiClient } from '@shared/lib/api-client';
import { APP_VERSION } from '@shared/lib/version';
import { useShareTarget } from './useShareTarget';
import { useSubStatus } from './useSubStatus';

export function useDashboardInit(refreshData: (id: string) => Promise<void>) {
  const [initStage, setInitStage] = useState<'IDLE' | 'DATA_READ' | 'AUTH_PROCESS' | 'COMPLETED'>('IDLE');
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(typeof window !== 'undefined' ? !navigator.onLine : false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const { shareTargetSid, handleShareTarget } = useShareTarget();
  const { subStatus, setSubStatus, dataStatus, fetchSubStatus } = useSubStatus();

  const initializeWorkspace = async () => {
    try {
      console.log("Initializing new workspace...");
      const id = await findOrCreateWorkspace();
      setSpreadsheetId(id);
      localStorage.setItem('ps_sheet_id', id);
      await refreshData(id);
    } catch (err) {
      console.error("Workspace init error:", err);
    }
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if ((window as any)._pushDebug) (window as any)._pushDebug(`[KERNEL] SW Controller Shifted! Reloading for ${APP_VERSION}...`);
        window.location.reload();
      });
    }

    // BroadcastChannel Bridge for SW Logs
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('imagesnap-logs');
      bc.onmessage = (event) => {
        if (event.data?.type === 'LOG' && (window as any)._pushDebug) {
          (window as any)._pushDebug(event.data.msg);
        }
      };
    } catch (e) {}

    const handleInit = async () => {
      if ((window as any)._pushDebug) (window as any)._pushDebug('[STAGE_C] Verifying Secure Session...');

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const res = await apiClient('/api/auth/session', { signal: controller.signal });
        clearTimeout(timeoutId);
        const sessionData = await res.json();

        if (sessionData.authenticated && sessionData.user) {
          const profile = sessionData.user;
          setUser(profile);
          setAccessToken(profile.token);

          let storedId = localStorage.getItem('ps_sheet_id');

          // Staff Logic: Always prioritize Master ID if provided
          if (profile.role === 'staff' && profile.masterSpreadsheetId) {
            console.log("[INIT] Staff detected, using masterSpreadsheetId:", profile.masterSpreadsheetId);
            storedId = profile.masterSpreadsheetId;
            localStorage.setItem('ps_sheet_id', storedId);
          }

          if (storedId) setSpreadsheetId(storedId);
          if (profile.role === 'staff') {
            setSubStatus({ isPro: true, limit: 999999, usage: 0, role: 'staff' });
          }
          setIsAuthReady(true);
          fetchSubStatus(profile.email);
          if (storedId) refreshData(storedId);
          else initializeWorkspace();
        } else {
          setAuthError("Session Expired - Verification failed on new infrastructure.");
        }
      } catch (e: any) {
        clearTimeout(timeoutId);
        if (e.name === 'AbortError') {
          if ((window as any)._pushDebug) (window as any)._pushDebug('[AUTH_TIMEOUT_ABORTED] 8s timeout hit — releasing init lock');
          setAuthError("Authentication Timed Out - Check your connection.");
        } else {
          setAuthError("Session Expired - Identity service error.");
        }
        // Always returns normally so runInitialization can proceed to COMPLETED
      }
    };

    const runInitialization = async () => {
      startTimeRef.current = Date.now();
      if ((window as any)._pushDebug) (window as any)._pushDebug(`[BOOT] Starting ${APP_VERSION} Ironclad Init`);

      const handleUnload = () => {
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          if ((window as any)._pushDebug) (window as any)._pushDebug('[KERNEL] Blob URL Revoked on Unload');
        }
      };
      window.addEventListener('beforeunload', handleUnload);

      const initPromise = (async () => {
        setInitStage('AUTH_PROCESS');
        await handleInit();
        // Phase 2 is now handled reactively by the isAuthReady effect
        setInitStage('DATA_READ');
      })();

      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('RACE_TIMEOUT'), 6000));
      const result = await Promise.race([initPromise, timeoutPromise]);

      if (result === 'RACE_TIMEOUT') {
        if ((window as any)._pushDebug) (window as any)._pushDebug('[BOOT] RACE WON BY: TIMEOUT (FORCED START)');
      } else {
        if ((window as any)._pushDebug) (window as any)._pushDebug(`[BOOT] RACE WON BY: INITIALIZATION (${Date.now() - startTimeRef.current}ms)`);
      }

      setInitStage('COMPLETED');

      return () => window.removeEventListener('beforeunload', handleUnload);
    };

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    runInitialization();

    // P-1 FIX: migration_v1_6_1 unregister block removed — was deleting Share Target SW
    // on every new device. Migration complete; SW v8.6 is the baseline.

    return () => {
      bc?.close();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    initStage,
    isAuthReady,
    authError,
    user,
    spreadsheetId,
    setSpreadsheetId,
    subStatus,
    setSubStatus,
    dataStatus,
    isOffline,
    shareTargetSid,
    handleShareTarget,
    fetchSubStatus,
  };
}
