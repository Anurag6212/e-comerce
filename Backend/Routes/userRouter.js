const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getSingleUser,
  getAllUsers,
  deleteProfile,
} = require("../Controller/userController");
const { auth, authorizeRole } = require("../Middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logoutUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(auth, getUserDetails);

router.route("/password/update").put(auth, updatePassword);

router.route("/me/update").put(auth, updateProfile);

router
  .route("/admin/users/:id")
  .get(auth, authorizeRole("admin"), getSingleUser)
  .delete(auth, authorizeRole("admin"), deleteProfile);

router.route("/admin/users").get(auth, authorizeRole("admin"), getAllUsers);

module.exports = router;
