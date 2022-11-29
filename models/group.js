const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Group = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, 'Please add a groupName'],
    trim: true,
    maxlength: [100, 'Groupname can not be more than 100 characters'],
  },
  owner: {
    type: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
      name: String,
    },
    required: [true, 'Please add owner'],
  },
  coOwner: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    name: String,
  },
  member: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
      name: String,
      email: String,
    },
  ],
  kickOut: [
    {
      id: String,
      name: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

Group.methods.getGroupJwt = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.GROUP_JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

module.exports = mongoose.model('Group', Group);
