const User = require('../../models/user');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');
const sendEmail = require('../../utils/sendEmail');
const jwt = require('jsonwebtoken');
const AuthService = require('./authService');

exports.signUp = asyncHandler(async (req, res, next) => {
  var user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.password = req.body.password;
  user.tokenCode = Math.random().toString();

  const message = `Verify your email. CLick link below to verify : \n\n ${
    process.env.BASE_URL
  }/api/auth/confirm/${user.getVerifyMailJwt()}`;

  await sendEmail({
    email: user.email,
    subject: 'Camaphoot Verify Email',
    message,
  });

  var account = await User.create(user);
  console.log(account);
  if (account != null) {
    res.status(200).json({ success: true, data: 'Email sent' });
  }
  return new ErrorResponse('Create account fail', 500);
});
exports.verify = asyncHandler(async (req, res, next) => {
  const decoded = jwt.verify(
    req.params.token,
    process.env.VERIFY_MAIL_JWT_SECRET
  );
  console.log(decoded.email);
  const user = await User.findOneAndUpdate(
    { email: decoded.email },
    { verified: true }
  );
  console.log(user);
  if (user != null) {
    return res.status(200).json({ success: true, data: user.toAuthJSON() });
  }
  return next(new ErrorResponse('Can not verify your account', 500));
});

exports.logIn = async (req, res, next) => {
  if (req.err) {
    return next(req.err);
  }
  console.log(req.user);
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

    AuthService.sendTokenResponse(req.user, 200, res);
  } else {
    // Sửa response này
    return next(new ErrorResponse('Login fail !!!', 500));
  }
};

exports.logOut = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { tokenCode: '' },
    {
      new: true,
      runValidators: true,
    }
  );

  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});
