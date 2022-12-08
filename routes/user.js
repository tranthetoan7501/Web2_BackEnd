const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();
const {
  getUsers,
  getUserById,
  getProfile,
} = require('../controllers/user/userController');
const { logIn } = require('../controllers/auth/authController');

router
  .route('/users')
  .get(passport.authenticate('jwt', { session: false }), getUsers);
router
  .route('/profile')
  .get(passport.authenticate('jwt', { session: false }), getProfile);
router
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), getUserById);

// Google auth
router.get('/login/success', async (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: 'Successfully Loged In',
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: 'Not Authorized' });
  }
});

router.get('/login/failed', (req, res) => {
  res.status(401).json({
    error: true,
    message: 'Log in failure',
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
router.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_BASE_URL);
});

module.exports = router;
