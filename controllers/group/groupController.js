const Group = require('../../models/group');
const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const sendEmail = require('../../utils/sendEmail');

exports.getGroupById = asyncHandler(async (req, res, next) => {
  const group = await Group.findById(req.params.id);
  if (!group) {
    return next(new ErrorResponse('Can not find group with id', 500));
  }
  res.status(200).json({ success: true, data: group });
});

exports.getGroups = asyncHandler(async (req, res, next) => {
  const groups = await Group.find();
  res.status(200).json({ success: true, limit: groups.length, data: groups });
});

exports.createGroup = asyncHandler(async (req, res, next) => {
  var group = new Group();
  group.groupName = req.body.groupName;
  group.owner = { id: req.user.id, name: req.user.username };

  const groupCreate = await Group.create(group);
  var ownGroupList = req.user.ownGroup;
  ownGroupList.push({
    id: groupCreate.id,
    groupName: groupCreate.groupName,
  });

  var user = await User.findByIdAndUpdate(
    req.user.id,
    {
      ownGroup: ownGroupList,
    },
    {
      new: true,
      runValidators: true,
    }
  );

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
    //update mamber of group
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
    var groupList = req.user.groups;
    groupList.push({
      id: group.id,
      groupName: group.groupName,
    });

    var user = await User.findByIdAndUpdate(
      req.user.id,
      {
        groups: groupList,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ success: true, data: {} });
  }
  return next(new ErrorResponse('You was a member of this group', 500));
});

exports.generateLinkEmail = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username });
  console.log(user);
  if (!user) {
    return next(new ErrorResponse('Can not find user', 500));
  }
  const group = await Group.findById(req.body.id);
  console.log(group);
  if (group != null && req.user.id == group.owner.id) {
    var linkInvite = `${
      process.env.BASE_URL
    }/api/group/mailjoin/${group.getJoinByLinkEmailJwt(user.id)}`;

    const message = `Verify your email. CLick link below to verify : \n\n ${linkInvite}`;

    await sendEmail({
      email: user.email,
      subject: 'Join group invitation',
      message,
    });
    res.status(200).json({ success: true, data: {} });
  } else {
    return next(new ErrorResponse('Can not fin group to generate link', 500));
  }
});

exports.joinByMailLink = asyncHandler(async (req, res, next) => {
  const decoded = jwt.verify(req.params.token, process.env.GROUP_JWT_SECRET);
  var group = await Group.findById(decoded.id);
  var thisUser = await User.findById(decoded.userid);
  if (!group) {
    return next(new ErrorResponse('Can not find this group with id', 500));
  }
  if (group.owner.id.toString() == decoded.userid) {
    return next(
      new ErrorResponse('Can not join. You is owner of this group', 500)
    );
  }
  var findMember = group.member.find((obj) => obj.id == decoded.userid);
  if (!findMember) {
    //update mamber of group
    var memberList = group.member;
    memberList.push({
      id: thisUser.id,
      name: thisUser.username,
      email: thisUser.email,
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
    var groupList = thisUser.groups;
    groupList.push({
      id: group.id,
      groupName: group.groupName,
    });

    var user = await User.findByIdAndUpdate(
      decoded.userid,
      {
        groups: groupList,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ success: true, data: {} });
  }
  return next(new ErrorResponse('You was a member of this group', 500));
});

exports.assignCoOwner = asyncHandler(async (req, res, next) => {
  var user = await User.findOne({ username: req.body.username });
  if (!user) {
    return next(new ErrorResponse('Could not find this user', 500));
  }

  var group = await Group.findByIdAndUpdate(
    req.body.groupId,
    {
      coOwner: { id: user.id, name: user.username },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ success: true, data: {} });

  if (!group) {
    return next(new ErrorResponse('Can not find this group with groupId', 500));
  }
});
