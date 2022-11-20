const connectDb = require('./configs/connectDB');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const app = express();

//route
const usersRoute = require('./routes/user');
const groupsRoute = require('./routes/group');

dotenv.config({ path: './configs/config.env' });
connectDb();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//mount route
app.use('/api/v1/user', usersRoute);
app.use('/api/v1/group', groupsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
