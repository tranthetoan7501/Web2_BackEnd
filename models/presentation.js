const mongoose = require('mongoose');
const Presentation = new mongoose.Schema({
  //   code: {
  //     type: String,
  //     require: [true, 'Please add a group name'],
  //     trim: true,
  //     maxlength: [6, 'Code must have 6 characters'],
  //     minlength: [6, 'Code must have 6 characters'],
  //     unique: true,
  //   },
  userCreate: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  questions: [
    {
      content: {
        type: String,
        require: true,
      },
      ansA: {
        type: String,
        require: true,
      },
      ansB: {
        type: String,
        require: true,
      },
      ansC: {
        type: String,
        require: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('Presentation', Presentation);
