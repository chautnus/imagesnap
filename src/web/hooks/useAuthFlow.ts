import { initGis, setAccessToken, getUserInfo, requestSilentToken, saveTokenToExtStorage, loadTokenFromExtStorage, clearExtStorage } from '@shared/lib/google-auth';
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
      // Token expired (Google access tokens last ~1h) — clear and show login
      clearExtStorage();
    }
    return false;
  }

  // PWA localStorage backup restore — runs when cookie is missing (iOS clears PWA storage)
  const pwaRestoreFromLocalStorage = async (): Promise<boolean> => {
    const cachedToken = localStorage.getItem('ps_pwa_token');
    const cachedEmail = localStorage.getItem('ps_pwa_email');
    if (!cachedToken || !cachedEmail) return false;

    // Validate cached token with Google
    const profile = await getUserInfo(cachedToken);
    if (profile) {
      setAccessToken(cachedToken);
      // Rebuild server session cookie
      fetch(`${API_BASE_URL}/api/auth/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email, token: cachedToken }),
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

    // Cached token expired — try silent re-auth with stored email hint
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), 6000);
      requestSilentToken((freshToken) => {
        clearTimeout(timeout);
        setAccessToken(freshToken);
        localStorage.setItem('ps_pwa_token', freshToken);
        fetch(`${API_BASE_URL}/api/auth/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cachedEmail, token: freshToken }),
        }).catch(() => {});
        getUserInfo(freshToken).then((p) => {
          if (p) {
            onSetUser(p);
            onSetIsAuthReady(true);
            onSetView('app');
            fetchSubStatus(p.email, onSetSubStatus);
            const storedId = localStorage.getItem('ps_sheet_id');
            if (storedId) { onSetSpreadsheetId(storedId); refreshData(storedId); }
            else initializeWorkspace(onSetSpreadsheetId, refreshData);
            resolve(true);
          } else {
            resolve(false);
          }
        }).catch(() => resolve(false));
      }, () => { clearTimeout(timeout); resolve(false); });
    });
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/session`);
    if (!res.ok) {
      // Cookie missing — try PWA localStorage fallback before giving up
      return await pwaRestoreFromLocalStorage();
    }
    const { authenticated, user } = await res.json();
    if (!authenticated || !user?.email) {
      return await pwaRestoreFromLocalStorage();
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

    // Token expired (cookie still valid but Google token ~1h lifetime).
    // Try localStorage backup → silent GIS refresh → if all fail, return false
    // so initAuthListener is called and the user can re-authenticate interactively.
    if (user.email) {
      return await pwaRestoreFromLocalStorage();
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
