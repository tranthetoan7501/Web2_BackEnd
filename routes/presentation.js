const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  createPresentation,
  getPresentationById,
  getPresentationByUserId,
  updatePresentation,
  deletePresentation,
  getMyPresentations,
  getMyPresentationById,
  getPresentationByroomId,
  addCollaborator,
  removeCollaborator,
  getCollabPresentation,
} = require('../controllers/presentation/presentController');

router
  .route('/myPresentation')
  .get(passport.authenticate('jwt', { session: false }), getMyPresentations);

router
  .route('/myCollabPresentation')
  .get(passport.authenticate('jwt', { session: false }), getCollabPresentation);

router
  .route('/myPresentation/:id')
  .get(passport.authenticate('jwt', { session: false }), getMyPresentationById);

router
  .route('/create')
  .post(passport.authenticate('jwt', { session: false }), createPresentation);

router
  .route('/ofuser/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    getPresentationByUserId
  );
router
  .route('/addcollaborator')
  .put(passport.authenticate('jwt', { session: false }), addCollaborator);
router
  .route('/removecollaborator')
  .put(passport.authenticate('jwt', { session: false }), removeCollaborator);

router.route('/join/:name/:roomId').put(getPresentationByroomId);
router
  .route('/:id')
  .get(getPresentationById)
  .put(passport.authenticate('jwt', { session: false }), updatePresentation)
  .delete(passport.authenticate('jwt', { session: false }), deletePresentation);

module.exports = router;
