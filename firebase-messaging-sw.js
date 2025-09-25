importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyBhc7dAgsepoTZMhHK03VDC2rYK4VOGvtY",
  authDomain: "f1-hub-32f3f.firebaseapp.com",
  projectId: "f1-hub-32f3f",
  storageBucket: "f1-hub-32f3f.firebasestorage.app",
  messagingSenderId: "386786917585",
  appId: "1:386786917585:web:6a4da76552d4bcacaf59f0",
  measurementId: "G-N20CZ0XQZ9"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/images/icon-180.png"
  });
});
