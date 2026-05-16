import { reauthenticate } from './google-auth';

interface FetchOptions extends RequestInit {
  // Custom options if needed
}

/**
 * Global API Client Interceptor
 * Replaces standard fetch for protected routes on the client side.
 */
export async function apiClient(url: string, options: FetchOptions = {}): Promise<Response> {
  const response = await fetch(url, options);

  // Global 401 Interceptor
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      console.warn('[API_CLIENT] 401 Unauthorized detected. Triggering passive re-authentication...');
      
      try {
        await reauthenticate();
        if (typeof (window as any)._pushDebug === 'function') (window as any)._pushDebug(`[API] 401 Handled. Retrying ${url}...`);
        return fetch(url, options);
      } catch (e) {
        console.error('[API_CLIENT] Re-authentication failed:', e);
        // If re-auth completely fails, redirect to home
        window.location.href = '/?auth=expired';
      }
    }
  }

  return response;
}
