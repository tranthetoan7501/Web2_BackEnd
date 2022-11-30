const User = require('../models/user');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, count: users.length, data: users });
});

exports.signUp = asyncHandler(async (req, res, next) => {
  var user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.password = req.body.password;
  user.tokenCode = Math.random().toString();

  const message = `Verify your email. CLick link below to verify : \n\n ${
    process.env.BASE_URL
  }/api/user/confirm/${user.getVerifyMailJwt()}`;

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

  //sendTokenResponse(items, 200, res);
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

exports.logIn = async (req, res, next) => {
  if (req.err) {
    return next(req.err);
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
    sendTokenResponse(req.user, 200, res);
  } else {
    // Sửa response này
    return res.status(422).json(req.info);
  }
};

exports.logInWithGoogle = async (req, res, next) => {
  console.log("inside login with google")
  if (req.err) {
    return next(req.err);
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
    sendTokenResponse(req.user, 200, res);
  } else {
    // Sửa response này
    return res.status(422).json(req.info);
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
