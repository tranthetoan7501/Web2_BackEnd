const User = require('../../models/user');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, count: users.length, data: users });
});
