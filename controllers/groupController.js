const Group = require('../models/group');

exports.getGroups = async(req, res, next) => {
  try{
    const groups = await Group.find();
    res.status(200).json({success:true,count:groups.length,data:groups});
  }catch(error){
    res.status(400).json({success:false,});
  }
};

exports.createGroup = async(req,res,next) =>{
  try{
    console.log(req.body);
    const group = await Group.create(req.body);

    res.status(200).json({
        success:true,
        data: group
    });
  }catch(err){
    res.status(400).json({success:err});
  }
}


