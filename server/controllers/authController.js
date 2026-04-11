const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, sendOTPEmail } = require('../utils/email');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Calculate profile completion percentage
const calculateProfileCompletion = (user) => {
  let percentage = 30; // Base: has name + email
  if (user.isPhoneVerified) percentage += 25;
  if (user.education) percentage += 10;
  if (user.degreeType) percentage += 10;
  if (user.skills && user.skills.length > 0) percentage += 15;
  if (user.interests && user.interests.length > 0) percentage += 10;
  return Math.min(percentage, 100);
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }
      // If not verified, delete old account and allow re-registration
      await User.findByIdAndDelete(existingUser._id);
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES) || 10) * 60 * 1000);

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      authProvider: 'local',
      otp,
      otpExpiry,
    });

    // Send OTP email
    await sendOTPEmail(email, otp, name);

    res.status(201).json({
      message: 'Registration successful. Please check your email for the OTP.',
      email: user.email,
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find user with OTP fields
    const user = await User.findOne({ email }).select('+otp +otpExpiry');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Account is already verified' });
    }

    // Check OTP expiry
    if (user.otpExpiry && new Date() > user.otpExpiry) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Check OTP match
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // Verify user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Email verified successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
        bookmarks: user.bookmarks,
        profileCompletionPercentage: user.profileCompletionPercentage,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Account is already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES) || 10) * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp, user.name);

    res.json({ message: 'New OTP sent to your email' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user with password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Google OAuth users can't login with password
    if (user.authProvider === 'google' && !user.password) {
      return res.status(400).json({
        message: 'This account uses Google Sign-In. Please use "Continue with Google" to login.',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check verification
    if (!user.isVerified) {
      // Resend OTP
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES) || 10) * 60 * 1000);
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
      await sendOTPEmail(email, otp, user.name);

      return res.status(403).json({
        message: 'Please verify your email first. A new OTP has been sent.',
        needsVerification: true,
        email: user.email,
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
        bookmarks: user.bookmarks,
        profileCompletionPercentage: user.profileCompletionPercentage,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
        bookmarks: user.bookmarks.map(b => b.toString()),
        createdAt: user.createdAt,
        profileCompletionPercentage: user.profileCompletionPercentage,
        authProvider: user.authProvider,
        education: user.education,
        degreeType: user.degreeType,
        skills: user.skills,
        interests: user.interests,
        isPhoneVerified: user.isPhoneVerified,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================================
// PROGRESSIVE PROFILING ENDPOINTS
// =============================================

// @desc    Update phone number & send OTP
// @route   PUT /api/auth/profile/phone
// @access  Private
const updatePhone = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const user = await User.findById(req.user._id);
    user.phone = phone;

    // Generate phone OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via email for now (SMS integration later)
    await sendOTPEmail(user.email, otp, user.name);

    res.json({ message: 'Verification code sent to your email for phone verification' });
  } catch (error) {
    console.error('Update phone error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify phone OTP
// @route   PUT /api/auth/profile/verify-phone
// @access  Private
const verifyPhone = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    const user = await User.findById(req.user._id).select('+otp +otpExpiry');

    if (user.otpExpiry && new Date() > user.otpExpiry) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isPhoneVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.profileCompletionPercentage = calculateProfileCompletion(user);
    await user.save();

    res.json({
      message: 'Phone verified successfully!',
      profileCompletionPercentage: user.profileCompletionPercentage,
    });
  } catch (error) {
    console.error('Verify phone error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update education
// @route   PUT /api/auth/profile/education
// @access  Private
const updateEducation = async (req, res) => {
  try {
    const { education, degreeType } = req.body;

    const user = await User.findById(req.user._id);
    if (education) user.education = education;
    if (degreeType) user.degreeType = degreeType;
    user.profileCompletionPercentage = calculateProfileCompletion(user);
    await user.save();

    res.json({
      message: 'Education updated successfully',
      profileCompletionPercentage: user.profileCompletionPercentage,
    });
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update skills & interests
// @route   PUT /api/auth/profile/skills
// @access  Private
const updateSkills = async (req, res) => {
  try {
    const { skills, interests } = req.body;

    const user = await User.findById(req.user._id);
    if (skills) user.skills = skills;
    if (interests) user.interests = interests;
    user.profileCompletionPercentage = calculateProfileCompletion(user);
    await user.save();

    res.json({
      message: 'Skills and interests updated successfully',
      profileCompletionPercentage: user.profileCompletionPercentage,
    });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get profile completion status
// @route   GET /api/auth/profile/completion
// @access  Private
const getProfileCompletion = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const percentage = calculateProfileCompletion(user);

    // Update if it has changed
    if (user.profileCompletionPercentage !== percentage) {
      user.profileCompletionPercentage = percentage;
      await user.save();
    }

    res.json({
      profileCompletionPercentage: percentage,
      sections: {
        phone: { completed: user.isPhoneVerified, points: 25 },
        education: { completed: !!user.education, points: 10 },
        degreeType: { completed: !!user.degreeType, points: 10 },
        skills: { completed: user.skills?.length > 0, points: 15 },
        interests: { completed: user.interests?.length > 0, points: 10 },
      },
    });
  } catch (error) {
    console.error('Profile completion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
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
};
