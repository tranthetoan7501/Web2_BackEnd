const usersRoute = require('./user');
const groupsRoute = require('./group');
const authRoute = require('./auth');
const presentRoute = require('./presentation');
const game = require('./game');
const mess = require('./message');
const question = require('./question');

function route(app) {
  app.use('/api/user', usersRoute);
  app.use('/api/group', groupsRoute);
  app.use('/api/auth', authRoute);
  app.use('/api/presentation', presentRoute);
  app.use('/api/game', game);
  app.use('/api/message', mess);
  app.use('/api/question', question);
}

module.exports = route;
