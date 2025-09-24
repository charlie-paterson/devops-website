// Register service worker and subscribe to push
navigator.serviceWorker.register("/sw.js").then(async reg => {
  console.log("Service Worker registered");

  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: "BD6ILoSkWkLMLws6l5xPENH1i4HvgZO_pk-NWjt8Nwkmlt28-42WdCE66c5yIeN5n21xxhTJklZQTUBWn_asJqk" // base64 encoded
  });

  // Send subscription to backend
  await fetch("/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription)
  });

  console.log("Subscribed to push!");
});

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}
