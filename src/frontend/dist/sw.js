// Zaren Veto Service Worker — PWA offline support
const CACHE_VERSION = 'v1';
const CACHE_NAME = `zaren-veto-${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `zaren-veto-static-${CACHE_VERSION}`;

// App shell assets to cache on install
const APP_SHELL = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/favicon.ico',
];

// Install — cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL).catch(() => {
        // Non-fatal — some assets may not exist yet
        return Promise.resolve();
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate — purge old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== STATIC_CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache-first for static, network-first for API calls
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin requests
  if (event.request.method !== 'GET') return;

  // Network-first for canister API calls (icp0.io, ic0.app, raw.icp0.io)
  const isApiCall =
    url.hostname.includes('icp0.io') ||
    url.hostname.includes('ic0.app') ||
    url.pathname.startsWith('/api/');

  if (isApiCall) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || Response.error()))
    );
    return;
  }

  // Cache-first for static assets (JS, CSS, images, fonts)
  const isStatic =
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff2?|ttf|ico)$/);

  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Network-first with cache fallback for HTML navigation
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // SPA fallback — serve index from cache
          return caches.match('/') || Response.error();
        })
      )
  );
});
