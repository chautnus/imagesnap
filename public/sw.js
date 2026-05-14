// ImageSnap Service Worker v7 - Payload Bypass Edition
const CACHE_NAME = 'imagesnap-v7';

self.addEventListener('install', (event) => {
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Ensure that updates to underlying service workers take effect immediately.
  event.waitUntil(clients.claim());
});

// Handle Web Share Target with Intercept-and-Redirect pattern (POST -> 303 -> GET)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isSharePath = url.pathname === '/api/share-target';

  if (event.request.method === 'POST' && isSharePath) {
    event.respondWith(
      (async () => {
        try {
          const formData = await event.request.formData();
          const imageFile = formData.get('images');
          const title = formData.get('title') || '';
          const text = formData.get('text') || '';
          const link = formData.get('url') || '';

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
          console.error('SW Share Interception Failed:', err);
          return Response.redirect('/dashboard?error=share_failed', 303);
        }
      })()
    );
  }
});

// IndexedDB helper for shared data
async function saveSharedData(data) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ImageSnapSharing', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('sharedContent')) {
        db.createObjectStore('sharedContent', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('sharedContent', 'readwrite');
      const store = transaction.objectStore('sharedContent');
      
      // Clear old shared content first to keep it simple (one shared item at a time)
      store.clear();
      store.add({ ...data, id: 'latest' });
      
      transaction.oncomplete = () => {
        // Only broadcast once transaction is fully committed to disk
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
