const express = require('express');

const router = express.Router();
const {
  getUsers,
  signUp,
  logIn,
  logOut,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.route('/users').get(protect, getUsers);

router.route('/signup').post(signUp);

router.route('/login').post(logIn);

router.route('/logout').get(protect, logOut);

module.exports = router;
