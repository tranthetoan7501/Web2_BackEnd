const User = require('../../models/user');

exports.findUserByGoogleID = async (googleID) => {
  const user = await User.findOne({ googleId: googleID });
  return user;
};

exports.findUserByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  return user;
};

exports.createUser = (data) => {
  var user = new User();
  user.username = data.body.username;
  user.email = data.body.email;
  user.password = data.body.password;
  user.verified = true;
  user.tokenCode = Math.random().toString();
  return user;
};
