const mongoose = require('mongoose');
const User = new mongoose.Schema(
  {
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true,
        trim: true,
        maxlength: [50, 'Username can not be more than 50 characters']
    },
    name:{
        type:String
    },
    password:{
        type: String,
        required: [true, 'Please add a password'],
    },
    groups:[{
        id : String,
        courseName : String
    }]
  }
);
module.exports = mongoose.model('User', User);