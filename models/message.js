const mongoose = require('mongoose');
const Message = new mongoose.Schema({
  roomId: {
    type: String,
    required: [true, 'require roomId of question'],
  },
  username: {
    type: String,
    require: [true, 'username is required'],
  },
  content: {
    type: String,
    require: [true, 'message content is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: String,
    default: new Date().getDate() + '/' + (new Date().getMonth() + 1),
  },
  time: {
    type: String,
    default: new Date().getHours() + ':' + new Date().getMinutes(),
  },
});

module.exports = mongoose.model('Message', Message);
