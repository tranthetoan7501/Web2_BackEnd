const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true,
    maxlength: [50, 'Username can not be more than 50 characters'],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  groups: [
    {
      id: String,
      groupName: String,
    },
  ],
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user',
  },
  Islogin: {
    type: Boolean,
    default: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// User.methods.setPassword = function (password) {
//   this.salt = crypto.randomBytes(16).toString('hex');
//   this.password = crypto
//     .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
//     .toString('hex');
// };

// Encrypt password using bcrypt
User.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
User.methods.getSignedJwtToken = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Match user entered password to hashed password in database
User.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// User.methods.validPassword = function (password) {
//   var hash = crypto
//     .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
//     .toString('hex');
//   return this.hashPassword === hash;
// };

// User.methods.generateJWT = function () {
//   var today = new Date();
//   var exp = new Date(today);
//   exp.setDate(today.getDate() + 60);

//   return jwt.sign(
//     {
//       id: this._id,
//       username: this.username,
//       exp: parseInt(exp.getTime() / 1000),
//     },
//     process.env.JWT_SECRET
//   );
// };

User.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    token: this.getSignedJwtToken(),
  };
};

module.exports = mongoose.model('User', User);
