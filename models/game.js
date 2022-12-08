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
  pin: {
    type: String,
  },
  participants: {
    type: [
      {
        name: String,
        score: {
          type: Number,
          default: 0,
        },
      },
    ],
    unique: false,
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
    for (var i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.pin = result;
    this.participants.push({ name: this.pin });
    console.log('created new game with new pin: ', result);
  }
});

module.exports = mongoose.model('Game', Game);
