const asyncFn = require("../Middleware/asyncErros");
const ErrorHandler = require("../utils/errorHandler");
const { sendEmail } = require("../utils/sendEmail");
const User = require("../Model/userModel");
const jwtTokens = require("../utils/jwtTokens");
const crypto = require("crypto");

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

  jwtTokens(user, 201, res);
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
  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(
      new ErrorHandler("User doesn't exist.Please register first.", 401)
    );
  }
  jwtTokens(user, 200, res);
});

const logoutUser = asyncFn(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logged out.",
  });
});

const forgotPassword = asyncFn(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User does not exist", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordIgnore = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is /n/n ${resetPasswordIgnore}. If you have not registered then please ignore.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Reset.",
      message,
    });

    return res.status(200).json({
      success: true,
      message: `Email sent successfully to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    4;

    return next(new ErrorHandler(error.message, 500));
  }
});

const resetPassword = asyncFn(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords are not matching.", 404));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

const getUserDetails = asyncFn(async (req, res, next) => {
  const user = await User.find(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

const updatePassword = asyncFn(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = await User.find(req.user.id).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  const isPasswordMatched = user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password does not match.", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("old and new password does not match", 400));
  }

  user.password = newPassword;

  await user.save();
  sendToken(user, 200, res);
});
// use for update email, phone and role
const updateProfile = asyncFn(async (req, res, next) => {
  const { userData } = req.body;
  let user = await User.find(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  user = await User.findByIdAndUpdate(req.user.id, userData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//admin
const getAllUsers = asyncFn(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

//admin
const getSingleUser = asyncFn(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

const deleteProfile = asyncFn(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found.", 400));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "Profile deleted successfully",
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  deleteProfile,
};
