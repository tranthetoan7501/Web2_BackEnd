const Message = require('../../models/message');

exports.createMessage = async (req) => {
  var mess = new Message();
  mess.username = req.body.username;
  mess.roomId = req.body.roomId;
  mess.content = req.body.content;
  return await Message.create(mess);
};

exports.fo = (req) => {
  return req + 'adad';
};
