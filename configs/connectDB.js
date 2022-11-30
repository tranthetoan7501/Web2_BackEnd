const mongoose = require('mongoose');

const connectDB = async () => {
  console.log("url database: ", process.env.DATABAS)
  const conn = await mongoose.connect(process.env.DATABASE);
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
