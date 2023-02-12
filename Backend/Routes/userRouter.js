const express = require("express");
const { registerUser } = require("../Controller/userController");
const router = express.Router();

router.route("/register").post(registerUser);

module.exports = router;
