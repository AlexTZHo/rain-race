import express from "express";
import usersController from "./controller/users";

// STOPSHIP: Add authcontroller for registering and logging in
// Use JWT for auth checks

/**
 * Express router for api calls in app.
 * Currently handles location and user data.
 */
const router = express.Router();

router.route("/update-location").post(usersController.updateLocation);
router.route("/join").post(usersController.joinRace);
router.route("/heartbeat").post(usersController.heartbeat);
router.route("/offline").post(usersController.markOffline);
router.route("/leave").post(usersController.leaveRace);
router.route("/leaderboard").get(usersController.getLeaderboard);
router.route("/updates").get(usersController.subscribeUpdates);

export default router;
