const express = require('express');

const router = express.Router();
const { 
    getUsers,
    signUp,
    logIn
} = require('../controllers/userController');

router.route('/')
    .get(getUsers);

router.route('/signup')
    .post(signUp);

router.route('/login')
    .post(logIn);
    
module.exports = router;
