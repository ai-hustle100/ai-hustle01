const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password in queries by default
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    select: false,
  },
  otpExpiry: {
    type: Date,
    select: false,
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Platform',
  }],
  avatar: {
    type: String,
    default: '',
  },
  // Auth provider tracking
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  // Progressive profiling fields
  education: {
    type: String,
    enum: ['high_school', 'undergraduate', 'graduate', 'postgraduate', 'other', null],
    default: null,
  },
  degreeType: {
    type: String,
    enum: ['BA', 'BSc', 'BCom', 'BTech', 'BE', 'BCA', 'BBA', 'MA', 'MSc', 'MTech', 'MBA', 'MCA', 'PhD', 'other', null],
    default: null,
  },
  skills: [{
    type: String,
  }],
  interests: [{
    type: String,
  }],
  profileCompletionPercentage: {
    type: Number,
    default: 30,
    min: 0,
    max: 100,
  },
}, {
  timestamps: true,
});

// Hash password before saving (only if password exists and was modified)
userSchema.pre('save', async function() {
  if (!this.password || !this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method (safe for Google OAuth users with no password)
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
