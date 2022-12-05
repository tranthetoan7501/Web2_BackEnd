const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const passport = require('passport');
const passportLocal = require('./middleware/passport');
const colors = require('colors');
const cors = require('cors');
const cookieSession = require('cookie-session');
const socket = require('socket.io');

const errorHandler = require('./middleware/error');
// db
const connectDb = require('./configs/connectDB');

const app = express();

app.use(
  cookieSession({
    name: 'session',
    keys: ['cyberwolve'],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: ['https://webadvance.netlify.app/', 'http://localhost:3000'],
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);

dotenv.config({ path: './configs/config.env' });
connectDb();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const route = require('./routes');

route(app);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
console.log('USing port: ', PORT);
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

global.userInRoom = new Map();
global.roomStatus = new Map();
global.SocketIo = io;
io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userName) => {
    const room = userInRoom.get(userName);
    if (room) {
      socket.join(room);
    }
    console.log(room);
  });
  //Socket handle teacher emit
  socket.on('open-room', (userRoom) => {
    //userInRoom.set;
    socket.join(userRoom.room);
    userInRoom.set(userRoom.name, userRoom.room);
    roomStatus.set(userRoom.room, true);
    console.log(roomStatus);
    console.log(userRoom.room);
  });

  socket.on('start-room', (data) => {
    roomStatus.set(data, false);
    console.log(`start ${roomStatus}`);
    console.log(data);
  });

  socket.on('send-student', (roomMsg) => {
    console.log(roomMsg);
    socket.to(roomMsg.room).emit('recieve-student', roomMsg.msg);
  });

  //Socket handle Student emit
  socket.on('join-room', (userRoom) => {
    console.log(userRoom);
    socket.join(userRoom.room);
    userInRoom.set(userRoom.name, userRoom.room);
    console.log(userInRoom);
  });

  socket.on('send-teacher', (roomMsg) => {
    console.log(roomMsg);
    socket.to(roomMsg.room).emit('recieve-teacher', roomMsg.msg);
  });

  socket.on('start-msg', (data) => {});
});
