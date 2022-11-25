const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
// db
const connectDb = require('./configs/connectDB');

const app = express();

dotenv.config({ path: './configs/config.env' });
connectDb();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const route = require('./routes');
route(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
