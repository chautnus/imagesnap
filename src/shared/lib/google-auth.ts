const getGoogleClientId = () => {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_CLIENT_ID) return import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return '271749541534-3cqn2t7c28drc79sno6tm9nssc7arbjl.apps.googleusercontent.com';
};

export const GOOGLE_CLIENT_ID = getGoogleClientId();
export const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

let tokenClient: any = null;
let accessToken: string | null = typeof window !== 'undefined' ? localStorage.getItem('ps_access_token') : null;
const successListeners = new Set<(token: string) => void>();

export const initGis = (onSuccess: (token: string) => void, retries = 0) => {
  if (typeof window === 'undefined') return;

  // Add to listeners
  successListeners.add(onSuccess);

  // Extension Check: Use chrome.identity if available
  // @ts-ignore
  const isExtension = !!(window.chrome && window.chrome.identity);

  if (isExtension) {
    if (accessToken) onSuccess(accessToken);
    return;
  }

  const google = (window as any).google;
  if (!google) {
    if (retries < 30) {
      setTimeout(() => initGis(onSuccess, retries + 1), 500);
    }
    return;
  }

  // Singleton pattern for tokenClient
  if (tokenClient) {
    if (accessToken) onSuccess(accessToken);
    return;
  }

  try {
    // @ts-ignore
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: (response: any) => {
        if (response.error !== undefined) {
          console.error('GIS Error:', response);
          return;
        }
        accessToken = response.access_token;
        localStorage.setItem('ps_access_token', response.access_token);
        // Notify all listeners
        successListeners.forEach(listener => listener(response.access_token));
      },
    });
    console.log('GIS initialized successfully');

    if (accessToken) {
      onSuccess(accessToken);
    }
  } catch (err) {
    console.error('GIS Init Failed:', err);
  }
};

export async function getUserInfo(token: string) {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('ps_access_token');
      }
      return null;
    }
    return response.json();
  } catch (e) {
    return null;
  }
}

export const requestToken = (prompt: 'consent' | 'none' = 'consent', onSuccess?: (token: string) => void) => {
  if (onSuccess) successListeners.add(onSuccess);

  // @ts-ignore
  if (window.chrome && window.chrome.identity) {
    // ... extension logic (kept same)
    const redirectUri = 'https://fdmfidehhcbcaaaeilbabddnkdlpbhda.chromiumapp.org/';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `response_type=token&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(SCOPES)}&` +
      `prompt=${prompt}`;

    window.chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, (redirectUrl: string | undefined) => {
      if (redirectUrl) {
        const url = new URL(redirectUrl.replace('#', '?'));
        const token = url.searchParams.get('access_token');
        if (token) {
          accessToken = token;
          localStorage.setItem('ps_access_token', token);
          successListeners.forEach(l => l(token));
        }
      }
    });
    return;
  }

  if (!tokenClient) {
    initGis((token) => {
      if (tokenClient) {
        tokenClient.requestAccessToken({ prompt });
      }
    });
    return;
  }
  
  tokenClient.requestAccessToken({ prompt });
};

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const revokeToken = () => {
  const currentToken = accessToken;
  accessToken = null;
  localStorage.removeItem('ps_access_token');
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
};
