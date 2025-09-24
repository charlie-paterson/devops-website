// Register service worker and subscribe to push
navigator.serviceWorker.register("/sw.js").then(async reg => {
  console.log("Service Worker registered");

  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: "YOUR_PUBLIC_VAPID_KEY" // base64 encoded
  });

  // Send subscription to backend
  await fetch("/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription)
  });

  console.log("Subscribed to push!");
});
