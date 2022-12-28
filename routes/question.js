const express = require('express');
const router = express.Router();
const {
  createQuestion,
} = require('../controllers/question/questionController');
router.route('/createQuestion').post(createQuestion);
module.exports = router;
