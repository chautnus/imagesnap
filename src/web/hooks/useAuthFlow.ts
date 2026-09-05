import { initGis, setAccessToken, getUserInfo, saveTokenToExtStorage, loadTokenFromExtStorage, clearExtStorage, getExtensionSessionHeader } from '@shared/lib/google-auth';
import { findOrCreateWorkspace } from '@shared/lib/sheets';
import { SubscriptionStatus } from '@shared/lib/types';

const API_BASE_URL = (typeof window !== 'undefined' &&
  (window.location.protocol === 'extension:' ||
   window.location.protocol === 'chrome-extension:' ||
   window.location.protocol === 'ms-browser-extension:'))
  ? 'https://www.imagesnap.cloud'
  : '';

export interface AuthFlowHandlers {
  onSetUser: (user: any) => void;
  onSetIsAuthReady: (ready: boolean) => void;
  onSetView: (view: 'app' | 'landing' | 'privacy') => void;
  onSetSpreadsheetId: (id: string | null) => void;
  onSetSubStatus: (status: SubscriptionStatus) => void;
  onSetIsStaff: (isStaff: boolean) => void;
  refreshData: (id: string) => void;
}

export async function restoreSession(handlers: AuthFlowHandlers): Promise<boolean> {
  const { onSetUser, onSetIsAuthReady, onSetView, onSetSpreadsheetId, onSetSubStatus, onSetIsStaff, refreshData } = handlers;

  // Extension: server-side cookies don't work cross-origin — use chrome.storage.local instead
  const isExtension = typeof window !== 'undefined' &&
    (window.location.protocol.startsWith('chrome-extension') || window.location.protocol.startsWith('extension'));

  if (isExtension) {
    const stored = await loadTokenFromExtStorage();
    if (stored?.token) {
      const profile = await getUserInfo(stored.token);
      if (profile) {
        setAccessToken(stored.token);
        onSetUser(profile);
        onSetIsAuthReady(true);
        onSetView('app');
        fetchSubStatus(profile.email, onSetSubStatus);
        const storedId = localStorage.getItem('ps_sheet_id');
        if (storedId) { onSetSpreadsheetId(storedId); refreshData(storedId); }
        else await initializeWorkspace(onSetSpreadsheetId, refreshData);
        return true;
      }

      // Token expired — try refreshing token using session header before clearing storage
      try {
        const headers = await getExtensionSessionHeader();
        const res = await fetch('https://www.imagesnap.cloud/api/auth/refresh-token', { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.access_token) {
            const newToken = data.access_token;
            setAccessToken(newToken);
            saveTokenToExtStorage(newToken, stored.email);
            const freshProfile = await getUserInfo(newToken);
            if (freshProfile) {
              onSetUser(freshProfile);
              onSetIsAuthReady(true);
              onSetView('app');
              fetchSubStatus(freshProfile.email, onSetSubStatus);
              const storedId = localStorage.getItem('ps_sheet_id');
              if (storedId) { onSetSpreadsheetId(storedId); refreshData(storedId); }
              else await initializeWorkspace(onSetSpreadsheetId, refreshData);
              return true;
            }
          }
        }
      } catch (err) {
        console.error('[AUTH] extension refresh failed:', err);
      }

      // Token expired and refresh failed — clear and show login
      localStorage.removeItem('ps_sheet_id');
      clearExtStorage();
    }
    return false;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/session`);
    if (!res.ok) {
      return false;
    }
    const { authenticated, user } = await res.json();
    if (!authenticated || !user?.email) {
      return false;
    }

    // Staff session — no Google token needed
    if (user.role === 'staff') {
      onSetUser({ ...user, email: user.email });
      onSetIsStaff(true);
      onSetSpreadsheetId(user.masterSpreadsheetId || null);
      onSetIsAuthReady(true);
      onSetView('app');
      if (user.masterSpreadsheetId) refreshData(user.masterSpreadsheetId);
      return true;
    }

    // Google user — validate stored token
    if (user.token) {
      const profile = await getUserInfo(user.token);
      if (profile) {
        setAccessToken(user.token);
        // Refresh cookie with latest token to reset the 30-day expiry
        fetch(`${API_BASE_URL}/api/auth/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: profile.email, token: user.token, role: user.role }),
        }).catch(() => {});
        onSetUser(profile);
        onSetIsAuthReady(true);
        onSetView('app');
        fetchSubStatus(profile.email, onSetSubStatus);
        const storedId = localStorage.getItem('ps_sheet_id');
        if (storedId) { onSetSpreadsheetId(storedId); refreshData(storedId); }
        else await initializeWorkspace(onSetSpreadsheetId, refreshData);
        return true;
      }
    }

    if (user.email) {
      return false;
    }
  } catch {
    return false;
  }
}

