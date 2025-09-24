// Utility to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

// Main function to handle push subscription
async function initPush() {
  try {
    // 1️⃣ Register service worker
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("Service Worker registered");

    // 2️⃣ Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return;
    }

    // 3️⃣ Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BD6ILoSkWkLMLws6l5xPENH1i4HvgZO_pk-NWjt8Nwkmlt28-42WdCE66c5yIeN5n21xxhTJklZQTUBWn_asJqk"
      )
    });

    // 4️⃣ Send subscription to backend
    await fetch("/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription)
    });

    console.log("Subscribed to push notifications!");

    // 5️⃣ Optional: trigger a test notification immediately
    await fetch("/sendNotification", { method: "POST" });
    console.log("Test notification sent!");

  } catch (err) {
    console.error("Push setup failed:", err);
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", initPush);

