const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  getGroups,
  getMyGroups,
  createGroup,
  generateLinkJoinGroup,
  joinGroup,
  generateLinkEmail,
  joinByMailLink,
  assignCoOwner,
  getGroupById,
  getMyJoinedGroups,
  unAssignCoOwner,
} = require('../controllers/group/groupController');

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), getGroups)
  .post(passport.authenticate('jwt', { session: false }), createGroup);

router
  .route('/mygroups')
  .get(passport.authenticate('jwt', { session: false }), getMyGroups);
router
  .route('/myjoinedgroups')
  .get(passport.authenticate('jwt', { session: false }), getMyJoinedGroups);

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
  .put(passport.authenticate('jwt', { session: false }), assignCoOwner);

router
  .route('/unassigncoowner')
  .put(passport.authenticate('jwt', { session: false }), unAssignCoOwner);

router
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), getGroupById);

router.route('/mailjoin/:token').get(joinByMailLink);
module.exports = router;
