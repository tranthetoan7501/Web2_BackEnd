const GameModel = require('../../models/game');
const Gruop = require('../../models/group');
exports.createGame = async (req) => {
  var game = new GameModel();
  game.userCreateId = req.user.id;
  //game.userCreateId = '63a69aa445975433dddfde8e'; //req.user.id;
  game.presentationId = req.body.presentationId;
  game.groupId = req.body.groupId;
  const Game = await GameModel.create(game);
  return Game;
};

exports.isHost = async (groupId, name) => {
  if (!groupId) {
    return false;
  }
  const group = await Gruop.findById(groupId);
  const findCoOwner = group.coOwners.find((obj) => obj.name == name);
  if (group.owner.name == name || findCoOwner) {
    return true;
  }
  return false;
};
