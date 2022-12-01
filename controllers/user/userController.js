const User = require('../../models/user');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, count: users.length, data: users });
});

exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  res.status(200).json({ success: true, data: user });
});

exports.getProfile = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: req.user });
});
