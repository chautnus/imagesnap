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
  
  // [ROOT CAUSE 2 & 3] Refs for stable callback and stage tracking
  const refreshDataRef = useRef(refreshData);
  const initStageRef = useRef<'IDLE' | 'DATA_READ' | 'AUTH_PROCESS' | 'COMPLETED'>('IDLE');

  useEffect(() => { refreshDataRef.current = refreshData; }, [refreshData]);
  
  const updateStage = (stage: 'IDLE' | 'DATA_READ' | 'AUTH_PROCESS' | 'COMPLETED') => {
    initStageRef.current = stage;
    setInitStage(stage);
  };

  const log = (msg: string) => {
    if (typeof window !== 'undefined' && (window as any)._pushDebug) {
      (window as any)._pushDebug(msg);
    }
  };

  // [ROOT CAUSE 1] Safe Version Migration with Session Storage Guard
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const purgeDone = sessionStorage.getItem('imagesnap_purge_done');
    const lastVersionStr = localStorage.getItem('imagesnap_app_version') || 'v0.0.0';
    
    const parseVer = (v: string) => parseInt(v.replace(/[^0-9]/g, '') || '0');
    const lastVer = parseVer(lastVersionStr);
    const currVer = parseVer(APP_VERSION);
    
    if (lastVer < currVer && !purgeDone) {
      sessionStorage.setItem('imagesnap_purge_done', '1');
      log(`[BOOT] Upgrading: ${lastVersionStr} -> ${APP_VERSION}...`);
      
      const session = localStorage.getItem('imagesnap_session');
      const isStaff = localStorage.getItem('ps_is_staff');
      const staffUser = localStorage.getItem('ps_staff_user');
      
      localStorage.clear();
      
      // Restore before reload
      if (session) localStorage.setItem('imagesnap_session', session);
      if (isStaff) localStorage.setItem('ps_is_staff', isStaff);
      if (staffUser) localStorage.setItem('ps_staff_user', staffUser);
      localStorage.setItem('imagesnap_app_version', APP_VERSION);
      
      if ('caches' in window) {
        caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))));
      }
      
      log(`[BOOT] Environment purged. Reloading...`);
      setTimeout(() => window.location.reload(), 300);
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
      log("[DRIVE] Resolution started...");
      const id = await findOrCreateWorkspace();
      log(`[DRIVE] Resolved: ${id.substring(0, 8)}`);
      setSpreadsheetId(id);
      localStorage.setItem('ps_sheet_id', id);
      return id;
    } catch (err) {
      log(`[FATAL] Workspace resolution failed: ${err}`);
      return null;
    }
  };

  const handleShareTarget = useCallback(async (providedSid?: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const sid = providedSid || urlParams.get('share_id');
    const lastProcessedId = sessionStorage.getItem('imagesnap_last_share_id');

    if (isConsumingRef.current || (sid && sid === lastProcessedId)) return;
    isConsumingRef.current = true;

    log(`[IDB] Share ingestion: ${sid}`);

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
                  log(`[IDB] DATA FOUND: ${sid}`);
                  setShareTargetSid(sid);
                  sessionStorage.setItem('imagesnap_last_share_id', sid);
                  
                  const nextParams = new URLSearchParams(window.location.search);
                  nextParams.delete('share_id');
                  const nextUrl = window.location.pathname + (nextParams.toString() ? `?${nextParams.toString()}` : '');
                  window.history.replaceState(null, '', nextUrl);
                  resolve();
                } else if (attempt < 5) {
                  log(`[IDB] Retry ${attempt + 1}/5...`);
                  db.close();
                  setTimeout(() => attemptFetch(attempt + 1).then(resolve), 800);
                } else {
                  log(`[FAIL] Share data missing.`);
                  resolve();
                }
              };
            } else { resolve(); }
            transaction.oncomplete = () => db.close();
          } catch (e) { log(`[FAIL] IDB Error: ${e}`); db.close(); resolve(); }
        };
        request.onerror = () => { log('[FAIL] IDB Open error'); resolve(); };
      });
    };

    return attemptFetch(0).finally(() => {
      isConsumingRef.current = false;
    });
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleControllerChange = () => {
        if (!sessionStorage.getItem('imagesnap_sw_reloaded')) {
          sessionStorage.setItem('imagesnap_sw_reloaded', '1');
          log(`[KERNEL] SW Shift! Reloading for v${APP_VERSION}...`);
          window.location.reload();
        }
      };
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
      return () => navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    }
  }, []);

  // [ROOT CAUSE: TOKEN EXPIRATION] Force Re-login when token dies
  useEffect(() => {
    const handleAuthExpired = () => {
      log('[AUTH] Token expired globally. Forcing re-login screen.');
      setAuthError("Phiên đăng nhập hết hạn. Vui lòng ấn Login để cấp lại quyền.");
      updateStage('AUTH_PROCESS');
    };

    window.addEventListener('SYS_AUTH_EXPIRED', handleAuthExpired);
    return () => window.removeEventListener('SYS_AUTH_EXPIRED', handleAuthExpired);
  }, []);

  // Triggered on completion to restore pending share Target from sessionStorage
  useEffect(() => {
    if (initStage === 'COMPLETED' && typeof window !== 'undefined') {
      const pendingSid = sessionStorage.getItem('imagesnap_pending_share_id');
      if (pendingSid) {
        log(`[INGEST] Restoring pending share_id from sessionStorage: ${pendingSid}`);
        handleShareTarget(pendingSid);
      }
    }
  }, [initStage, handleShareTarget]);

  useEffect(() => {
    const handleInit = async () => {
      log('[STAGE] Auth Ingress...');
      try {
        const res = await apiClient('/api/auth/session');
        const sessionData = await res.json();

        if (sessionData.authenticated && sessionData.user) {
          const profile = sessionData.user;
          log(`[AUTH] Profile: ${profile.email}`);
          setUser(profile);
          setAccessToken(profile.token);
          
          let storedId = localStorage.getItem('ps_sheet_id');
          setIsAuthReady(true);
          fetchSubStatus(profile.email);

          if (storedId) {
            log(`[DATA] Local ID: ${storedId.substring(0, 8)}`);
            setSpreadsheetId(storedId);
            await refreshDataRef.current(storedId);
          } else {
            log('[DATA] Drive Search...');
            const newId = await initializeWorkspace();
            if (newId) {
              await refreshDataRef.current(newId);
            }
          }
        } else {
          log('[AUTH] No session.');
          setAuthError("Session Expired - Please login again.");
        }
      } catch (e: any) {
        log(`[FATAL] Identity error: ${e}`);
        setAuthError("Identity service error.");
      }
    };

    const runInitialization = async () => {
      updateStage('AUTH_PROCESS');
      
      const urlParams = new URLSearchParams(window.location.search);
      const sid = urlParams.get('share_id');
      const swError = urlParams.get('sw_fatal_error');
      
      if (sid) {
        sessionStorage.setItem('imagesnap_pending_share_id', sid);
        log(`[SESSION] Cached pending share_id: ${sid}`);
      }
      
      if (swError === 'true') {
        sessionStorage.setItem('imagesnap_pending_fatal_error', 'true');
        log(`[SESSION] Cached pending fatal error flag`);
      }
      
      // Clean up URL parameters immediately
      if (sid || swError) {
        try {
          const nextParams = new URLSearchParams(window.location.search);
          nextParams.delete('share_id');
          nextParams.delete('sw_fatal_error');
          const nextUrl = window.location.pathname + (nextParams.toString() ? `?${nextParams.toString()}` : '');
          window.history.replaceState(null, '', nextUrl);
        } catch (e) {}
      }
      
      // [ROOT CAUSE 3] Watchdog using Ref to avoid stale closure
      const watchdog = setTimeout(() => {
        if (initStageRef.current !== 'COMPLETED') {
          log('[WATCHDOG] Stale init detected. Force-release.');
          setIsAuthReady(true); 
          updateStage('COMPLETED');
        }
      }, 15000);

      await handleInit();
      clearTimeout(watchdog);
      updateStage('COMPLETED');
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
  }, []); // [ROOT CAUSE 2] Dependency array is empty, stabilized via Refs

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
