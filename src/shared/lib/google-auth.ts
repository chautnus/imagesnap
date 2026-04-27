export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '495332791945-jshf9fvhe496jfbanig1qd2c7utl28up.apps.googleusercontent.com';
export const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

let tokenClient: any = null;
let accessToken: string | null = localStorage.getItem('ps_access_token');

export const initGis = (onSuccess: (token: string) => void) => {
  if (typeof window === 'undefined') return;

  // Extension Check: Use chrome.identity if available
  // @ts-ignore
  const isExtension = !!(window.chrome && window.chrome.identity);

  if (isExtension) {
    console.log('Detected Chrome Extension environment, checking auth state...');
    
    // Check if we're on Edge
    const isEdge = /Edg/.test(navigator.userAgent);
    
    if (isEdge) {
      console.log('Running on Edge, skipping getAuthToken to avoid error.');
      if (accessToken) onSuccess(accessToken);
    } else {
      // @ts-ignore
      window.chrome.identity.getAuthToken({ interactive: false }, (token: string | undefined) => {
        if (chrome.runtime.lastError) {
          console.warn('Silent getAuthToken failed (standard in some browsers):', chrome.runtime.lastError.message);
          if (accessToken) onSuccess(accessToken);
          return;
        }
        if (token) {
          accessToken = token;
          localStorage.setItem('ps_access_token', token);
          onSuccess(token);
        } else if (accessToken) {
          onSuccess(accessToken);
        }
      });
    }
    // In extension, we don't necessarily need window.google for everything
  }

  const google = (window as any).google;
  if (!google) {
    if (isExtension) {
      console.log('Google GSI script blocked by CSP, relying on chrome.identity only');
      return;
    }
    console.warn('Google GSI script not loaded yet. Waiting...');
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
          if (response.error === 'idpiframe_initialization_failed') {
            alert('Lỗi khởi tạo: Hãy đảm bảo bạn đã bật cookies cho trang web này.');
          }
          return;
        }
        accessToken = response.access_token;
        localStorage.setItem('ps_access_token', response.access_token);
        onSuccess(response.access_token);
      },
    });
    console.log('GIS initialized successfully');

    // Auto-login if token exists
    if (accessToken) {
      onSuccess(accessToken);
    }
  } catch (err) {
    console.error('GIS Init Failed:', err);
  }
};

export async function getUserInfo(token: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) return null;
  return response.json();
}

export const requestToken = (prompt: 'consent' | 'none' = 'consent', onSuccess?: (token: string) => void) => {
  // @ts-ignore
  if (window.chrome && window.chrome.identity) {
    // For Edge support and better reliability, use launchWebAuthFlow
    // @ts-ignore
    const redirectUri = window.chrome.identity.getRedirectURL();
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `response_type=token&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(SCOPES)}&` +
      `prompt=${prompt}`;

    console.log('Launching WebAuthFlow for extension...');
    // @ts-ignore
    window.chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, (redirectUrl: string | undefined) => {
      if (window.chrome.runtime.lastError) {
        console.error('LaunchWebAuthFlow Error:', window.chrome.runtime.lastError.message);
        // Fallback to getAuthToken if launchWebAuthFlow fails (only for Chrome)
        // @ts-ignore
        window.chrome.identity.getAuthToken({ interactive: true }, (token: string | undefined) => {
          if (token) {
            accessToken = token;
            localStorage.setItem('ps_access_token', token);
            if (onSuccess) onSuccess(token);
            window.location.reload();
          }
        });
        return;
      }

      if (redirectUrl) {
        const url = new URL(redirectUrl.replace('#', '?'));
        const token = url.searchParams.get('access_token');
        if (token) {
          accessToken = token;
          localStorage.setItem('ps_access_token', token);
          if (onSuccess) onSuccess(token);
          window.location.reload();
        }
      }
    });
    return;
  }

  if (!tokenClient) {
    alert("Auth client not ready. Please refresh.");
    return;
  }
  tokenClient.requestAccessToken({ prompt });
};

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const revokeToken = () => {
  if (!accessToken) return;
  const google = (window as any).google;
  if (!google) return;
  // @ts-ignore
  google.accounts.oauth2.revoke(accessToken, () => {
    accessToken = null;
    localStorage.removeItem('ps_access_token');
  });
};
