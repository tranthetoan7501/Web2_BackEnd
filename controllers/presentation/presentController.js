const Presentation = require('../../models/presentation');
const Game = require('../../models/game');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');

exports.getPresentationById = asyncHandler(async (req, res, next) => {
  var item = await Presentation.findById(req.params.id).select(
    '-questions.trueAns'
  );
  if (item) {
    res.status(200).json({ success: true, data: item });
  } else {
    return next(new ErrorResponse('Can not find presentation by id', 500));
  }
});

// used when user join
exports.getPresentationByPin = asyncHandler(async (req, res, next) => {
  const game = await Game.findOne({ pin: req.params.pin });

  if (!game) {
    return next(new ErrorResponse('Can not find game with pin', 404));
  }
  if (game.isOpen) {
    var findMember = game.participants.find(
      (obj) => obj.name == req.params.name
    );
    if (findMember) {
      return next(new ErrorResponse('Username is exist', 500));
    }
    var list = game.participants;
    list.push({ name: req.params.name });
    await Game.findByIdAndUpdate(
      game.id,
      { participants: list },
      { runValidators: true }
    );
    var item = await Presentation.findById(game.presentationId).select(
      '-questions.trueAns'
    );
    res.status(200).json({ success: true, data: item });
  } else {
    return next(new ErrorResponse('Room is not active', 404));
  }
});

exports.getPresentationByUserId = asyncHandler(async (req, res, next) => {
  var items = await Presentation.find({ userCreate: req.params.id }).select(
    '-questions.trueAns'
  );
  res.status(200).json({ success: true, data: items });
});

exports.getMyPresentations = asyncHandler(async (req, res, next) => {
  var items = await Presentation.find({ userCreate: req.user.id }).select(
    '-questions'
  );
  console.log('\nitem: ', items);
  res.status(200).json({ success: true, data: items });
});

exports.getMyPresentationById = asyncHandler(async (req, res, next) => {
  var item = await Presentation.findOne({
    _id: req.params.id,
    userCreate: req.user.id,
  });
  res.status(200).json({ success: true, data: item });
});

exports.createPresentation = asyncHandler(async (req, res, next) => {
  var createItem = req.body;
  createItem.userCreate = req.user.id;
  var presentation = await Presentation.create(createItem);
  res.status(200).json({ success: true, data: presentation });
});

exports.updatePresentation = asyncHandler(async (req, res, next) => {
  var presentation = await Presentation.findByIdAndUpdate(
    req.params.id,
    { questions: req.body.questions },
    {
      new: true,
      runValidators: true,
    }
  );
  if (presentation) {
    res.status(200).json({ success: true, data: presentation });
  } else {
    return next(new ErrorResponse('Can not find presentation by id', 500));
  }
});

exports.deletePresentation = asyncHandler(async (req, res, next) => {
  var presentation = await Presentation.findByIdAndDelete(req.params.id);
  if (presentation) {
    res.status(200).json({ success: true, data: presentation });
  }
  return next(new ErrorResponse('Can not find presentation by id', 500));
});
