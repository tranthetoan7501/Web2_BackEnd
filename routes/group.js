const express = require('express');
const router = express.Router();
const passport = require('passport');

const { getGroups, createGroup } = require('../controllers/groupController');

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), getGroups)
  .post(passport.authenticate('jwt', { session: false }), createGroup);
module.exports = router;
