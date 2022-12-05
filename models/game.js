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
  isOpen: {
    type: Boolean,
    default: false,
  },
});

Game.pre('save', async function (next) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  console.log('dasdas');
  this.pin = result;
});

module.exports = mongoose.model('Game', Game);
