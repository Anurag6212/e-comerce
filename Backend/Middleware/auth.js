const ErrorHandler = require("../utils/errorHandler");
const asyncFn = require("./asyncErros");
const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");

exports.auth = asyncFn(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decodedData.id);

  next();
});

exports.authorizeRole = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role ${req.user.role} is not allowed to access this resource.`,
          403
        )
      );
    }
    next();
  };
};
