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
  directToResetPassword,
  resetPassword,
} = require("../controllers/authController");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").delete(authenticateUser, logout);
router.route("/verify-email").patch(verifyEmail);
router.route("/sendTestEmail").patch(sendTestEmail);
router.route("/send-reset-email").patch(forgottenPasswordRecovery);
router.route("/reset-password/").patch(resetPassword)
router.route("/reset-password/*").patch(directToResetPassword)

module.exports = router;
