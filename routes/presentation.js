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
  getPresentationByPin,
} = require('../controllers/presentation/presentController');

router
  .route('/myPresentation')
  .get(passport.authenticate('jwt', { session: false }), getMyPresentations);

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

router.route('/getbypin/:pin').get(getPresentationByPin);
router
  .route('/:id')
  .get(getPresentationById)
  .put(passport.authenticate('jwt', { session: false }), updatePresentation)
  .delete(passport.authenticate('jwt', { session: false }), deletePresentation);

module.exports = router;
