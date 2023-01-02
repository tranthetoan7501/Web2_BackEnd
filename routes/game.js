const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  createGame,
  updateGameStatus,
  updateUserScore,
  getGameResult,
  joinByroomId,
  getGameInGroup,
} = require('../controllers/game/gameController');
// router
//   .route('/creategame')
//   .post(passport.authenticate('jwt', { session: false }), createGame);

router
  .route('/creategame')
  .post(passport.authenticate('jwt', { session: false }), createGame);
router
  .route('/updateStatus')
  .put(passport.authenticate('jwt', { session: false }), updateGameStatus);

router.route('/gameresult/:roomId').get(getGameResult);
router.route('/join/:name/:roomId').put(joinByroomId);
router.route('/answer/:roomId').put(updateUserScore);
router.route('/:groupId').get(getGameInGroup);

module.exports = router;
