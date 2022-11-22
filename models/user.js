const mongoose = require('mongoose');
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secretKey = 'secrect key';

const User = new mongoose.Schema(
  {
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true,
        trim: true,
        maxlength: [50, 'Username can not be more than 50 characters']
    },
    hashPassword:{
        type: String
    },
    email:{
      type: String,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    groups:[{
        id : String,
        courseName : String
    }],
    salt:{
      type:String
    },
    imgUrl: {
      type:String
    },
    nickName: {
      type:String
    }
  }
);

User.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hashPassword = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

User.methods.validPassword = function(password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hashPassword === hash;
};

User.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000)
    },
    secretKey
  );
};

User.methods.toAuthJSON = function(){
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT()
  };
};




module.exports = mongoose.model('User', User);