const Message = require('../../models/message');
const Game = require('../../models/game');
const asyncHandler = require('../../middleware/async');
const ErrorResponse = require('../../utils/errorResponse');
const { successResponse } = require('../../utils/response');
const MesService = require('./messageService');

exports.createMessage = asyncHandler(async (req, res, next) => {
  //body: roomId, username, content
  console.log(req.body);
  const mess = await MesService.createMessage(req);
  successResponse(mess, res);
});

exports.getMessage = asyncHandler(async (req, res, next) => {
  //body: roomId;
  const mess = await Message.aggregate([
    { $match: { roomId: req.params.roomId } },
    { $project: { username: 1, content: 1, date: 1, time: 1, _id: 0 } },
  ]);
  successResponse(mess.reverse(), res);
});
