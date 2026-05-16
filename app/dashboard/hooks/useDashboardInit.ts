import { useState, useEffect, useRef } from 'react';
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
  const abortControllerRef = useRef<AbortController | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const fetchSubStatus = async (email: string) => {
    const isAdmin = email.toLowerCase() === 'chautnus@gmail.com' || email.toLowerCase() === 'admin@imagesnap.cloud';
    setDataStatus('loading');
    try {
      const res = await apiClient(`/api/user-status?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const finalStatus = { ...data, isAdmin: data.isAdmin || isAdmin };
      if (finalStatus.isAdmin) {
        finalStatus.isPro = true;
        finalStatus.limit = 999999;
      }
      setSubStatus(finalStatus);
      setDataStatus('success');
    } catch (e) {
      setSubStatus(prev => ({ ...prev, isAdmin }));
      setDataStatus('error');
      console.error("fetchSubStatus failed:", e);
    }
  };

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

  const handleShareTarget = async (providedSid?: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const sid = providedSid || urlParams.get('share_id');
    const lastProcessedId = sessionStorage.getItem('imagesnap_last_share_id');

    if ((window as any)._pushDebug) (window as any)._pushDebug(`[IDEMPOTENCY] Check: sid=${sid}, last=${lastProcessedId}, isLocked=${isConsumingRef.current}`);

    if (isConsumingRef.current || (sid && sid === lastProcessedId)) {
      if ((window as any)._pushDebug && sid && sid === lastProcessedId) (window as any)._pushDebug('[IDEMPOTENCY] Share already processed');
      return;
    }

    isConsumingRef.current = true;

    if ((window as any)._pushDebug) (window as any)._pushDebug('[STAGE_A] Querying IDB v2 sid Storage...');

    const attemptFetch = (attempt: number) => {
      return new Promise<void>((resolve) => {
        const DB_NAME = 'imagesnap-pwa-db';
        const DB_VERSION = 2;
        const STORE_NAME = 'shares';

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onsuccess = (event: any) => {
          const db = event.target.result;
          
          // SCRUB URL ONLY ON SUCCESSFUL IDB ACCESS (Fix Bug 3 & 4)
          if (sid) {
            sessionStorage.setItem('imagesnap_last_share_id', sid);
            window.history.replaceState(null, '', window.location.pathname);
            if ((window as any)._pushDebug) (window as any)._pushDebug(`[KERNEL] Success: IDB Open. URL scrubbed for ${sid}`);
          }

          try {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);

            const handleData = (data: any, key: string) => {
              if ((window as any)._pushDebug) (window as any)._pushDebug(`[STAGE_B] Data found for ${key}! Signaling CaptureTab...`);
              setShareTargetSid(key);
            };

            if (sid) {
              const getReq = store.get(sid);
              getReq.onsuccess = () => {
                if (getReq.result) {
                  handleData(getReq.result, sid);
                  resolve();
                } else if (attempt < 3) {
                  if ((window as any)._pushDebug) (window as any)._pushDebug(`[RETRY] SID ${sid} not found. Attempt ${attempt+1}/3...`);
                  db.close();
                  setTimeout(() => attemptFetch(attempt + 1).then(resolve), 100 * (attempt + 1));
                } else {
                  if ((window as any)._pushDebug) (window as any)._pushDebug(`[RETRY] SID ${sid} giving up after 3 attempts.`);
                  resolve();
                }
              };
            } else {
              // Legacy/Fallback cursor logic
              const cursorReq = store.openCursor(null, 'prev');
              cursorReq.onsuccess = (e: any) => {
                const cursor = e.target.result;
                if (cursor) {
                  if (cursor.key !== lastProcessedId && cursor.key !== 'latest') {
                    handleData(cursor.value, cursor.key as string);
                    resolve();
                  } else {
                    cursor.continue();
                  }
                } else { resolve(); }
              };
            }

            transaction.oncomplete = () => db.close();
          } catch (e) {
            db.close();
            resolve();
          }
        };

        request.onerror = () => resolve();
      });
    };

    return attemptFetch(0).finally(() => {
      isConsumingRef.current = false;
    });
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if ((window as any)._pushDebug) (window as any)._pushDebug(`[KERNEL] SW Controller Shifted! Reloading for ${APP_VERSION}...`);
        window.location.reload();
      });
    }

    // BroadcastChannel Bridge for SW Logs
    try {
      const bc = new BroadcastChannel('imagesnap-logs');
      bc.onmessage = (event) => {
        if (event.data?.type === 'LOG' && (window as any)._pushDebug) {
          (window as any)._pushDebug(event.data.msg);
        }
      };
      return () => bc.close();
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
          const storedId = localStorage.getItem('ps_sheet_id');
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
