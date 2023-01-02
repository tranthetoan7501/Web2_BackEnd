const User = require('../../models/user');
const asyncHandler = require('../../middleware/async');
const { successResponse } = require('../../utils/response');
const ErrorResponse = require('../../utils/errorResponse');
const UserService = require('../../controllers/user/userService');
const { red } = require('colors');

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

exports.getUserGoogleAccount = asyncHandler(async (req, res, next) => {
  if (req.user) {
    if (req.user.emails[0].value) {
      const email = req.user.emails[0].value;
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        successResponse(existingUser.toAuthJSON(), res);
      } else {
        var user = new User();
        user.username =
          req.user.name.familyName + ' ' + req.user.name.givenName;
        user.email = email;
        user.verified = true;
        const newUser = await User.create(user);
        successResponse(newUser.toAuthJSON(), res);
      }
    } else {
      return next(
        new ErrorResponse('Something wrong with google account !!!', 500)
      );
    }
  } else {
    successResponse('logout success', res);
  }
});

exports.getGroupToCreateGame = asyncHandler(async (req, res, next) => {
  const users = await User.findById(req.user.id);
  successResponse(
    { ownGroups: users.ownGroups, CoOwnGroups: users.CoOwnGroups },
    res
  );
});
