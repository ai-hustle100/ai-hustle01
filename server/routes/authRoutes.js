const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {
  register,
  verifyOTP,
  resendOTP,
  login,
  getProfile,
  updatePhone,
  verifyPhone,
  updateEducation,
  updateSkills,
  getProfileCompletion,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Generate JWT token (for Google OAuth callback)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Public routes (rate limited)
router.post('/register', authLimiter, register);
router.post('/verify-otp', authLimiter, verifyOTP);
router.post('/resend-otp', authLimiter, resendOTP);
router.post('/login', authLimiter, login);

// Google OAuth routes
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(501).json({ message: 'Google OAuth is not configured' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false, failureRedirect: '/login' })(req, res, next);
  },
  (req, res) => {
    try {
      const token = generateToken(req.user._id);
      const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';
      res.redirect(`${clientURL}/dashboard?token=${token}`);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect('/login?error=auth_failed');
    }
  }
);

// Protected routes
router.get('/profile', protect, getProfile);

// Progressive profiling routes (protected)
router.put('/profile/phone', protect, updatePhone);
router.put('/profile/verify-phone', protect, verifyPhone);
router.put('/profile/education', protect, updateEducation);
router.put('/profile/skills', protect, updateSkills);
router.get('/profile/completion', protect, getProfileCompletion);

module.exports = router;
