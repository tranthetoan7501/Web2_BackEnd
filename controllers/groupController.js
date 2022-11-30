const Group = require('../models/group');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const jwt = require('jsonwebtoken');

exports.getGroups = asyncHandler(async (req, res, next) => {
  //? params: page | count
  const groups = await Group.find();
  // handle pagination
  res.status(200).json({ success: true, limit: groups.length, data: groups });
});

exports.createGroup = asyncHandler(async (req, res, next) => {
  var group = new Group();
  group.groupName = req.body.groupName;
  group.owner = { id: req.user.id, name: req.user.username };

  const groupCreate = await Group.create(group);

  res.status(200).json({
    success: true,
    data: groupCreate,
  });
});

exports.generateLinkJoinGroup = asyncHandler(async (req, res, next) => {
  var group = await Group.findById(req.body.id);
  if (group != null && req.user.id == group.owner.id) {
    var linkInvite = `${
      process.env.BASE_URL
      //req.baseUrl
    }/api/group/join/${group.getGroupJwt()}`;
    res.status(200).json({ success: true, data: linkInvite });
  } else {
    return next(new ErrorResponse('Can not find this group with id', 500));
  }
});

exports.joinGroup = asyncHandler(async (req, res, next) => {
  const decoded = jwt.verify(req.params.token, process.env.GROUP_JWT_SECRET);
  var group = await Group.findById(decoded.id);
  if (!group) {
    return next(new ErrorResponse('Can not find this group with id', 500));
  }
  var findMember = group.member.find((obj) => obj.id == req.user.id);

  if (group.owner.id.toString() == req.user._id) {
    return next(
      new ErrorResponse('Can not join. You is owner of this group', 500)
    );
  }
  if (!findMember) {
    var memberList = group.member;
    memberList.push({
      id: req.user.id,
      name: req.user.username,
      email: req.user.email,
    });
    var item = await Group.findByIdAndUpdate(
      decoded.id,
      {
        member: memberList,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ success: true, data: item });
  }
  return next(new ErrorResponse('You was a member of this group', 500));
});

exports.inviteByEmail = asyncHandler(async (req, res, next) => {});
