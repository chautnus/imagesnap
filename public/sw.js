// ImageSnap Service Worker v8.2 - Schema Sync Edition
const CACHE_NAME = 'imagesnap-v8.2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clear old caches from v1.5.x
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => clients.claim())
  );
});

// Handle Web Share Target with Absolute Interception (POST -> 303 -> GET)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isDashboardPath = url.pathname === '/dashboard' || url.pathname === '/dashboard/';

  if (event.request.method === 'POST' && isDashboardPath) {
    event.respondWith(
      (async () => {
        try {
          const formData = await event.request.formData();
          const imageFile = formData.get('images');
          const title = formData.get('title') || '';
          const text = formData.get('text') || '';
          const link = formData.get('url') || '';

          // 20MB Safety Check
          if (imageFile && imageFile.size > 20 * 1024 * 1024) {
             return Response.redirect('/dashboard?error=file_too_large', 303);
          }

          // Atomic write to IndexedDB
          if (imageFile) {
            await saveSharedData({ 
              image: imageFile, 
              title, 
              text, 
              url: link,
              timestamp: Date.now() 
            });
          }

          // Return 303 See Other to force the browser to reload using GET
          return Response.redirect('/dashboard', 303);
        } catch (err) {
          console.error('SW v8 Interception Failed:', err);
          return Response.redirect('/dashboard?error=share_failed', 303);
        }
      })()
    );
  }
});

// IndexedDB helper for shared data (v2 Sync)
async function saveSharedData(data) {
  return new Promise((resolve, reject) => {
    const DB_NAME = 'imagesnap-pwa-db';
    const DB_VERSION = 2;
    const STORE_NAME = 'shares';

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Schema Version Router: Cleanup legacy structures
      if (db.objectStoreNames.contains('sharedContent')) db.deleteObjectStore('sharedContent');
      if (db.objectStoreNames.contains('share-target')) db.deleteObjectStore('share-target');
      if (db.objectStoreNames.contains('latest')) db.deleteObjectStore('latest');
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      store.put(data, 'latest');
      
      transaction.oncomplete = () => {
        const channel = new BroadcastChannel('imagesnap-share-target');
        channel.postMessage({ type: 'NEW_SHARE_DATA' });
        channel.close();
        db.close();
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    };

    request.onerror = () => reject(request.error);
  });
}
