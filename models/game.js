const mongoose = require('mongoose');

const Game = new mongoose.Schema({
  userCreateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  presentationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Presentation',
  },
  roomId: {
    type: String,
    unique: true,
  },
  participants: [
    {
      name: String,
      score: {
        type: Number,
        default: 0,
      },
    },
  ],
  answers: [
    {
      name: String,
      question: Number,
      answer: String,
      isTrue: Boolean,
      time: {
        type: String,
        default:
          new Date().getHours() +
          ':' +
          new Date().getMinutes() +
          ':' +
          new Date().getSeconds(),
      },
    },
  ],
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
});

Game.pre('save', async function (next) {
  if (this.isModified('userCreateId')) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.roomId = result;
  }
});

module.exports = mongoose.model('Game', Game);
