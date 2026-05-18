const getGoogleClientId = () => {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_CLIENT_ID) return import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return '271749541534-3cqn2t7c28drc79sno6tm9nssc7arbjl.apps.googleusercontent.com';
};

export const GOOGLE_CLIENT_ID = getGoogleClientId();
export const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

// Marvin Core: Deterministic Auth State Management
let tokenClient: any = null;
let accessToken: string | null = null; // Removed localStorage sync for security

// Callback queue to handle multiple concurrent auth requests
interface AuthCallback {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}
let authQueue: AuthCallback[] = [];

/**
 * Ensures Google GSI script is loaded with a hard 10s timeout
 */
const ensureGsiScript = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.reject(new Error('Window undefined'));
  const isExtension = window.location.protocol.startsWith('chrome-extension') || window.location.protocol.startsWith('extension') || ((window as any).chrome && (window as any).chrome.identity);
  if (isExtension) {
    return Promise.resolve();
  }
  if ((window as any).google?.accounts?.oauth2) {
    if (typeof window !== 'undefined' && (window as any)._pushDebug) (window as any)._pushDebug('[GSI] Script already present');
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('GSI_LOAD_TIMEOUT'));
    }, 10000);

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any)._pushDebug) (window as any)._pushDebug('[GSI] Script loaded successfully');
      clearTimeout(timeout);
      resolve();
    };
    script.onerror = () => {
      if (typeof window !== 'undefined' && (window as any)._pushDebug) (window as any)._pushDebug('[GSI] Script load failed');
      clearTimeout(timeout);
      reject(new Error('GSI_LOAD_FAILED'));
    };
    document.head.appendChild(script);
  });
};

export const initGis = async (onSuccess: (token: string) => void) => {
  if (typeof window === 'undefined') return;
  const isExtension = window.location.protocol.startsWith('chrome-extension') || window.location.protocol.startsWith('extension') || ((window as any).chrome && (window as any).chrome.identity);
  if (isExtension) {
    return;
  }

  // Add to queue
  const authPromise = new Promise<string>((resolve, reject) => {
    authQueue.push({ resolve, reject });
  });

  // Link the caller's callback to this promise
  authPromise.then(onSuccess).catch((err) => {
    console.error('Deterministic Auth Failure:', err.message);
  });

  try {
    if (typeof window !== 'undefined' && (window as any)._pushDebug) (window as any)._pushDebug('[GIS] Ensuring GSI Script...');
    await ensureGsiScript();
    
    const google = (window as any).google;
    if (!tokenClient) {
      if (typeof window !== 'undefined' && (window as any)._pushDebug) (window as any)._pushDebug('[GIS] Initializing Token Client...');
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: (response: any) => {
          if (response.error !== undefined) {
            const err = new Error(`GIS_ERROR: ${response.error}`);
            if (typeof window !== 'undefined' && (window as any)._pushDebug) (window as any)._pushDebug(`[GIS] Handshake Error: ${response.error}`);
            authQueue.forEach(q => q.reject(err));
            authQueue = [];
            return;
          }
          if (typeof window !== 'undefined' && (window as any)._pushDebug) (window as any)._pushDebug('[GIS] Handshake Success');
          accessToken = response.access_token;
          authQueue.forEach(q => q.resolve(response.access_token));
          authQueue = [];
        },
      });
    }

    if (accessToken) {
      if (typeof window !== 'undefined' && (window as any)._pushDebug) (window as any)._pushDebug('[GIS] Using existing RAM token');
      authQueue.forEach(q => q.resolve(accessToken!));
      authQueue = [];
      return;
    }

    if (typeof window !== 'undefined' && (window as any)._pushDebug) (window as any)._pushDebug('[GIS] Requesting fresh token (interactive)...');
    tokenClient.requestAccessToken();
  } catch (err: any) {
    // Flush queue with error
    authQueue.forEach(q => q.reject(err));
    authQueue = [];
  }
};

export async function getUserInfo(token: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // Marvin Core: 5s Hard Timeout

  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { 'Authorization': `Bearer ${token}` },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (e) {
    console.warn('Userinfo fetch terminated:', (e as Error).message);
    return null;
  }
}

export const requestToken = (prompt: 'consent' | 'none' = 'consent', onSuccess?: (token: string) => void) => {
  if (onSuccess) authQueue.push({ resolve: onSuccess, reject: () => {} });

  const getRedirectUri = () => {
    if (typeof window !== 'undefined') {
      const isExtension = window.location.protocol.startsWith('chrome-extension') || window.location.protocol.startsWith('extension');
      if (isExtension) {
        return 'https://fdmfidehhcbcaaaeilbabddnkdlpbhda.chromiumapp.org/';
      }
      return `${window.location.origin}/auth/callback`;
    }
    return '';
  };

  const redirectUri = getRedirectUri();
  
  // Universal Redirect Flow (Web & Extension)
  if (prompt === 'consent') {
    // Standard OAuth2 Redirect to bypass mobile pop-up blockers
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `response_type=token&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(SCOPES)}&` +
      `prompt=consent`;

    // Extension Check: Use chrome.identity if available
    // @ts-ignore
    if (window.chrome && window.chrome.identity) {
      window.chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, (redirectUrl: string | undefined) => {
        if (redirectUrl) {
          const url = new URL(redirectUrl.replace('#', '?'));
          const token = url.searchParams.get('access_token');
          if (token) {
            accessToken = token;
            authQueue.forEach(q => q.resolve(token));
            authQueue = [];
          }
        }
      });
      return;
    }

    // Web Fallback: Direct Redirect
    window.location.href = authUrl;
    return;
  }

  // Silent Prompt (prompt: 'none') - Keep using GIS for background refresh
  if (!tokenClient) {
    initGis((token) => {
      if (tokenClient) {
        tokenClient.requestAccessToken({ prompt: 'none' });
      }
    });
    return;
  }
  
  tokenClient.requestAccessToken({ prompt: 'none' });
};

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const revokeToken = () => {
  const currentToken = accessToken;
  accessToken = null;
  localStorage.removeItem('ps_staff_token');
  localStorage.removeItem('ps_staff_email');
  localStorage.removeItem('ps_is_staff');

  if (currentToken) {
    const google = (window as any).google;
    if (google && google.accounts && google.accounts.oauth2) {
      // @ts-ignore
      google.accounts.oauth2.revoke(currentToken, () => {
        console.log('Token revoked from Google');
      });
    }
  }

  fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {});
};

export const establishSession = async (token: string, email: string, isStaff: boolean = false) => {
  try {
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email, isStaff })
    });
  } catch (e) {
    console.error('Failed to establish secure session', e);
  }
};

export const reauthenticate = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.warn("[AUTH] Token expired. Silent re-authentication is deprecated due to browser ITP rules. Forcing manual re-login.");
    revokeToken();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('SYS_AUTH_EXPIRED'));
    }
    reject(new Error("Token expired. Re-authentication required."));
  });
};
