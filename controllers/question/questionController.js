const Question = require('../../models/question');
const Game = require('../../models/game');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');
const { successResponse } = require('../../utils/response');
const QuesService = require('./questionService');

exports.createQuestion = asyncHandler(async (req, res, next) => {
  //body: roomId, username, content
  const ques = await QuesService.createQuestion(req);
  successResponse(ques, res);
});

exports.getQuestion = asyncHandler(async (req, res, next) => {
  //body: roomId
  const ques = await Question.find({ roomId: req.params.roomId });
  successResponse(ques, res);
});

exports.vote = asyncHandler(async (req, res, next) => {
  //body : id, voter
  const ques = await Question.findById(req.body.id);
  if (!ques.voters.includes(req.body.voter)) {
    ques.voters.push(req.body.voter);
    await ques.save();
    successResponse('vote success', res);
  } else {
    ques.voters = ques.voters.filter((e) => e != req.body.voter);
    await ques.save();
    successResponse('unvote success', res);
  }
});

exports.answer = asyncHandler(async (req, res, next) => {
  //body : id, username, answer
  const ques = await Question.findById(req.body.id);
  if (ques) {
    ques.answers.push({ username: req.body.username, answer: req.body.answer });
    await ques.save();
    successResponse(ques, res);
  } else {
    return next(new ErrorResponse('can not find question with id', 500));
  }
});

exports.markQuestion = asyncHandler(async (req, res, next) => {
  //body : id, username, answer
  const ques = await Question.findById(req.params.id);
  if (ques) {
    ques.isAnswered = !ques.isAnswered;
    await ques.save();
    if (ques.isAnswer) {
      successResponse('mark success', res);
    } else {
      successResponse('unmark success', res);
    }
  } else {
    return next(new ErrorResponse('can not find question with id', 500));
  }
});
