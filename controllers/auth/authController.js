const User = require('../../models/user');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');
const sendEmail = require('../../utils/sendEmail');
const jwt = require('jsonwebtoken');

exports.signUp = asyncHandler(async (req, res, next) => {
  var user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.password = req.body.password;
  user.tokenCode = Math.random().toString();

  const message = `Verify your email. CLick link below to verify : \n\n ${
    process.env.BASE_URL
  }/api/auth/confirm/${user.getVerifyMailJwt()}`;

  try {
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
  } catch (err) {
    console.log(err);

    return next(
      new ErrorResponse('Email could not be sent or create account fail', 500)
    );
  }
});
exports.verify = asyncHandler(async (req, res, next) => {
  console.log(req.params.token);
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
