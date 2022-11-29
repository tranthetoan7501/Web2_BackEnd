const usersRoute = require('./user');
const groupsRoute = require('./group');
const authRoute = require('./auth');

function route(app) {
  app.use('/api/user', usersRoute);
  app.use('/api/group', groupsRoute);
  app.use('/api/auth', authRoute);
}

module.exports = route;
