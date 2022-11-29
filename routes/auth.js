const express = require('express');
const router = express.Router();

const { verify, signUp } = require('../controllers/auth/authController');

router.route('/signup').post(signUp);

router.route('/confirm/:token').get(verify);
module.exports = router;
