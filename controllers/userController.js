const User = require('../models/user');

const passport = require('passport');
const passportConfig = require('../middlewares/passport');


exports.getUsers = async (req, res, next) => {
  try{
    const users = await User.find();
    res.status(200).json({success:true,count:users.length,data:users});
  }catch(error){
    res.status(400).json({success:false,});
  }
};

exports.signUp = async(req,res,next) =>{
  try{
  
    var user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    console.log(user);
    const items = await User.create(user);

    res.status(201).json({
        success:true,
        data: items.toAuthJSON()
    });
  }catch(err){
    res.status(400).json({success:err});
  }
}


exports.logIn = async(req, res, next) =>{
  passport.authenticate('local', {session: false}, function(err, user, info){
    if(err){ return next(err); }
    if(user){
      user.token = user.generateJWT();
      return res.json({user: user.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
}


