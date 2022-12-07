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
