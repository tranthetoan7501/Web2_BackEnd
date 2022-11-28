const User = require('../models/user');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, count: users.length, data: users });
});

exports.signUp = asyncHandler(async (req, res, next) => {
  var user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.password = req.body.password;
  user.TokenCode = Math.random().toString();
  user.UsingToken = user.getSignedJwtToken();

  const items = await User.create(user);

  sendTokenResponse(items, 200, res);
});

exports.logIn = async (req, res, next) => {
  if (req.err) {
    return next(req.err);
  }
  if (req.user) {
    req.user.TokenCode = Math.random().toString();
    req.user.token = req.user.getSignedJwtToken();
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { TokenCode: req.user.TokenCode },
      {
        new: true,
        runValidators: true,
      }
    );
    sendTokenResponse(req.user, 200, res);
  } else {
    // Sửa response này
    return res.status(422).json(req.info);
  }
};

exports.logOut = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { TokenCode: '' },
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

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
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
