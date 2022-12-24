exports.inviteMessage = (jwt) => {
  var linkInvite = `${process.env.BASE_URL}/api/group/mailjoin/${jwt}`;

  const message = `Verify your email. CLick link below to verify : \n\n ${linkInvite}`;

  return message;
};
