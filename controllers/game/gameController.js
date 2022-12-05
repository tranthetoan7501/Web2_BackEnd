const Game = require('../../models/game');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');

exports.createGame = asyncHandler(async (req, res, next) => {
  console.log('sadasdsadsad');
  var game = new Game();
  game.userCreateId = req.user.id;
  game.presentationId = req.body.presentationId;
  console.log(game);
  var createdGame = await Game.create(game);
  res.status(200).json({ success: true, data: createdGame });
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
