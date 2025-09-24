// Register service worker
navigator.serviceWorker.register("/sw.js").then(async reg => {
  console.log("Service Worker registered");

  // Ask for notification permission
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.log("Permission not granted for notifications");
    return; // stop here if denied
  }

  // Now subscribe to push
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      "BD6ILoSkWkLMLws6l5xPENH1i4HvgZO_pk-NWjt8Nwkmlt28-42WdCE66c5yIeN5n21xxhTJklZQTUBWn_asJqk"
    )
  });

  // Send subscription to backend
  await fetch("/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription)
  });

  console.log("Subscribed to push!");
});
