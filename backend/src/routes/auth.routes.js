const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyEmail, resendVerificationEmail } = require('../controllers/auth.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-email/:token', verifyEmail); // Nayi route
router.post('/resend-verification', resendVerificationEmail);

module.exports = router;