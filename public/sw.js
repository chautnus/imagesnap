// ImageSnap Service Worker v8.7 - Ironclad Reliability (v1.10.3)
const CACHE_NAME = 'imagesnap-v1.10.3';

// Assets to precache
const PRECACHE_ASSETS = [
  '/dashboard',
  '/manifest.json',
  '/icons/icon-192x192.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
      await clients.claim();
      // Prune old shares (24h)
      await pruneOldShares();
    })()
  );
});

async function pruneOldShares() {
  const DB_NAME = 'imagesnap-pwa-db';
  const STORE_NAME = 'shares';
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;

  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, 2);
    request.onsuccess = (event) => {
      const db = event.target.result;
      try {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const cursorReq = store.openCursor();
        cursorReq.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            const timestamp = cursor.value.timestamp || 0;
            if (timestamp < cutoff) store.delete(cursor.key);
            cursor.continue();
          }
        };
        transaction.oncomplete = () => {
          db.close();
          resolve(true);
        };
      } catch (e) {
        db.close();
        resolve(false);
      }
    };
    request.onerror = () => resolve(false);
  });
}

// Handle Web Share Target with Absolute Interception (POST -> 303 -> GET)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isShareTargetPath = url.pathname === '/share-target' || url.pathname === '/share-target/';
  
  if (event.request.method === 'POST' && isShareTargetPath) {
    event.respondWith(
      (async () => {
        try {
          const formData = await event.request.formData();
          const sid = Date.now().toString();
          
          let imageFiles = formData.getAll('images');
          const title = formData.get('title') || '';
          const text = formData.get('text') || '';
          const link = formData.get('url') || '';

          if (imageFiles.length > 0 || title || text || link) {
            await saveSharedData(sid, { 
              images: imageFiles, 
              title, 
              text, 
              url: link,
              timestamp: parseInt(sid)
            });
          }

          const logMsg = `[SW] Share Intercepted for ${sid}`;
          if (typeof (self as any)._pushDebug === 'function') (self as any)._pushDebug(logMsg);
          
          // Broadcast to active pages
          try {
            const bc = new BroadcastChannel('imagesnap-logs');
            bc.postMessage({ type: 'LOG', msg: logMsg });
            bc.close();
          } catch (e) {}

          return Response.redirect(`/dashboard?share_id=${sid}`, 303);
        } catch (err) {
          console.error('SW Interception Failed:', err);
          try {
            const bc = new BroadcastChannel('imagesnap-logs');
            bc.postMessage({ type: 'LOG', msg: `[SW] FAILED: ${err.message}` });
            bc.close();
          } catch (e) {}
          return Response.redirect('/dashboard?error=share_failed', 303);
        }
      })()
    );
    return;
  }

  // Runtime Caching for static assets
  if (event.request.method === 'GET' && 
     (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.includes('/fonts/'))) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(response => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        });
      })
    );
  }
});

async function saveSharedData(sid, data) {
  return new Promise((resolve, reject) => {
    const DB_NAME = 'imagesnap-pwa-db';
    const STORE_NAME = 'shares';
    const request = indexedDB.open(DB_NAME, 2);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(data, sid);
      transaction.oncomplete = () => {
        db.close();
        resolve(true);
      };
      transaction.onerror = () => {
        db.close();
        reject(transaction.error);
      };
    };
    request.onerror = () => reject(request.error);
  });
}
