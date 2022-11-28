const usersRoute = require('./user');
const groupsRoute = require('./group');

function route(app) {
  app.use('/api/user', usersRoute);
  app.use('/api/group', groupsRoute);
}

module.exports = route;
