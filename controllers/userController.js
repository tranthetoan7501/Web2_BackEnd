const User = require('../models/user');
const asyncHandler = require('../middleware/async');
//const passport = require('passport');
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

  const items = await User.create(user);
  // console.log(user);
  // res.status(201).json({
  //   success: true,
  //   data: items.toAuthJSON(),
  // });

  sendTokenResponse(items, 200, res);
});

exports.logIn = async (req, res, next) => {
  // passport.authenticate(
  //   'local',
  //   { session: false },
  //   function (err, user, info) {
  //     if (err) {
  //       return next(err);
  //     }
  //     if (user) {
  //       user.token = user.generateJWT();
  //       return res.json({ user: user.toAuthJSON() });
  //     } else {
  //       return res.status(422).json(info);
  //     }
  //   }
  // )(req, res, next);

  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  const userUpdate = await User.findByIdAndUpdate(
    user._id,
    { Islogin: true },
    {
      new: true,
      runValidators: true,
    }
  );
  console.log(userUpdate);
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  // res.status(201).json({
  //   success: true,
  //   data: user.toAuthJSON(),
  // });
  sendTokenResponse(user, 200, res);
};

exports.logOut = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { Islogin: false },
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
