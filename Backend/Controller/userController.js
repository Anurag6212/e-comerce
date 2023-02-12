const asyncFn = require("../Middleware/asyncErros");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../Model/userModel");

const registerUser = asyncFn(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "thiss is for test",
      url: "test123",
    },
  });
  return res.json({
    success: true,
    user,
  });
});

module.exports = registerUser;
