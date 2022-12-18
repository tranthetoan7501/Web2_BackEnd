const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

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
  .post(passport.authenticate('jwt', { session: false }), logOut)
  .get(passport.authenticate('jwt', { session: false }), logOut);

// // Google auth
// router.get('/login/success', async (req, res) => {
//   console.log('successs');
//   if (req.user) {
//     res.status(200).json({
//       error: false,
//       message: 'Successfully Loged In',
//       user: req.user,
//     });
//   } else {
//     res.status(403).json({ error: true, message: 'Not Authorized' });
//   }
// });

// router.get('/login/failed', (req, res) => {
//   res.status(401).json({
//     error: true,
//     message: 'Log in failure',
//   });
// });

// router.get('/google', passport.authenticate('google', ['profile', 'email']));

// //đăng nhập thành công thì chuyển hướng vè trang này
// router.get(
//   '/google/callback',
//   passport.authenticate('google', {
//     successRedirect: 'http://localhost:3000',
//     failureRedirect: '/login/failed',
//   })
// );

// //đăng xuất thì chuyển hướng đến trang này
// router.get('/auth/logout', (req, res) => {
//   req.logout();
//   res.redirect('http://localhost:3000');
// });

module.exports = router;
