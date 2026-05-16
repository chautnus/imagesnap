// ImageSnap Service Worker v8.9 - (v1.10.17)
const CACHE_NAME = 'imagesnap-v1.10.17';

// Assets to precache
const PRECACHE_ASSETS = [
  '/dashboard',
  '/manifest.json',
  '/icons/icon-192x192.png'
];

self.addEventListener('install', (event) => {
  // We no longer call skipWaiting() immediately to allow cleaner transitions if needed,
  // but for PWA stability we often do. Let's keep it but ensure versioning is strict.
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
          const cursor = (e.target as any).result;
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

// Handle Web Share Target
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

          await new Promise(resolve => setTimeout(resolve, 500));
          return Response.redirect(`/dashboard?share_id=${sid}`, 303);
        } catch (err) {
          console.error('SW Interception Failed:', err);
          return Response.redirect('/dashboard?error=share_failed', 303);
        }
      })()
    );
    return;
  }

  // Runtime Caching
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
      const db = (event.target as any).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };

    request.onsuccess = (event) => {
      const db = (event.target as any).result;
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
