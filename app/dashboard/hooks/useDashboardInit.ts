"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { setAccessToken } from '@shared/lib/google-auth';
import { findOrCreateWorkspace } from '@shared/lib/sheets';
import { SubscriptionStatus } from '@shared/lib/types';
import { apiClient } from '@shared/lib/api-client';
import { APP_VERSION } from '@shared/lib/version';

export function useDashboardInit(refreshData: (id: string) => Promise<void>) {
  const [initStage, setInitStage] = useState<'IDLE' | 'DATA_READ' | 'AUTH_PROCESS' | 'COMPLETED'>('IDLE');
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>({ isPro: false, limit: 30, usage: 0 });
  const [dataStatus, setDataStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isOffline, setIsOffline] = useState(typeof window !== 'undefined' ? !navigator.onLine : false);
  const [shareTargetSid, setShareTargetSid] = useState<string | null>(null);

  const isConsumingRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());

  const log = (msg: string) => {
    if (typeof window !== 'undefined' && (window as any)._pushDebug) {
      (window as any)._pushDebug(msg);
    }
  };

  // VERSION MIGRATION / AUTO-PURGE
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const lastVersion = localStorage.getItem('imagesnap_app_version');
    if (lastVersion && lastVersion !== APP_VERSION) {
      log(`[BOOT] Version Mismatch: ${lastVersion} -> ${APP_VERSION}. Purging old cache...`);
      // Keep only critical auth state if possible, otherwise full clear for safety
      const session = localStorage.getItem('imagesnap_session');
      localStorage.clear();
      if (session) localStorage.setItem('imagesnap_session', session);
      localStorage.setItem('imagesnap_app_version', APP_VERSION);
      
      // Clear caches
      if ('caches' in window) {
        caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))));
      }
      
      log(`[BOOT] Purge complete. Refreshing environment...`);
      setTimeout(() => window.location.reload(), 500);
    } else {
      localStorage.setItem('imagesnap_app_version', APP_VERSION);
    }
  }, []);

  const fetchSubStatus = async (email: string) => {
    log(`[AUTH] Fetching status for ${email}...`);
    setDataStatus('loading');
    try {
      const res = await apiClient(`/api/user-status?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const isAdmin = email.toLowerCase() === 'chautnus@gmail.com' || email.toLowerCase() === 'admin@imagesnap.cloud';
      const finalStatus = { ...data, isAdmin: data.isAdmin || isAdmin };
      
      if (finalStatus.isAdmin) {
        finalStatus.isPro = true;
        finalStatus.limit = 999999;
      }
      log(`[AUTH] Status fetched: role=${finalStatus.role}, isPro=${finalStatus.isPro}`);
      setSubStatus(finalStatus);
      setDataStatus('success');
    } catch (e) {
      log(`[FAIL] fetchSubStatus failed: ${e}`);
      setDataStatus('error');
    }
  };

  // REACTIVE SYNC
  useEffect(() => {
    if (!subStatus.masterSpreadsheetId || !isAuthReady) return;
    if (spreadsheetId === subStatus.masterSpreadsheetId) return;

    log(`[SYNC] Master ID update detected: ${subStatus.masterSpreadsheetId}`);
    localStorage.setItem('ps_sheet_id', subStatus.masterSpreadsheetId);
    setSpreadsheetId(subStatus.masterSpreadsheetId);
    refreshData(subStatus.masterSpreadsheetId);
  }, [subStatus.masterSpreadsheetId, isAuthReady, spreadsheetId, refreshData]);

  const initializeWorkspace = async () => {
    try {
      log("[DRIVE] Initializing workspace lookup...");
      const id = await findOrCreateWorkspace();
      log(`[DRIVE] Workspace resolution: ${id}`);
      setSpreadsheetId(id);
      localStorage.setItem('ps_sheet_id', id);
      await refreshData(id);
    } catch (err) {
      log(`[FATAL] Workspace init failed: ${err}`);
    }
  };

  const handleShareTarget = useCallback(async (providedSid?: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const sid = providedSid || urlParams.get('share_id');
    const lastProcessedId = sessionStorage.getItem('imagesnap_last_share_id');

    if (isConsumingRef.current || (sid && sid === lastProcessedId)) return;
    isConsumingRef.current = true;

    log(`[IDB] Beginning share ingestion for sid: ${sid}`);

    const attemptFetch = (attempt: number) => {
      return new Promise<void>((resolve) => {
        const DB_NAME = 'imagesnap-pwa-db';
        const DB_VERSION = 2;
        const STORE_NAME = 'shares';

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onsuccess = (event: any) => {
          const db = event.target.result;
          try {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);

            if (sid) {
              const getReq = store.get(sid);
              getReq.onsuccess = () => {
                if (getReq.result) {
                  log(`[IDB] DATA FOUND for ${sid}`);
                  setShareTargetSid(sid);
                  sessionStorage.setItem('imagesnap_last_share_id', sid);
                  
                  // Clean URL but preserve important flags like debug
                  const nextParams = new URLSearchParams(window.location.search);
                  nextParams.delete('share_id');
                  nextParams.delete('error');
                  const nextSearch = nextParams.toString();
                  const nextUrl = window.location.pathname + (nextSearch ? `?${nextSearch}` : '');
                  window.history.replaceState(null, '', nextUrl);
                  
                  resolve();
                } else if (attempt < 5) {
                  log(`[IDB] Data missing for ${sid}. Retry ${attempt + 1}/5...`);
                  db.close();
                  setTimeout(() => attemptFetch(attempt + 1).then(resolve), 800);
                } else {
                  log(`[FAIL] Share data ${sid} unavailable after retries.`);
                  resolve();
                }
              };
            } else { resolve(); }
            transaction.oncomplete = () => db.close();
          } catch (e) { log(`[FAIL] IDB Transaction error: ${e}`); db.close(); resolve(); }
        };
        request.onerror = () => { log('[FAIL] IDB Open error'); resolve(); };
      });
    };

    return attemptFetch(0).finally(() => {
      isConsumingRef.current = false;
    });
  }, [refreshData]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        log(`[KERNEL] SW Controller Shifted! v1.10.12 takeover.`);
        window.location.reload();
      });
    }

    const handleInit = async () => {
      log('[STAGE] Starting Auth Process...');
      try {
        const res = await apiClient('/api/auth/session');
        log(`[AUTH] Session response: ${res.status}`);
        const sessionData = await res.json();

        if (sessionData.authenticated && sessionData.user) {
          const profile = sessionData.user;
          log(`[AUTH] Authenticated as ${profile.email}`);
          setUser(profile);
          setAccessToken(profile.token);
          
          let storedId = localStorage.getItem('ps_sheet_id');
          setIsAuthReady(true);
          fetchSubStatus(profile.email);

          if (storedId) {
            log(`[DATA] Loading stored ID: ${storedId}`);
            setSpreadsheetId(storedId);
            try {
              await refreshData(storedId);
              log('[DATA] Initial load complete.');
            } catch (err: any) {
              if (err.status === 403 || err.status === 404) {
                log(`[DATA] Access denied for ${storedId}. Purging local ID.`);
                localStorage.removeItem('ps_sheet_id');
                await initializeWorkspace();
              }
            }
          } else {
            log('[DATA] No local ID found. Searching Drive...');
            await initializeWorkspace();
          }
        } else {
          log('[AUTH] No valid session found.');
          setAuthError("Session Expired - Please login again.");
        }
      } catch (e: any) {
        log(`[FATAL] Identity service unreachable: ${e}`);
        setAuthError("Identity service error.");
      }
    };

    const runInitialization = async () => {
      log(`[BOOT] System Version: ${APP_VERSION}`);
      setInitStage('AUTH_PROCESS');
      
      // WATCHDOG: Force release if stuck > 10s
      const watchdog = setTimeout(() => {
        if (initStage !== 'COMPLETED') {
          log('[WATCHDOG] Initialization taking too long. Forcing COMPLETED state.');
          setIsAuthReady(true); // Fallback
          setInitStage('COMPLETED');
        }
      }, 10000);

      await handleInit();
      clearTimeout(watchdog);
      setInitStage('COMPLETED');
      log('[STAGE] COMPLETED');
    };

    runInitialization();

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshData]);

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
