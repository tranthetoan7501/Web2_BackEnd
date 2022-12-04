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
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    select: false,
    // required: [true, 'Please add a password'],
    // minlength: 6,
  },
  ownGroups: [
    {
      id: String,
      groupName: String,
    },
  ],
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
  tokenCode: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  googleId: {
    type: String,
  },
});

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
  // var today = new Date();
  // var exp = new Date(today);
  // exp.setDate(today.getDate() + 60);
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      code: this.tokenCode,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

User.methods.getVerifyMailJwt = function () {
  return jwt.sign(
    {
      email: this.email,
    },
    process.env.VERIFY_MAIL_JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Match user entered password to hashed password in database
User.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

User.methods.toAuthJSON = function () {
  var p = Object.assign({}, this);
  return {
    user: this,
    token: this.getSignedJwtToken(),
  };
};

User.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', User);
