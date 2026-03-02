const express = require('express');
const router = express.Router();

const { register, login, logout, verifyEmail, sendTestEmail } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.patch('/verify-email', verifyEmail)
router.patch('/sendTestEmail', sendTestEmail)

module.exports = router;
