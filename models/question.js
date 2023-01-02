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
      answer: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  voters: [{ type: String }],
  totalVote: {
    type: Number,
  },
  isAnswered: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

Question.pre('save', async function (next) {
  this.totalVote = this.voters.length;
});

module.exports = mongoose.model('Question', Question);
