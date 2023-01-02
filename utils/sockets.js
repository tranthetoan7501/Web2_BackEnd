const Game = require('../models/game');
const Presentation = require('../models/presentation');
const Message = require('../models/message');
global.userInRoom = new Map();
global.activeUsers = new Map();
async function getDataAnswer(roomId, question) {
  const game = await Game.findOne({ roomId: roomId });
  const A = game.answers.filter(
    (obj) => obj.question == question && obj.answer == 'A'
  ).length;
  const B = game.answers.filter(
    (obj) => obj.question == question && obj.answer == 'B'
  ).length;
  const C = game.answers.filter(
    (obj) => obj.question == question && obj.answer == 'C'
  ).length;
  const D = game.answers.filter(
    (obj) => obj.question == question && obj.answer == 'D'
  ).length;
  return { question, A, B, C, D };
}
exports.listen = (io) => {
  io.on('connection', (socket) => {
    socket.on('add-user', (userName) => {
      const room = userInRoom.get(userName);
      if (room) {
        socket.join(room);
      }
      activeUsers.set(userName, socket.id);
    });

    socket.on('join-room', (userRoom) => {
      socket.join(userRoom.room);
      userInRoom.set(userRoom.name, userRoom.room);
      //log
      console.log('\t\t\t\t\t\t\tsocket id: ', socket.id);
      console.log('create-room');
      console.log('userInRoom: ', userInRoom);
      console.log('userRoom.ROOM ROOM: ', userRoom.room);
    });
    socket.on('send-nextQuestion', (roomMsg) => {
      socket.to(roomMsg.room).emit('listen-nextQuestion', roomMsg.msg);
    });

    socket.on('send-answer-chart', async (roomMsg) => {
      const chartData = await getDataAnswer(roomMsg.room, roomMsg.msg);
      io.in(roomMsg.room).emit('listen-answer-chart', chartData);
    });
    socket.on('send-message', async (roomMsg) => {
      const chatData = await Message.aggregate([
        { $match: { roomId: roomMsg.room } },
        { $project: { username: 1, content: 1, date: 1, time: 1, _id: 0 } },
      ]);
      io.in(roomMsg.room).emit('listen-message', chatData);
    });

    socket.on('disconnect', () => {
      const username = [...activeUsers.entries()]
        .filter(({ 1: v }) => v === socket.id)
        .map(([k]) => k);

      if (username.length > 0) {
        activeUsers.delete(username[0]);
        userInRoom.delete(username[0]);
      }

      //log
      console.log(`user at socket_ID = ${socket.id}     DISCONNECTED`);
      console.log(`username: ${username[0]}`);

      console.log(`activeUsers: `, activeUsers);
      console.log(`userInRoom:`, userInRoom);
    });
  });
};
