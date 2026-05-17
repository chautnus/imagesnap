// ImageSnap Service Worker v9.2 - Standalone Tracing (v1.10.21)
importScripts('/sw-logger.js');
const CACHE_NAME = 'imagesnap-v1.10.21';

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
        self.swLog.start();
        self.swLog.step(`INTERCEPT_START:${sid}`);
        
        try {
          // STEP 1: Parse FormData
          self.swLog.step("PARSE_FORM_DATA_START");
          let formData;
          try {
            formData = await event.request.formData();
            self.swLog.step("PARSE_FORM_DATA_SUCCESS");
          } catch (fdErr) {
            self.swLog.error(`FormData parse failed: ${fdErr.message}`);
            throw new Error(`FormData parse failed: ${fdErr.message}`);
          }
          
          let imageFiles = formData.getAll('images');
          const title = formData.get('title') || '';
          const text = formData.get('text') || '';
          const link = formData.get('url') || '';
          self.swLog.step(`PAYLOAD: images=${imageFiles.length}, title=${title ? 'yes' : 'no'}, text=${text ? 'yes' : 'no'}, url=${link ? 'yes' : 'no'}`);

          if (imageFiles.length > 0 || title || text || link) {
            
            // STEP 2: Prevent DataCloneError by converting File -> ArrayBuffer -> Blob
            self.swLog.step("CONVERT_IMAGES_TO_BLOBS_START");
            let cleanImages = [];
            try {
              cleanImages = await Promise.all(imageFiles.map(async (file, idx) => {
                if (file instanceof File || file instanceof Blob) {
                  self.swLog.step(`CONVERTING_FILE_${idx}:${file.name || 'unnamed'}:${file.type}:${file.size} bytes`);
                  const buffer = await file.arrayBuffer();
                  return new Blob([buffer], { type: file.type || 'image/jpeg' });
                }
                self.swLog.step(`SKIPPING_CONVERT_FILE_${idx}: not File or Blob instance`);
                return file; // If it's somehow a string
              }));
              self.swLog.step("CONVERT_IMAGES_TO_BLOBS_SUCCESS");
            } catch (cloneErr) {
              self.swLog.error(`Buffer conversion failed: ${cloneErr.message}`);
              throw new Error(`Buffer conversion failed: ${cloneErr.message}`);
            }

            // STEP 3: Save to IndexedDB
            self.swLog.step("IDB_SAVE_START");
            try {
              await saveSharedData(sid, { 
                images: cleanImages, 
                title, 
                text, 
                url: link,
                timestamp: parseInt(sid)
              });
              self.swLog.step("IDB_SAVE_SUCCESS");
            } catch (dbErr) {
              self.swLog.error(`IDB Save failed: ${dbErr.message || dbErr}`);
              throw new Error(`IDB Save failed: ${dbErr.message || dbErr}`);
            }
          } else {
            self.swLog.error("No data found in Share payload");
            throw new Error(`No data found in Share payload`);
          }

          // SUCCESS
          self.swLog.step("INTERCEPT_SUCCESS_REDIRECTING");
          await new Promise(resolve => setTimeout(resolve, 500));
          return Response.redirect(`/dashboard?share_id=${sid}`, 303);

        } catch (err) {
          self.swLog.error(`FATAL:${err.message || err}`);
          const errorLog = err.message || err.toString();
          
          // TẦNG 1: Ghi log sự cố siêu nhẹ vào IDB
          try {
            await self.swLog.writeErrorToIDB(sid, errorLog);
          } catch (writeErr) {
            console.error("IDB error write failed:", writeErr);
          }
          
          // Chuyển hướng sạch kèm cờ báo động lỗi
          return Response.redirect(`/dashboard?share_id=${sid}&sw_fatal_error=true`, 303);
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