export function initAuthListener(handlers: AuthFlowHandlers) {
  const {
    onSetUser, onSetIsAuthReady, onSetView,
    onSetSpreadsheetId, onSetSubStatus, refreshData,
  } = handlers;

  const handleTokenReceived = async (token: string) => {
    setAccessToken(token);
    try {
      const profile = await getUserInfo(token);
      if (profile) {
        saveTokenToExtStorage(token, profile.email);
        // PWA backup: persist token + email in localStorage so session can be
        // restored even when the server cookie is cleared by the browser
        localStorage.setItem('ps_pwa_token', token);
        localStorage.setItem('ps_pwa_email', profile.email);
        onSetUser(profile);
        onSetIsAuthReady(true);
        onSetView('app');
        fetchSubStatus(profile.email, onSetSubStatus);
        const storedId = localStorage.getItem('ps_sheet_id');
        if (storedId) {
          onSetSpreadsheetId(storedId);
          refreshData(storedId);
        } else {
          initializeWorkspace(onSetSpreadsheetId, refreshData);
        }
      } else {
        localStorage.removeItem('ps_access_token');
        onSetIsAuthReady(false);
      }
    } catch (e) {
      localStorage.removeItem('ps_access_token');
      onSetIsAuthReady(false);
    }
  };

  // Web: GIS token client callback
  initGis(handleTokenReceived);

  // Extension: chrome.identity dispatches SYS_AUTH_SUCCESS
  const onExtAuthSuccess = (e: Event) => {
    const token = (e as CustomEvent<{ token: string }>).detail?.token;
    if (token) handleTokenReceived(token);
  };
  window.addEventListener('SYS_AUTH_SUCCESS', onExtAuthSuccess);

  return () => {
    window.removeEventListener('SYS_AUTH_SUCCESS', onExtAuthSuccess);
  };
}

export async function initializeWorkspace(
  onSetSpreadsheetId: (id: string | null) => void,
  refreshData: (id: string) => void,
) {
  try {
    const id = await findOrCreateWorkspace();
    onSetSpreadsheetId(id);
    localStorage.setItem('ps_sheet_id', id);
    await refreshData(id);
  } catch (err) {
    console.error('Workspace init error:', err);
  }
}

export async function fetchSubStatus(
  email: string,
  onSetSubStatus: (s: SubscriptionStatus) => void,
) {
  const isAdmin =
    email.toLowerCase() === 'chautnus@gmail.com' ||
    email.toLowerCase() === 'admin@imagesnap.cloud';
  try {
    const res = await fetch(`${API_BASE_URL}/api/user-status?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    onSetSubStatus({ ...data, userEmail: email, isAdmin: data.isAdmin || isAdmin });
  } catch (e) {
    console.error('Sub status fetch fail', e);
    onSetSubStatus({ isPro: false, limit: 30, usage: 0, userEmail: email, isAdmin } as any);
  }
}

export async function handleUpgrade(userEmail: string) {
  if (!userEmail) return;
  try {
    const res = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  } catch (e) {
    console.error('Upgrade redirect fail', e);
    alert('Failed to initiate checkout. Please try again.');
  }
}

export function handleStaffLogin(
  data: { username: string; masterSpreadsheetId: string; user: any },
  handlers: Pick<AuthFlowHandlers, 'onSetUser' | 'onSetIsAuthReady' | 'onSetView' | 'onSetSpreadsheetId' | 'onSetIsStaff' | 'refreshData'>,
) {
  const { onSetUser, onSetIsAuthReady, onSetView, onSetSpreadsheetId, onSetIsStaff, refreshData } = handlers;
  onSetUser({ ...data.user, email: `${data.username}@staff.imagesnap` });
  onSetIsStaff(true);
  onSetSpreadsheetId(data.masterSpreadsheetId);
  onSetIsAuthReady(true);
  onSetView('app');
  refreshData(data.masterSpreadsheetId);
}
