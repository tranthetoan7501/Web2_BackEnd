const Game = require('../models/game');
const Presentation = require('../models/presentation');
global.userInRoom = new Map();
global.activeUsers = new Map();

exports.listen = (io) => {
  io.on('connection', (socket) => {

    console.log("\t\t\t\t\NEW CONNECTION: ", socket.id)


    socket.on('add-user', (userName) => {
      console.log('connection');
      const room = userInRoom.get(userName);
      if (room) {
        socket.join(room);
      }
      console.log(room);
      activeUsers.set(userName, socket.id);
    });

    //
    //Socket handle teacher emit
    socket.on('create-room', (userRoom) => {
      socket.join(userRoom.room);
      userInRoom.set(userRoom.name, userRoom.room);

      //log
      console.log('\t\t\t\t\t\t\tsocket id: ', socket.id)
      console.log('create-room');
      console.log('userInRoom: ', userInRoom);
      console.log('userRoom.ROOM                               ROOM: ', userRoom.room);
    });

    socket.on('student-sender', (roomMsg) => {
      socket.to(roomMsg.room).emit('student-receiver', roomMsg.msg);
      //log
      console.log('student-sender');
      console.log(roomMsg);
    });

    //Socket handle Student emit
    socket.on('join-room', (userRoom) => {
      socket.join(userRoom.room);
      userInRoom.set(userRoom.name, userRoom.room);
      socket.to(userRoom.room).emit('join-room-receiver', userRoom.name);
      //log
      console.log('userRoom: ', userRoom);
      console.log('userInRoom: ', userInRoom);
    });

    socket.on('teacher-sender', (roomMsg) => {
      socket.to(roomMsg.room).emit('teacher-receiver', roomMsg.msg);

      //log
      console.log('teacher-sender');
      console.log(roomMsg);
    });

    socket.on('disconnect', () => {
      console.log(activeUsers);
      console.log(userInRoom);
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
