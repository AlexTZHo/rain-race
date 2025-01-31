import express from "express";
import path from "path";
import apiRouter from "./api/index";
import { updateWeather } from "./api/controller/users";
import { users, clients } from "./api/controller/users";
import { broadcastUpdates } from "./api/controller/helpers/updates";

const app = express();

const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.json());

// Use API routes
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Set interval to update weather and add rainfall to player score
// STOPSHIP: Calling API every minute for each user may run into rate limit issues
setInterval(() => {
  users.forEach((user) => {
    if (user.isOnline) {
      updateWeather(user);
    }
  });
}, 60000);

// Cleanup interval for players that have not been active
// STOPSHIP: Somewhat unreliable but better than beforeunload
// Consider using Colyseus next time to handle disconnections more reliably
setInterval(() => {
  const now = new Date();
  users.forEach((user) => {
    const secondsSinceLastActive =
      (now.getTime() - user.lastActive.getTime()) / 1000;
    if (user.isOnline && secondsSinceLastActive > 30) {
      user.isOnline = false;
      console.log(`Marked ${user.name} offline due to inactivity`);
    }
  });
  broadcastUpdates();
}, 10_000); // Check every 10 seconds
