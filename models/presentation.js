const mongoose = require('mongoose');
const Presentation = new mongoose.Schema({
  userCreate: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  name: {
    type: String,
    required: [true, 'Name must have'],
    unique: [true, 'Name is exist'],
  },
  questions: [
    {
      content: {
        type: String,
        require: [true, 'require Content of question'],
      },
      ansA: {
        type: String,
        require: [true, 'require ans A'],
      },
      ansB: {
        type: String,
        require: [true, 'require ans B'],
      },
      ansC: {
        type: String,
        require: [true, 'require ans C'],
      },
      ansD: {
        type: String,
        require: [true, 'require ans D'],
      },
      time: {
        type: Number,
        default: 12,
      },
      trueAns: {
        type: String,
        require: true,
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
