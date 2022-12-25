const mongoose = require('mongoose');
const Presentation = new mongoose.Schema({
  userCreate: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  collaborators: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
      name: String,
    },
  ],
  name: {
    type: String,
    required: [true, 'Name must have'],
    unique: true,
  },
  questions: [
    {
      content: {
        type: String,
        required: [true, 'require Content of question'],
      },
      ansA: {
        type: String,
        required: [true, 'require ans A'],
      },
      ansB: {
        type: String,
        required: [true, 'require ans B'],
      },
      ansC: {
        type: String,
        required: [true, 'require ans C'],
      },
      ansD: {
        type: String,
        required: [true, 'require ans D'],
      },
      time: {
        type: Number,
        default: 12,
      },
      trueAns: {
        type: String,
        required: true,
      },
    },
  ],
  numberOfQuestion: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
Presentation.pre('save', async function (next) {
  this.numberOfQuestion = this.questions.length;
});

module.exports = mongoose.model('Presentation', Presentation);
