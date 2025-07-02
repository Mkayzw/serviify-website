// Font caching service worker
const CACHE_NAME = 'serviify-fonts-v1';
const FONT_CACHE_NAME = 'serviify-fonts-cache-v1';

// Only cache the optimized variable font
const FONT_FILES = [
  '/src/assets/fonts/Caveat-VariableFont_wght.ttf'
];

// Install event - cache font files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(FONT_CACHE_NAME).then((cache) => {
      console.log('Caching font files');
      return cache.addAll(FONT_FILES.map(url => new Request(url, {
        mode: 'cors',
        credentials: 'omit'
      })));
    }).catch((error) => {
      console.log('Font caching failed:', error);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== FONT_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve fonts from cache with fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle font requests
  if (event.request.destination === 'font' || 
      url.pathname.includes('/fonts/') || 
      url.pathname.endsWith('.ttf') || 
      url.pathname.endsWith('.woff') || 
      url.pathname.endsWith('.woff2')) {
    
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        
        // If not in cache, fetch with network timeout
        return Promise.race([
          fetch(event.request.clone()).then((response) => {
            // Cache successful responses
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(FONT_CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          }),
          // Timeout after 3 seconds for poor connections
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Font fetch timeout')), 3000);
          })
        ]).catch(() => {
          // Return a minimal response if font fails to load
          return new Response('', {
            status: 200,
            statusText: 'OK',
            headers: {
              'Content-Type': 'font/ttf'
            }
          });
        });
      })
    );
  }
});
