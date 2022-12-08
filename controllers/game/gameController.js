const Game = require('../../models/game');
const Presentation = require('../../models/presentation');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');

exports.createGame = asyncHandler(async (req, res, next) => {
  var game = new Game();
  game.userCreateId = req.user.id;
  game.presentationId = req.body.presentationId;

  const createdGame = await Game.create(game);
  const presentation = await Presentation.findById(createdGame.presentationId);
  res.status(200).json({
    success: true,
    data: { pin: createdGame.pin, presentation: presentation },
  });
});

exports.updateGameStatus = asyncHandler(async (req, res, next) => {
  console.log({ userCreateId: req.user.id, pin: req.body.pin });
  var game = await Game.findOneAndUpdate(
    { userCreateId: req.user.id, pin: req.body.pin },
    {
      isOpen: req.body.isOpen,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (game) {
    res.status(200).json({ success: true, data: game });
  } else {
    return next(new ErrorResponse('Can not find game', 500));
  }
});

exports.updateUserScore = asyncHandler(async (req, res, next) => {
  console.log(req.params.pin);
  const game = await Game.findOne({ pin: req.params.pin });
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
  if (presentation.questions[0].trueAns == req.body.ans) {
    findMember.score = findMember.score + 1;
    console.log(findMember.score);
  }

  //Update score
  game.participants.push(findMember);
  await game.save();
  SocketIo.in(req.params.pin).emit('student-receiver', req.body);
  res.status(200).json({ success: true, data: game });
});
