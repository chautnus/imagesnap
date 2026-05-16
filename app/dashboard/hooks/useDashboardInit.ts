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
  const versionPurgedRef = useRef(false);

  const log = (msg: string) => {
    if (typeof window !== 'undefined' && (window as any)._pushDebug) {
      (window as any)._pushDebug(msg);
    }
  };

  // SAFE VERSION MIGRATION: Only purge if new version is GREATER
  useEffect(() => {
    if (typeof window === 'undefined' || versionPurgedRef.current) return;
    
    const parseVer = (v: string) => parseInt(v.replace(/[^0-9]/g, '') || '0');
    const lastVersionStr = localStorage.getItem('imagesnap_app_version') || 'v0.0.0';
    const lastVer = parseVer(lastVersionStr);
    const currVer = parseVer(APP_VERSION);
    
    if (lastVer < currVer) {
      versionPurgedRef.current = true;
      log(`[BOOT] Upgrading Environment: ${lastVersionStr} -> ${APP_VERSION}...`);
      
      const session = localStorage.getItem('imagesnap_session');
      const isStaff = localStorage.getItem('ps_is_staff');
      const staffUser = localStorage.getItem('ps_staff_user');
      
      localStorage.clear();
      
      if (session) localStorage.setItem('imagesnap_session', session);
      if (isStaff) localStorage.setItem('ps_is_staff', isStaff);
      if (staffUser) localStorage.setItem('ps_staff_user', staffUser);
      
      localStorage.setItem('imagesnap_app_version', APP_VERSION);
      
      if ('caches' in window) {
        caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))));
      }
      
      log(`[BOOT] Purge complete. Activating v${currVer}...`);
      setTimeout(() => window.location.reload(), 300);
    } else if (lastVer > currVer) {
      log(`[BOOT] Legacy browser cache detected (running ${APP_VERSION} < stored ${lastVersionStr}). Bypassing purge.`);
    } else {
      localStorage.setItem('imagesnap_app_version', APP_VERSION);
    }
  }, []);

  const fetchSubStatus = async (email: string) => {
    log(`[AUTH] Fetching sub status...`);
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
      setSubStatus(finalStatus);
      setDataStatus('success');
    } catch (e) {
      log(`[FAIL] fetchSubStatus failed: ${e}`);
      setDataStatus('error');
    }
  };

  const initializeWorkspace = async () => {
    try {
      log("[DRIVE] Initializing workspace lookup...");
      const id = await findOrCreateWorkspace();
      log(`[DRIVE] Workspace resolved: ${id.substring(0, 8)}`);
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

    log(`[IDB] Beginning ingestion: ${sid}`);

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
                  
                  const nextParams = new URLSearchParams(window.location.search);
                  nextParams.delete('share_id');
                  nextParams.delete('error');
                  const nextSearch = nextParams.toString();
                  const nextUrl = window.location.pathname + (nextSearch ? `?${nextSearch}` : '');
                  window.history.replaceState(null, '', nextUrl);
                  
                  resolve();
                } else if (attempt < 5) {
                  log(`[IDB] Data missing. Retry ${attempt + 1}/5...`);
                  db.close();
                  setTimeout(() => attemptFetch(attempt + 1).then(resolve), 800);
                } else {
                  log(`[FAIL] Share data missing after retries.`);
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
      const handleControllerChange = () => {
        if (!sessionStorage.getItem('imagesnap_sw_reloaded')) {
          sessionStorage.setItem('imagesnap_sw_reloaded', '1');
          log(`[KERNEL] SW Controller Shifted! Refreshing for v${APP_VERSION}...`);
          window.location.reload();
        }
      };
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
      return () => navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    }
  }, []);

  useEffect(() => {
    const handleInit = async () => {
      log('[STAGE] Auth Process...');
      try {
        const res = await apiClient('/api/auth/session');
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
            log(`[DATA] Connecting to ID: ${storedId.substring(0, 8)}`);
            setSpreadsheetId(storedId);
            try {
              await refreshData(storedId);
              log('[DATA] Ready.');
            } catch (err: any) {
              if (err.status === 403 || err.status === 404) {
                log(`[DATA] Access denied. Purging local ID.`);
                localStorage.removeItem('ps_sheet_id');
                await initializeWorkspace();
              }
            }
          } else {
            log('[DATA] Searching Drive...');
            await initializeWorkspace();
          }
        } else {
          log('[AUTH] No valid session.');
          setAuthError("Session Expired - Please login again.");
        }
      } catch (e: any) {
        log(`[FATAL] Identity error: ${e}`);
        setAuthError("Identity service error.");
      }
    };

    const runInitialization = async () => {
      setInitStage('AUTH_PROCESS');
      
      const watchdog = setTimeout(() => {
        if (initStage !== 'COMPLETED') {
          log('[WATCHDOG] Force-release.');
          setIsAuthReady(true); 
          setInitStage('COMPLETED');
        }
      }, 15000);

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
