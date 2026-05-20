import { initGis, setAccessToken, getUserInfo } from '@shared/lib/google-auth';
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
