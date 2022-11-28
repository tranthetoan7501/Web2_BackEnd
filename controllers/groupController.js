const Group = require('../models/group');

exports.getGroups = async (req, res, next) => {
  try {
    //? params: page | count
    const groups = await Group.find();
    // handle pagination
    res.status(200).json({ success: true, limit: groups.length, data: groups });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

exports.createGroup = async (req, res, next) => {
  try {
    console.log(req.body);
    // Todo: check valid group name
    const group = await Group.create(req.body);
    // TODO: must have owner when create group
    // ...
    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (err) {
    res.status(400).json({ success: err });
  }
};
