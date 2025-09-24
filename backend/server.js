import express from "express";
import bodyParser from "body-parser";
import webpush from "web-push";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Serve frontend from root directory
const __dirname = path.resolve();
app.use(express.static(__dirname));

// ---- Web Push Setup ----
// Generate your keys once with `npx web-push generate-vapid-keys`
const publicVapidKey = "BD6ILoSkWkLMLws6l5xPENH1i4HvgZO_pk-NWjt8Nwkmlt28-42WdCE66c5yIeN5n21xxhTJklZQTUBWn_asJqk";
const privateVapidKey = "ScpKXw7owpU4_YBfknn2bdTM0o3v6H-3i-DlBV88cak";

webpush.setVapidDetails(
  "mailto:you@example.com",
  publicVapidKey,
  privateVapidKey
);

// ---- Store subscriptions in memory (replace with DB in production) ----
let subscriptions = [];

// 1️⃣ Endpoint for saving subscription
app.post("/subscribe", (req, res) => {
  const subscription = req.body;

  // Avoid duplicate subscriptions
  if (!subscriptions.find(sub => JSON.stringify(sub) === JSON.stringify(subscription))) {
    subscriptions.push(subscription);
  }

  res.status(201).json({ message: "Subscription saved." });
});

// 2️⃣ Endpoint to send a push notification
app.post("/sendNotification", (req, res) => {
  const { title, body } = req.body || {};

  const payload = JSON.stringify({
    title: title || "🏎 Race Update!",
    body: body || "The race starts soon!"
  });

  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.error(err));
  });

  res.json({ success: true, message: "Notification sent to all subscribers." });
});

// Serve index.html for all other routes (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
