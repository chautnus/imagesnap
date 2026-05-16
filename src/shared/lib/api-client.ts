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
      console.warn('[API_CLIENT] 401 Unauthorized detected. Attempting re-authentication...');
      
      try {
        await reauthenticate();
        if (typeof (window as any)._pushDebug === 'function') {
          (window as any)._pushDebug(`[API] 401 Handled. Retrying ${url}...`);
        }
        return fetch(url, options);
      } catch (e) {
        console.error('[API_CLIENT] Re-authentication failed:', e);
        // [AUDIT v1.10.17] Removed blind redirect to '/' to prevent infinite Home <-> Dashboard loops.
        // We let the caller (e.g. useDashboardInit) handle the auth failure state.
      }
    }
  }

  return response;
}
