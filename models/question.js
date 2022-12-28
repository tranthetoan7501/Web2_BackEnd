const mongoose = require('mongoose');
const Question = new mongoose.Schema({
  roomId: {
    type: String,
    required: [true, 'require roomId of question'],
  },
  content: {
    type: String,
    required: [true, 'require Content of question'],
  },
  username: {
    type: String,
    required: [true, 'require username'],
  },
  answers: [
    {
      username: String,
      content: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  totalVote: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Question', Question);
