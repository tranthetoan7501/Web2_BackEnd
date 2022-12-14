const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const passport = require('passport');
const passportLocal = require('./middleware/passport');
const colors = require('colors');
const cors = require('cors');
const cookieSession = require('cookie-session');
const socket = require('socket.io');
const sockets = require('./utils/sockets');

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
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
  },
});

global.SocketIo = io;

sockets.listen(io);
