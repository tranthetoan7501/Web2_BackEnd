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
