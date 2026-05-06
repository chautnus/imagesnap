export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '271749541534-3cqn2t7c28drc79sno6tm9nssc7arbjl.apps.googleusercontent.com';
export const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

let tokenClient: any = null;
let accessToken: string | null = localStorage.getItem('ps_access_token');

export const initGis = (onSuccess: (token: string) => void) => {
  if (typeof window === 'undefined') return;

  // Extension Check: Use chrome.identity if available
  // @ts-ignore
  const isExtension = !!(window.chrome && window.chrome.identity);

  if (isExtension) {
    console.log('Detected Chrome Extension environment.');
    // Check if we're on Edge
    const isEdge = /Edg/.test(navigator.userAgent);
    
    // Skip silent getAuthToken because we are using a Web App Client ID
    // which causes 'bad client id' warnings in the console.
    if (accessToken) onSuccess(accessToken);
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
    // Force the redirect URI to match our fixed Extension ID
    const redirectUri = 'https://fdmfidehhcbcaaaeilbabddnkdlpbhda.chromiumapp.org/';
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
        return;
      }

      if (redirectUrl) {
        const url = new URL(redirectUrl.replace('#', '?'));
        const token = url.searchParams.get('access_token');
        if (token) {
          accessToken = token;
          localStorage.setItem('ps_access_token', token);
          if (onSuccess) onSuccess(token);
          
          // Use explicit navigation to avoid ERR_FILE_NOT_FOUND on reload
          if (window.chrome && window.chrome.runtime && window.chrome.runtime.getURL) {
            window.location.href = window.chrome.runtime.getURL('index.html');
          } else {
            window.location.reload();
          }
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
