const Message = require('../../models/message');

exports.createMessage = async (req) => {
  var mess = new Message();
  mess.username = req.body.username;
  console.log(req.body.roomId);
  console.log(req.body.username);
  console.log(req.body.content);

  mess.roomId = req.body.roomId;
  mess.content = req.body.content;
  return await Message.create(mess);
};

exports.fo = (req) => {
  return req + 'adad';
};
