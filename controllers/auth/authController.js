const User = require('../../models/user');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');
const sendEmail = require('../../utils/sendEmail');
const { successResponse } = require('../../utils/response');
const jwt = require('jsonwebtoken');
const AuthService = require('./authService');
const user = require('../../models/user');

exports.signUp = asyncHandler(async (req, res, next) => {
  const user = AuthService.createUser(req);

  const message = AuthService.verifyMessage(user);

  const account = await User.create(user);

  if (account != null) {
    await sendEmail({
      email: user.email,
      subject: 'Camaphoot Verify Email',
      message,
    });
    successResponse('Email sent', res);
  }
  return new ErrorResponse('Create account fail', 500);
});

exports.verify = asyncHandler(async (req, res, next) => {
  const verifiedUser = await AuthService.verify(req.params.token);

  if (verifiedUser != null) {
    successResponse(verifiedUser.toAuthJSON(), res);
  } else {
    return next(new ErrorResponse('Can not verify your account', 500));
  }
});

exports.logIn = async (req, res, next) => {
  if (req.err) {
    return next(req.err);
  }

  if (!req.user.verified) {
    return next(new ErrorResponse('Your account has not been verified', 500));
  }
  if (req.user) {
    req.user.tokenCode = Math.random().toString();
    req.user.token = req.user.getSignedJwtToken();
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { tokenCode: req.user.tokenCode },
      {
        new: true,
        runValidators: true,
      }
    );
    successResponse(user.toAuthJSON(), res);
    //AuthService.sendTokenResponse(req.user, 200, res);
  } else {
    return next(new ErrorResponse('Login fail !!!', 500));
  }
};

exports.logOut = asyncHandler(async (req, res, next) => {
  if (req.user.tokenCode) {
    await User.findByIdAndUpdate(
      req.user.id,
      { tokenCode: '--' },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  //res.redirect('http://localhost:3000');
  successResponse({}, res);
});
