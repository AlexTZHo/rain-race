import express from 'express';
import locationController from '../api/controllers/location';
import usersController from '../api/controllers/users';


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

module.exports = router;