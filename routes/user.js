const express = require('express');
const passport = require('passport');

const router = express.Router();
const { getUsers, logIn, logOut } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router
  .route('/users')
  .get(passport.authenticate('jwt', { session: false }), getUsers);

router
  .route('/login')
  .post(passport.authenticate('local', { session: false }), logIn);

router
  .route('/logout')
  .get(passport.authenticate('jwt', { session: false }), logOut);

// Google auth
router.get('/login/success', (req, res) => {
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

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']})
// function(req, res) {
//   console.log("\n\nres: ", JSON.stringify(res))
//   res.status(200).json({
//     error: false,
//     message: 'Successfully Loged In google',
//     user: req.user,
//   });
);

// router.get('/auth/google/callback', passport.authenticate('google', {
//     // successRedirect: process.env.GOOGLE_CLIENT_URL,
//     failureRedirect: '/login/failed',
//   }), (req, res) => {
//     // const token = generateJwtToken(req.user);
//     // res.cookie('jwt', token);
//     // res.redirect('/');
//     console.log("\n\nres callback: ", res)
//     console.log("\n\nreq callback: ", req)
//     res.status(200).json({
//       error: false,
//       message: 'Successfully Loged In Callback',
//       user: req.user,
//     });
//   }
// );

router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login/failed',}), logIn);

// router.get('/googlelogout', (req, res) => {
//   req.logout();
//   res.redirect(process.env.GOOGLE_CLIENT_URL);
// });

module.exports = router;
