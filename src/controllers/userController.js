const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");
const getAllUser = asyncHandler(async (req, res) => {
  const users = await UserModel.find({});
  const data = [];
  users.forEach((user) => {
    data.push({
      id: user._id,
      email: user.email ?? "",
      fullname: user.fullname ?? "",
    });
  });

  console.log(data);
  res.status(200).json({
      message: 'Get all user successfully',
      data: data
  });
});

module.exports = { getAllUser };