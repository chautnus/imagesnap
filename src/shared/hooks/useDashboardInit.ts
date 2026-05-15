import { useState, useRef, useEffect } from 'react';
import { initGis, setAccessToken, getUserInfo } from '@shared/lib/google-auth';
import { findOrCreateWorkspace } from '@shared/lib/sheets';
import { SubscriptionStatus } from '@shared/lib/types';

interface UseDashboardInitOptions {
  refreshData: (id: string) => void;
  setActiveTab: (tab: 'capture' | 'data' | 'settings' | 'help') => void;
  setImportedImages: (imgs: string[]) => void;
  setImportedUrl: (url: string) => void;
  setImportedMetadata: (meta: any) => void;
}

export function useDashboardInit({
  refreshData,
  setActiveTab,
  setImportedImages,
  setImportedUrl,
  setImportedMetadata,
}: UseDashboardInitOptions) {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>({ isPro: false, limit: 30, usage: 0 });
  const [isOffline, setIsOffline] = useState(typeof window !== 'undefined' ? !navigator.onLine : false);
  const [initStage, setInitStage] = useState<'IDLE' | 'DATA_READ' | 'AUTH_PROCESS' | 'COMPLETED'>('IDLE');
  const isConsumingRef = useRef(false);

  const fetchSubStatus = async (email: string) => {
    const isAdmin = email.toLowerCase() === 'chautnus@gmail.com' || email.toLowerCase() === 'admin@imagesnap.cloud';
    try {
      const res = await fetch(`/api/user-status?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setSubStatus({ ...data, isAdmin: data.isAdmin || isAdmin });
    } catch {
      setSubStatus(prev => ({ ...prev, isAdmin }));
    }
  };

  const initializeWorkspace = async () => {
    try {
      const id = await findOrCreateWorkspace();
      setSpreadsheetId(id);
      localStorage.setItem('ps_sheet_id', id);
      await refreshData(id);
    } catch (err) {
      console.error('Workspace init error:', err);
    }
  };

  const consumeSharedDataFromDB = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ImageSnapSharing', 1);
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('sharedContent')) { resolve(null); return; }
        const transaction = db.transaction('sharedContent', 'readwrite');
        const store = transaction.objectStore('sharedContent');
        const getReq = store.get('latest');
        getReq.onsuccess = () => {
          const result = getReq.result;
          if (result) {
            store.delete('latest');
            transaction.oncomplete = () => resolve(result);
          } else {
            resolve(null);
          }
        };
        getReq.onerror = () => reject(getReq.error);
        transaction.onerror = () => reject(transaction.error);
      };
      request.onerror = () => reject(request.error);
    });
  };

  const handleShareTarget = async () => {
    if (isConsumingRef.current) return;
    isConsumingRef.current = true;
    try {
      const data = await consumeSharedDataFromDB();
      if (data) {
        const images: string[] = [];
        // P-2 FIX: data.images is now an array (getAll) — handle both old & new shape
        const fileList: File[] = Array.isArray(data.images)
          ? data.images
          : data.image ? [data.image] : [];
        for (const file of fileList) {
          const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          images.push(dataUrl);
        }
        if (images.length > 0) setImportedImages(images);
        if (data.url || data.text) setImportedUrl(data.url || data.text);
        if (data.title) setImportedMetadata({ t: data.title });
        setActiveTab('capture');
      }
    } catch (e) {
      console.error('Failed to consume shared data', e);
    } finally {
      isConsumingRef.current = false;
    }
  };

  useEffect(() => {
    const handleInit = async () => {
      const storedToken = localStorage.getItem('ps_access_token');
      const isStaff = localStorage.getItem('ps_is_staff') === 'true';

      if (!storedToken && !isStaff) {
        setAuthError('Session Required - Please login from the home page.');
        return;
      }

      if (isStaff) {
        const staffEmail = localStorage.getItem('ps_staff_email');
        const storedId = localStorage.getItem('ps_sheet_id');
        if (staffEmail && storedId) {
          setUser({ email: staffEmail, role: 'staff' });
          setSpreadsheetId(storedId);
          setIsAuthReady(true);
          setSubStatus({ isPro: true, limit: 999999, usage: 0, role: 'staff' });
          refreshData(storedId);
          return;
        }
      }

      initGis(async (token) => {
        setAccessToken(token);
        try {
          const profile = await getUserInfo(token);
          if (profile) {
            setUser(profile);
            setIsAuthReady(true);
            fetchSubStatus(profile.email);
            const storedId = localStorage.getItem('ps_sheet_id');
            if (storedId) { setSpreadsheetId(storedId); refreshData(storedId); }
            else { initializeWorkspace(); }
          } else {
            setAuthError('Session Expired - Verification failed on new infrastructure.');
            localStorage.removeItem('ps_access_token');
          }
        } catch {
          setAuthError('Session Expired - Identity service error.');
          localStorage.removeItem('ps_access_token');
        }
      }).catch((err: Error) => {
        setAuthError(`Auth Service Error: ${err.message}`);
        localStorage.removeItem('ps_access_token');
      });

      const recoveryTimer = setTimeout(() => {
        if (!isAuthReady) {
          setAuthError('Authentication Timed Out - Check your connection.');
          localStorage.removeItem('ps_access_token');
        }
      }, 18000);

      return () => clearTimeout(recoveryTimer);
    };

    const runInitialization = async () => {
      // P-4 FIX: auth first, then consume shared data so images aren't lost if auth fails
      setInitStage('AUTH_PROCESS');
      await handleInit();
      setInitStage('DATA_READ');
      await handleShareTarget();
      setInitStage('COMPLETED');
    };

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    runInitialization();

    // P-1 FIX: migration_v1_6_1 unregister block REMOVED — it was deleting the Share Target
    // SW on every new device. Migration is complete as of v8.2; flag is now permanent in
    // localStorage so old code paths are harmless if somehow still present.

    const channel = new BroadcastChannel('imagesnap-share-target');
    channel.onmessage = (event) => {
      if (event.data.type === 'NEW_SHARE_DATA') handleShareTarget();
    };

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      channel.close();
    };
  }, []);

  const handleUpgrade = async (email: string) => {
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      alert('Failed to initiate checkout.');
    }
  };

  return {
    authError,
    isAuthReady,
    user,
    spreadsheetId,
    subStatus,
    setSubStatus,
    isOffline,
    initStage,
    fetchSubStatus,
    handleUpgrade,
  };
}
