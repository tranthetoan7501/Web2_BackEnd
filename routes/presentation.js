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
} = require('../controllers/presentation/presentController');

router
  .route('/myPresentation')
  .get(passport.authenticate('jwt', { session: false }), getMyPresentation);
router
  .route('/ofuser/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    getPresentationByUserId
  );

router
  .route('/create')
  .post(passport.authenticate('jwt', { session: false }), createPresentation);

router
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), getPresentationById)
  .put(passport.authenticate('jwt', { session: false }), updatePresentation)
  .delete(passport.authenticate('jwt', { session: false }), deletePresentation);

module.exports = router;
