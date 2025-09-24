import express from "express";
import bodyParser from "body-parser";
import webpush from "web-push";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files from root directory
const __dirname = path.resolve();
app.use(express.static(__dirname));

// Web Push setup
const publicVapidKey = "YOUR_PUBLIC_KEY";
const privateVapidKey = "YOUR_PRIVATE_KEY";
webpush.setVapidDetails("mailto:you@example.com", publicVapidKey, privateVapidKey);

// Store subscriptions (in memory for now)
let subscriptions = [];

// Subscribe endpoint
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

// Send notification endpoint
app.post("/sendNotification", (req, res) => {
  const payload = JSON.stringify({
    title: "🏎 Race Update!",
    body: "The race starts soon!"
  });

  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.error(err));
  });

  res.json({ success: true });
});

// Serve index.html for all other routes (for SPAs)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

