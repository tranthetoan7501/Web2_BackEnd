const express = require('express');

const router = express.Router();
const { getUsers, signUp, logIn } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

router.route('/').get(protect, getUsers);

router.route('/signup').post(signUp);

router.route('/login').post(logIn);

module.exports = router;
