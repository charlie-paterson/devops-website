self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  const title = data.title || 'Notification';
  const options = {
    body: data.body || '',
    icon: '/images/icon-192.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
