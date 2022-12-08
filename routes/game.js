const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  createGame,
  updateGameStatus,
  updateUserScore,
} = require('../controllers/game/gameController');
router
  .route('/creategame')
  .post(passport.authenticate('jwt', { session: false }), createGame);
router
  .route('/updateStatus')
  .put(passport.authenticate('jwt', { session: false }), updateGameStatus);

router.route('/answer/:pin').put(updateUserScore);

module.exports = router;
