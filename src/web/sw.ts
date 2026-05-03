import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Handle the Share Target POST request
registerRoute(
  '/share',
  async ({ request }) => {
    try {
      const formData = await request.formData();
      const title = formData.get('title') || '';
      const text = formData.get('text') || '';
      const url = formData.get('url') || '';
      const images = formData.getAll('images');

      const cache = await caches.open('shared-data');
      
      // Store metadata
      await cache.put(
        new Request('/shared-metadata'),
        new Response(JSON.stringify({ 
          title, 
          text, 
          url, 
          imageCount: images.length,
          timestamp: Date.now()
        }), {
          headers: { 'Content-Type': 'application/json' }
        })
      );

      // Store images
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        if (image instanceof File) {
          await cache.put(
            new Request(`/shared-image-${i}`),
            new Response(image, {
              headers: { 'Content-Type': image.type }
            })
          );
        }
      }

      // Redirect to the main app with a flag
      return Response.redirect('/?share-target=true', 303);
    } catch (error) {
      console.error('Error handling share target:', error);
      return Response.redirect('/?share-error=true', 303);
    }
  },
  'POST'
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
