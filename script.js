navigator.serviceWorker.ready.then(async reg => {
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: "YOUR_PUBLIC_VAPID_KEY"
  });

  // Send subscription object to backend
  await fetch("/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription)
  });
});
