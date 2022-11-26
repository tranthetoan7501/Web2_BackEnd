const mongoose = require('mongoose');

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
    },
  ],
  kickOut: [
    {
      id: String,
      name: String,
    },
  ],
});
module.exports = mongoose.model('Group', Group);
