const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

const router = express.Router();

router.post("/reg", registerUser);
router.post("/sign-in", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
