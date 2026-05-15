// ImageSnap Service Worker v8.6 - Single-Signal (v1.8.7)
const CACHE_NAME = 'imagesnap-v8.6';

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
          const allEntries = Array.from(formData.entries());
          const sid = Date.now().toString();
          
          let imageFiles = formData.getAll('images');
          let imageFile = imageFiles.length > 0 ? imageFiles[0] : null;
          const title = formData.get('title') || '';
          const text = formData.get('text') || '';
          const link = formData.get('url') || '';

          // Deterministic File Discovery (Robust Fallback without instanceof File)
          if (!imageFile) {
            for (const [key, value] of allEntries) {
              if (value instanceof Blob || (value && typeof value === 'object' && typeof value.name === 'string')) {
                imageFile = value;
                break;
              }
            }
          }

          // 20MB Safety Check
          if (imageFile && imageFile.size > 20 * 1024 * 1024) {
             return Response.redirect('/dashboard?error=file_too_large', 303);
          }

          // Atomic write to IndexedDB with sid as Primary Key
          if (imageFile || title || text || link) {
            await saveSharedData(sid, { 
              image: imageFile, 
              images: imageFiles, // save all if multiple
              title, 
              text, 
              url: link,
              timestamp: parseInt(sid)
            });
            
            // Broadcast the successful commit to any active clients
            try {
              const channel = new BroadcastChannel('imagesnap-share');
              channel.postMessage({ type: 'SHARE_COMMITTED', share_id: sid });
              channel.close();
            } catch (err) {
              console.error('SW Broadcast Failed:', err);
            }
          }

          // Single Deterministic Signal: 303 Redirect with sid (Fallback/Trigger)
          return Response.redirect(`/dashboard?share_id=${sid}`, 303);
        } catch (err) {
          console.error('SW Interception Failed:', err);
          return Response.redirect('/dashboard?error=share_failed', 303);
        }
      })()
    );
  }
});

// IndexedDB helper for shared data (v2 sid Architecture)
async function saveSharedData(sid, data) {
  return new Promise((resolve, reject) => {
    const DB_NAME = 'imagesnap-pwa-db';
    const DB_VERSION = 2;
    const STORE_NAME = 'shares';

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      db.onversionchange = () => db.close();

      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      store.put(data, sid);
      
      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    };

    request.onerror = () => reject(request.error);
  });
}
