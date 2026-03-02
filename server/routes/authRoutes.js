const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const {
  register,
  login,
  logout,
  verifyEmail,
  sendTestEmail,
  forgottenPasswordRecovery,
  resetPassword,
} = require("../controllers/authController");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").delete(authenticateUser, logout);
router.route("/verify-email").patch(verifyEmail);
router.route("/sendTestEmail").patch(sendTestEmail);
router.route("/reset-password").post(resetPassword)
router.route("/forgot-password").post(forgottenPasswordRecovery)


module.exports = router;
