const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  createGame,
  updateGameStatus,
} = require('../controllers/game/gameController');
router
  .route('/creategame')
  .post(passport.authenticate('jwt', { session: false }), createGame);
router
  .route('/updateStatus')
  .put(passport.authenticate('jwt', { session: false }), updateGameStatus);

module.exports = router;
