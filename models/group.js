const mongoose = require('mongoose');
const Group = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, 'Please add a groupName'],
    trim: true,
    maxlength: [100, 'Groupname can not be more than 100 characters'],
  },
  owner: {
    id: String,
    name: String,
  },
  coOwner: {
    id: String,
    name: String,
  },
  member: [
    {
      id: String,
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
