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

  const token = user.getJWTToken();

  return res.status(200).json({
    success: true,
    token,
  });
});

const loginUser = asyncFn(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(
      new ErrorHandler("User doesn't exist.Please register first.", 401)
    );
  }
  const isPasswordMatched = user.comparePassword();

  if (!isPasswordMatched) {
    return next(
      new ErrorHandler("User doesn't exist.Please register first.", 401)
    );
  }
  const token = user.getJWTToken();

  return res.status(200).json({
    success: true,
    token,
  });
});

module.exports = { registerUser, loginUser };
