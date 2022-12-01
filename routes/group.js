const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  getGroups,
  createGroup,
  generateLinkJoinGroup,
  joinGroup,
  generateLinkEmail,
  joinByMailLink,
  assignCoOwner,
  getGroupById,
} = require('../controllers/group/groupController');

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
  .route('/invitemail')
  .post(passport.authenticate('jwt', { session: false }), generateLinkEmail);

router
  .route('/join/:token')
  .get(passport.authenticate('jwt', { session: false }), joinGroup);

router
  .route('/assigncoowner')
  .post(passport.authenticate('jwt', { session: false }), assignCoOwner);

router
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), getGroupById);

router.route('/mailjoin/:token').get(joinByMailLink);
module.exports = router;
