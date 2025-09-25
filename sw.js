// Service Worker for Pushcut Notifications

self.addEventListener('install', event => {
  console.log('[Service Worker] Installed');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activated');
});

// Listen for Push Events
self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || 'Pushcut Notification';
  const options = {
    body: data.body || 'You have a new notification!',
    icon: data.icon || '/images/icon-192.png',
    badge: data.badge || '/images/icon-192.png',
    data: data.url || '/'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle Notification Click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const clickResponsePromise = clients.openWindow(event.notification.data);
  event.waitUntil(clickResponsePromise);
});
