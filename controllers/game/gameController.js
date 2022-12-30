const Game = require('../../models/game');

const Presentation = require('../../models/presentation');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');
const { successResponse } = require('../../utils/response');
const GameService = require('./gameService');

exports.createGame = asyncHandler(async (req, res, next) => {
  //body : presentationId
  const createdGame = await GameService.createGame(req);
  const presentation = await Presentation.findById(
    createdGame.presentationId
  ).select('-collaborators');
  successResponse(
    { roomId: createdGame.roomId, presentation: presentation },
    res
  );
});

exports.updateGameStatus = asyncHandler(async (req, res, next) => {
  var game = await Game.findOneAndUpdate(
    {
      userCreateId: req.user.id,
      //userCreateId: '63a69aa445975433dddfde8e' /*req.user.id*/,
      roomId: req.body.roomId,
    },
    {
      isOpen: req.body.isOpen,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (game) {
    successResponse({ success: true, data: game }, res);
  } else {
    return next(new ErrorResponse('Can not find game', 500));
  }
});

exports.joinByroomId = asyncHandler(async (req, res, next) => {
  const game = await Game.findOne({ roomId: req.params.roomId });
  if (!game) {
    return next(new ErrorResponse('Can not find game with roomId', 404));
  }
  if (game.isOpen) {
    var findMember = game.participants.find(
      (obj) => obj.name == req.params.name
    );
    if (findMember) {
      return next(new ErrorResponse('Username is exist', 500));
    }
    game.participants.push({ name: req.params.name });
    await game.save();
    var item = await Presentation.findById(game.presentationId)
      .select('-questions.trueAns')
      .select('-collaborators');
    const isHost = await GameService.isHost(game.groupId, req.params.name);

    successResponse({ questions: item.questions, isHost: isHost }, res);
  } else {
    return next(new ErrorResponse('Room is not active', 404));
  }
});

exports.updateUserScore = asyncHandler(async (req, res, next) => {
  const game = await Game.findOne({ roomId: req.params.roomId });
  if (!game) {
    return next(new ErrorResponse('Can not find game', 500));
  }
  //user score
  var findMember = game.participants.find(
    (obj) => obj.name == req.body.username
  );
  if (!findMember) {
    return next(new ErrorResponse('Can not find user in participants', 500));
  }

  //presentation
  var presentation = await Presentation.findById(game.presentationId);
  if (!presentation) {
    return next(new ErrorResponse('Can not find presentation', 500));
  }
  var isAnswer = game.answers.find(
    (obj) => obj.name == req.body.username && obj.question == req.body.question
  );
  //Update score
  if (!isAnswer) {
    //update score
    var result = false;
    if (presentation.questions[req.body.question - 1].trueAns == req.body.ans) {
      findMember.score = findMember.score + 1;
      result = true;
    }
    //update answer
    game.answers.push({
      name: req.body.username,
      question: req.body.question,
      answer: req.body.ans,
      isTrue: result,
    });
    await game.save();
    successResponse(result, res);
  } else {
    return next(new ErrorResponse('you have answered!!!'), 500);
    successResponse('you have answered!!!', res);
  }
});

exports.getGameResult = asyncHandler(async (req, res, next) => {
  const game = await Game.findOne({ roomId: req.params.roomId });
  if (game) {
    game.participants = game.participants.filter(function (obj) {
      return obj.name != req.params.roomId;
    });
    res.status(200).json({
      success: true,
      data: { result: game.participants, history: game.answers },
    });
  } else {
    return next(new ErrorResponse('Can not find game by roomId', 500));
  }
});
