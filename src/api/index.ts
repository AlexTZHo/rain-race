import express from 'express';
import locationController from '../api/controllers/location';
import usersController from '../api/controllers/users';

// STOPSHIP: Add authcontroller for registering and logging in

/**
 * Express router for api calls in app.
 * Currently handles location and user data.
 */
const router = express.Router();

router
    .route('/location')
    .get(locationController.fetchLocation);
router
    .route('/join')
    .post(usersController.joinRace);
router
    .route('/leave')
    .post(usersController.leaveRace);
router
    .route('/leaderboard')
    .get(usersController.getLeaderboard)

export default router;