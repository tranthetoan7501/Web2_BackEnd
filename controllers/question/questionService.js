const Question = require('../../models/question');

exports.createQuestion = async (req) => {
  var ques = new Question();
  ques.username = req.body.username;
  ques.roomId = req.body.roomId;
  ques.content = req.body.content;
  return await Question.create(ques);
};
