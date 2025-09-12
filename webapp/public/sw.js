// Service Worker for ChemiSSUe PWA

const CACHE_NAME = 'chemissue-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/about',
  '/auth/login',
  '/auth/register',
  '/board/notices',
  '/board/photos',
  '/board/schedule',
  '/board/meetings',
  '/board/board',
  '/board/suggestions',
  '/board/promotion', 
  '/board/letters',
  '/board/resources',
  '/static/style.css',
  '/static/app.js',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Cache installation failed:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and external APIs
  if (request.method !== 'GET' || 
      url.pathname.startsWith('/api/') ||
      url.hostname !== self.location.hostname) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', request.url);
          return cachedResponse;
        }

        console.log('[SW] Fetching from network:', request.url);
        return fetch(request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response for caching
            const responseClone = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(request, responseClone);
              });

            return response;
          })
          .catch(error => {
            console.error('[SW] Fetch failed:', error);
            
            // Return offline fallback for navigation requests
            if (request.destination === 'document') {
              return caches.match('/');
            }
            
            throw error;
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync offline actions when network is available
      syncOfflineActions()
    );
  }
});

// Push notification handler
self.addEventListener('push', event => {
  console.log('[SW] Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'ChemiSSUe에서 새 소식이 있습니다!',
    icon: 'https://page.gensparksite.com/v1/base64_upload/3112448ea471353bb7c3b074a1213546',
    badge: 'https://page.gensparksite.com/v1/base64_upload/3112448ea471353bb7c3b074a1213546',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '확인하기',
        icon: '/static/icons/checkmark.png'
      },
      {
        action: 'close', 
        title: '닫기',
        icon: '/static/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('ChemiSSUe', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification click:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    console.log('[SW] Notification dismissed');
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sync offline actions
async function syncOfflineActions() {
  try {
    console.log('[SW] Syncing offline actions...');
    
    // Get pending actions from IndexedDB (if implemented)
    // This would sync things like offline posts, comments, etc.
    
    console.log('[SW] Offline sync completed');
  } catch (error) {
    console.error('[SW] Offline sync failed:', error);
  }
}

// Message handler for communication with main thread
self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});