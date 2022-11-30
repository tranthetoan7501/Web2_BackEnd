const UserModel = require('../../models/user')

exports.findUserByGoogleID = async (googleID) => {
    const user = await UserModel.findOne({googleId: googleID})
    return user
}