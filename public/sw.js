const CACHE_NAME = 'trackhub-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through for standard network requests with fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
