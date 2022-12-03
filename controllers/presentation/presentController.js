const Presentation = require('../../models/presentation');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');

exports.getPresentationById = asyncHandler(async (req, res, next) => {
  var item = await Presentation.findById(req.params.id);
  res.status(200).json({ success: true, data: item });
});

exports.getPresentationByUserId = asyncHandler(async (req, res, next) => {
  var items = await Presentation.find({ userCreate: req.params.id }).select(
    '-questions.trueAns'
  );
  res.status(200).json({ success: true, data: items });
});

exports.getMyPresentation = asyncHandler(async (req, res, next) => {
  var items = await Presentation.find({ userCreate: req.user.id });
  res.status(200).json({ success: true, data: items });
});

exports.createPresentation = asyncHandler(async (req, res, next) => {
  var createItem = req.body;
  createItem.userCreate = req.user.id;
  var presentation = await Presentation.create(createItem);
  res.status(200).json({ success: true, data: presentation });
});

exports.updatePresentation = asyncHandler(async (req, res, next) => {
  console.log(req.params.id);
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
