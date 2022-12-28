const GameModel = require('../../models/game');

exports.createGame = async (req) => {
  var game = new GameModel();
  game.userCreateId = req.user.id;
  game.presentationId = req.body.presentationId;
  game.groupId = req.body.groupId;
  const Game = await GameModel.create(game);
  return Game;
};
