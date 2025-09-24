import express from "express";
import webpush from "web-push";

const app = express();
app.use(express.json());

// Replace with your generated VAPID keys
const vapidKeys = {
  publicKey: "YOUR_PUBLIC_VAPID_KEY",
  privateKey: "YOUR_PRIVATE_VAPID_KEY"
};

webpush.setVapidDetails(
  "mailto:you@example.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let subscriptions = [];

// Save subscription from frontend
app.post("/subscribe", (req, res) => {
  subscriptions.push(req.body);
  res.status(201).send("Subscribed!");
});

// Send notification to all subscribers
app.post("/notify", async (req, res) => {
  const payload = JSON.stringify({
    title: "🏎️ Race Reminder",
    body: req.body.message || "Qualifying starts soon!"
  });

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      console.error("Push failed", err);
    }
  }

  res.send("Notifications sent!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
