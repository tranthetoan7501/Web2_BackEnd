const express = require('express');
const router = express.Router();
const {
  createQuestion,
  vote,
  answer,
  markQuestion,
  getQuestion,
} = require('../controllers/question/questionController');
router.route('/createQuestion').post(createQuestion);
router.route('/vote').put(vote);
router.route('/answer').put(answer);
router.route('/getQuestion/:roomId').get(getQuestion);
router.route('/:id').put(markQuestion);

module.exports = router;
