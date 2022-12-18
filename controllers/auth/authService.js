const User = require('../../models/user');
const jwt = require('jsonwebtoken');
exports.sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    data: user.toAuthJSON(),
  });
};
exports.createUser = (data) => {
  var user = new User();
  user.username = data.body.username;
  user.email = data.body.email;
  user.password = data.body.password;
  user.tokenCode = Math.random().toString();
  return user;
};

exports.verifyMessage = (user) => {
  const message = `Verify your email. CLick link below to verify : \n\n ${
    process.env.BASE_URL
  }/api/auth/confirm/${user.getVerifyMailJwt()}`;
  return message;
};

exports.verify = async (token) => {
  const decoded = jwt.verify(token, process.env.VERIFY_MAIL_JWT_SECRET);

  const user = await User.findOneAndUpdate(
    { email: decoded.email },
    { verified: true }
  );
  return user;
};
