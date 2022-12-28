const Group = require('../../models/group');
const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const sendEmail = require('../../utils/sendEmail');
const GroupService = require('./groupService');
const { successResponse } = require('../../utils/response');

exports.createGroup = asyncHandler(async (req, res, next) => {
  var group = new Group();
  group.groupName = req.body.groupName;
  group.owner = { id: req.user.id, name: req.user.username };

  const groupCreate = await Group.create(group);
  var ownGroupList = req.user.ownGroups;
  console.log(ownGroupList);
  ownGroupList.push({
    id: groupCreate.id,
    groupName: groupCreate.groupName,
  });

  var user = await User.findByIdAndUpdate(
    req.user.id,
    {
      ownGroups: ownGroupList,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  successResponse(groupCreate, res);
});

exports.getGroupById = asyncHandler(async (req, res, next) => {
  const group = await Group.findById(req.params.id);
  if (!group) {
    return next(new ErrorResponse('Can not find group with id', 500));
  }
  successResponse(group, res);
});

exports.getGroups = asyncHandler(async (req, res, next) => {
  const groups = await Group.find();
  res.status(200).json({ success: true, data: groups });
});

exports.getMyGroups = asyncHandler(async (req, res, next) => {
  //console.log(req.user.id);
  const groups = await Group.find({ 'owner.id': req.user.id });
  res.status(200).json({ success: true, data: groups });
});

exports.getMyJoinedGroups = asyncHandler(async (req, res, next) => {
  //console.log(req.user.id);
  const user = await User.findById(req.user.id);
  successResponse(user.groups, res);
  //res.status(200).json({ success: true, data: groups });
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
    //update member of group
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
    successResponse('Join success', res);
  } else {
    return next(new ErrorResponse('You was a member of this group', 500));
  }
});

exports.generateLinkEmail = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    return next(new ErrorResponse('Can not find user', 500));
  }
  const group = await Group.findById(req.body.id);

  if (group != null && req.user.id == group.owner.id) {
    const message = GroupService.inviteMessage(
      group.getJoinByLinkEmailJwt(user.id)
    );

    await sendEmail({
      email: user.email,
      subject: 'Join group invitation',
      message,
    });
    successResponse('Sent invite mail', res);
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
    //update member of group
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
    successResponse('Join success', res);
  } else {
    return next(new ErrorResponse('You was a member of this group', 500));
  }
});

exports.assignCoOwner = asyncHandler(async (req, res, next) => {
  var user = await User.findOne({ username: req.body.coOwner });
  if (!user) {
    return next(new ErrorResponse('Could not find this user', 500));
  }

  var myGroup = await Group.findById(req.body.groupId);
  if (!myGroup) {
    return next(new ErrorResponse('Can not find this group with groupId', 500));
  }

  if (myGroup.owner.name == req.user.username) {
    const findOwner = myGroup.coOwners.find((obj) => obj.name == user.username);
    if (!findOwner) {
      user.CoOwnGroups.push({
        id: myGroup.id,
        groupName: myGroup.groupName,
      });
      await user.save();
      myGroup.coOwners.push({ id: user.id, name: user.username });
      await myGroup.save();
      successResponse('Assign success', res);
    } else {
      return next(new ErrorResponse('You was Co-Owner', 500));
    }
  } else {
  }
});

exports.unAssignCoOwner = asyncHandler(async (req, res, next) => {
  var user = await User.findOne({ username: req.body.coOwner });
  if (!user) {
    return next(new ErrorResponse('Could not find this user', 500));
  }

  var myGroup = await Group.findById(req.body.groupId);
  if (!myGroup) {
    return next(new ErrorResponse('Can not find this group with groupId', 500));
  }
  if (myGroup.owner.name == req.user.username) {
    user.CoOwnGroups = user.CoOwnGroups.find(
      (obj) => obj.groupName != myGroup.groupName
    );
    await user.save();
    myGroup.coOwners = myGroup.coOwners.find(
      (obj) => obj.name != user.username
    );
    await myGroup.save();
    successResponse('Unassign success', res);
  } else {
    return next(new ErrorResponse('You do not own this group', 500));
  }
});

exports.kickMember = asyncHandler(async (req, res, next) => {
  var user = await User.findOne({ username: req.body.kickUserId });
  if (!user) {
    return next(new ErrorResponse('Could not find this user', 500));
  }

  var myGroup = await Group.findById(req.body.groupId);
  if (!myGroup) {
    return next(new ErrorResponse('Can not find this group with groupId', 500));
  }
  if (myGroup.owner.name == req.user.username) {
    user.groups = user.groups.find((obj) => obj.groupName != myGroup.groupName);
    await user.save();
    myGroup.member = myGroup.member.find((obj) => obj.name != user.username);
    myGroup.coOwners = myGroup.coOwners.find(
      (obj) => obj.name != user.username
    );
    await myGroup.save();
    successResponse('Kick success', res);
  } else {
    return next(new ErrorResponse('You do not have right', 500));
  }
});

exports.deleteGroup = asyncHandler(async (req, res, next) => {
  var myGroup = await Group.findById(req.params.id);
  if (!myGroup) {
    return next(new ErrorResponse('Can not find this group with groupId', 500));
  }
  if (myGroup.owner.name == req.user.username) {
    //remove group in owner's grouplist
    var owner = await User.findOne({ username: myGroup.owner.name });
    owner.ownGroups = owner.ownGroups.find(
      (obj) => obj.groupName != myGroup.groupName
    );
    await owner.save();

    //remove group in Coowner's grouplist
    myGroup.coOwners.forEach(async (item) => {
      var coOwner = await User.findById(item.id);
      coOwner.CoOwnGroups = coOwner.CoOwnGroups.find(
        (obj) => obj.groupName != myGroup.groupName
      );
      await coOwner.save();
    });

    //remove group in each member's grouplist
    myGroup.member.forEach(async (item) => {
      var user = await User.findById(item.id);
      user.groups = user.groups.find(
        (obj) => obj.groupName != myGroup.groupName
      );
      await user.save();
    });

    await myGroup.delete();
    successResponse('Delete success', res);
  } else {
    return next(new ErrorResponse('You do not have right', 500));
  }
});
