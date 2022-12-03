const usersRoute = require('./user');
const groupsRoute = require('./group');
const authRoute = require('./auth');
const presentRoute = require('./presentation');

function route(app) {
  app.use('/api/user', usersRoute);
  app.use('/api/group', groupsRoute);
  app.use('/api/auth', authRoute);
  app.use('/api/presentation', presentRoute);
}

module.exports = route;
