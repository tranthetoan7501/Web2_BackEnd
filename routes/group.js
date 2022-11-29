const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  getGroups,
  createGroup,
  generateLinkJoinGroup,
  joinGroup,
} = require('../controllers/groupController');

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), getGroups)
  .post(passport.authenticate('jwt', { session: false }), createGroup);
router
  .route('/invitelink')
  .post(
    passport.authenticate('jwt', { session: false }),
    generateLinkJoinGroup
  );

router
  .route('/join/:token')
  .get(passport.authenticate('jwt', { session: false }), joinGroup);
module.exports = router;
