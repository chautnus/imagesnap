// Use the Client ID from environment variables or a fallback for development
// Note: In AI Studio, users should set VITE_GOOGLE_CLIENT_ID in the Secrets panel.
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '271749541534-0ohcjg65bmejf4gjhd4ve17quggp72q1.apps.googleusercontent.com';
export const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

let tokenClient: any = null;
let accessToken: string | null = localStorage.getItem('ps_access_token');

export const initGis = (onSuccess: (token: string) => void) => {
  if (typeof window === 'undefined') return;

  // Extension Check: Use chrome.identity if available
  // @ts-ignore
  if (window.chrome && window.chrome.identity) {
    console.log('Detected Chrome Extension environment, using chrome.identity');
    // @ts-ignore
    window.chrome.identity.getAuthToken({ interactive: false }, (token: string | undefined) => {
      if (token) {
        accessToken = token;
        localStorage.setItem('ps_access_token', token);
        onSuccess(token);
      } else {
        // If interactive: false fails, try interactive: true later or let user trigger it
        console.log('Silent extension auth failed, waiting for user trigger');
      }
    });
  }
  
  const google = (window as any).google;
  if (!google) {
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

export const requestToken = (prompt: 'consent' | 'none' = 'consent') => {
  if (!tokenClient) return;
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
