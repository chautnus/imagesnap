// ImageSnap Service Worker
const CACHE_NAME = 'imagesnap-v6';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Handle Web Share Target
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isDashboardPath = url.pathname === '/dashboard' || url.pathname === '/dashboard/';

  if (event.request.method === 'POST' && isDashboardPath) {
    event.respondWith(
      (async () => {
        const formData = await event.request.formData();
        const imageFile = formData.get('images');
        const title = formData.get('title') || '';
        const text = formData.get('text') || '';
        const link = formData.get('url') || '';

        // Store shared data in IndexedDB and notify when done
        if (imageFile) {
          await saveSharedData({ 
            image: imageFile, 
            title, 
            text, 
            url: link,
            timestamp: Date.now() 
          });
        }

        return Response.redirect('/dashboard', 303);
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
