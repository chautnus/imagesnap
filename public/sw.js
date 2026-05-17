// ImageSnap Service Worker v9.0 - Diagnostic Edition (v1.10.18)
const CACHE_NAME = 'imagesnap-v1.10.18';

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
          const cursor = (e.target).result;
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
        const sid = Date.now().toString();
        let errorLog = '';
        
        try {
          // STEP 1: Parse FormData
          let formData;
          try {
            formData = await event.request.formData();
          } catch (fdErr) {
            throw new Error(`FormData parse failed: ${fdErr.message}`);
          }
          
          let imageFiles = formData.getAll('images');
          const title = formData.get('title') || '';
          const text = formData.get('text') || '';
          const link = formData.get('url') || '';

          if (imageFiles.length > 0 || title || text || link) {
            
            // STEP 2: Prevent DataCloneError by converting File -> ArrayBuffer -> Blob
            let cleanImages = [];
            try {
              cleanImages = await Promise.all(imageFiles.map(async (file) => {
                if (file instanceof File || file instanceof Blob) {
                  const buffer = await file.arrayBuffer();
                  return new Blob([buffer], { type: file.type || 'image/jpeg' });
                }
                return file; // If it's somehow a string
              }));
            } catch (cloneErr) {
              throw new Error(`Buffer conversion failed: ${cloneErr.message}`);
            }

            // STEP 3: Save to IndexedDB
            try {
              await saveSharedData(sid, { 
                images: cleanImages, 
                title, 
                text, 
                url: link,
                timestamp: parseInt(sid)
              });
            } catch (dbErr) {
              throw new Error(`IDB Save failed: ${dbErr.message || dbErr}`);
            }
          } else {
            throw new Error(`No data found in Share payload`);
          }

          // SUCCESS
          await new Promise(resolve => setTimeout(resolve, 500));
          return Response.redirect(`/dashboard?share_id=${sid}`, 303);

        } catch (err) {
          console.error('[SW FATAL] Share Target Interception Failed:', err);
          errorLog = err.message || err.toString();
          
          // FAIL: Fallback to URL passing
          return Response.redirect(`/dashboard?sw_fatal_error=${encodeURIComponent(errorLog)}`, 303);
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
      const db = (event.target).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };

    request.onsuccess = (event) => {
      const db = (event.target).result;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const putReq = store.put(data, sid);
      
      putReq.onsuccess = () => {
        // Explicitly wait for transaction complete to guarantee persistence
      };
      putReq.onerror = (e) => {
        reject(e.target.error);
      };
      
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
