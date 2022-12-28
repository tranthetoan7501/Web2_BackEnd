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
    { userCreateId: req.user.id, roomId: req.body.roomId },
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
    successResponse({ success: true, data: item }, res);
  } else {
    return next(new ErrorResponse('Room is not active', 404));
  }
});

exports.updateUserScore = asyncHandler(async (req, res, next) => {
  //SocketIo.in(req.params.roomId).emit('teacher-receiver', 'adadfafdfadfd');
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

  //remove old data
  game.participants = game.participants.filter(function (obj) {
    return obj.name != req.body.username;
  });

  //presentation
  var presentation = await Presentation.findById(game.presentationId);
  if (!presentation) {
    return next(new ErrorResponse('Can not find presentation', 500));
  }
  var result = false;
  if (presentation.questions[req.body.question - 1].trueAns == req.body.ans) {
    findMember.score = findMember.score + 1;
    console.log(findMember.score);
    result = true;
  }
  //Update score
  game.participants.push(findMember);
  await game.save();
  //SocketIo.in(req.params.roomId).emit('teacher-receiver', req.body);
  res.status(200).json({ success: true, data: result });
});

exports.getGameResult = asyncHandler(async (req, res, next) => {
  const game = await Game.findOne({ roomId: req.params.roomId });
  if (game) {
    game.participants = game.participants.filter(function (obj) {
      return obj.name != req.params.roomId;
    });
    res.status(200).json({ success: true, data: game.participants });
  } else {
    return next(new ErrorResponse('Can not find game by roomId', 500));
  }
});
