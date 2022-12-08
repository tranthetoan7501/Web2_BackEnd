const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  createGame,
  updateGameStatus,
  updateUserScore,
  getGameResult,
} = require('../controllers/game/gameController');
router
  .route('/creategame')
  .post(passport.authenticate('jwt', { session: false }), createGame);
router
  .route('/updateStatus')
  .put(passport.authenticate('jwt', { session: false }), updateGameStatus);

router.route('/gameresult/:pin').get(getGameResult);

router
  .route('/answer/:pin')
  .put(passport.authenticate('jwt', { session: false }), updateUserScore);

module.exports = router;
