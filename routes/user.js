const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();
const {
  getUsers,
  getUserById,
  getProfile,
  getUserGoogleAccount,
} = require('../controllers/user/userController');
const { logIn } = require('../controllers/auth/authController');

router
  .route('/users')
  .get(passport.authenticate('jwt', { session: false }), getUsers);
router
  .route('/profile')
  .get(passport.authenticate('jwt', { session: false }), getProfile);

// Google auth
router.get('/login/success', getUserGoogleAccount);

router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    data: 'Log in failure',
  });
});

router.get('/google', passport.authenticate('google', ['profile', 'email']));

//đăng nhập thành công thì chuyển hướng vè trang này
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.CLIENT_BASE_URL,
    failureRedirect: '/login/failed',
  })
);

//đăng xuất thì chuyển hướng đến trang này
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_BASE_URL);
});

router
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), getUserById);

module.exports = router;
