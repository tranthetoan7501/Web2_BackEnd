const Presentation = require('../../models/presentation');
const Game = require('../../models/game');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');

exports.getPresentationById = asyncHandler(async (req, res, next) => {
  if (true /*roomStatus.get(req.params.id)*/) {
    var item = await Presentation.findById(req.params.id).select(
      '-questions.trueAns'
    );
    res.status(200).json({ success: true, data: item });
  } else {
    return next(new ErrorResponse('Room is not active', 500));
  }
});

exports.getPresentationByPin = asyncHandler(async (req, res, next) => {
  var game = await Game.findOne({ pin: req.params.pin });
  if (game.isOpen) {
    var item = await Presentation.findById(game.presentationId).select(
      '-questions.trueAns'
    );
    res.status(200).json({ success: true, data: item });
  } else {
    return next(new ErrorResponse('Room is not active', 500));
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
  console.log('\n\item: ', items)
  res.status(200).json({ success: true, data: items });
});

exports.getMyPresentationById = asyncHandler(async (req, res, next) => {
  var item = await Presentation.findOne({
    _id: req.params.id,
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
