const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  verify,
  signUp,
  logIn,
  logOut,
} = require('../controllers/auth/authController');

router.route('/signup').post(signUp);

router.route('/confirm/:token').get(verify);

router
  .route('/login')
  .post(passport.authenticate('local', { session: false }), logIn);

router
  .route('/logout')
  .post(passport.authenticate('jwt', { session: false }), logOut);

module.exports = router;
