const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  createPresentation,
  getPresentationById,
  getPresentationByUserId,
  updatePresentation,
  deletePresentation,
  getMyPresentation,
  getMyPresentationById,
} = require('../controllers/presentation/presentController');

router
  .route('/myPresentation')
  .get(passport.authenticate('jwt', { session: false }), getMyPresentation);

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
  .route('/:id')
  .get(getPresentationById)
  .put(passport.authenticate('jwt', { session: false }), updatePresentation)
  .delete(passport.authenticate('jwt', { session: false }), deletePresentation);

module.exports = router;
