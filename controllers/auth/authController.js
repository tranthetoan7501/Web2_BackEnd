const User = require('../../models/user');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');
const sendEmail = require('../../utils/sendEmail');
const { successResponse } = require('../../utils/response');
const crypto = require('crypto');
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
    successResponse('Verify success', res);
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

  //res.redirect(process.env.CLIENT_BASE_URL);
  successResponse(process.env.CLIENT_BASE_URL, res);
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${process.env.CLIENT_BASE_URL}/resetpassword/${resetToken}`;

  const message = `Click here to reset password: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  //res.redirect(`${process.env.CLIENT_BASE_URL}\login`);
  //sendTokenResponse(user, 200, res);
  successResponse(user.toAuthJSON(), res);
});
