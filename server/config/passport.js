const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const initializePassport = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log('⚠️  Google OAuth not configured — skipping GoogleStrategy setup');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // --- THIS IS THE FIX ---
        callbackURL: process.env.NODE_ENV === 'production' 
          ? 'https://ai-hustle01-production.up.railway.app/api/auth/google/callback'
          : '/api/auth/google/callback',
        proxy: true, 
        // -----------------------
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const name = profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim();
          const avatar = profile.photos?.[0]?.value || '';

          // Check if user already exists
          let user = await User.findOne({ email });

          if (user) {
            // User exists — update avatar if missing and ensure verified
            if (!user.avatar && avatar) {
              user.avatar = avatar;
            }
            if (!user.isVerified) {
              user.isVerified = true;
            }
            if (user.authProvider === 'local') {
              // User originally registered with email — now also linked to Google
              user.authProvider = 'google';
            }
            await user.save();
          } else {
            // Create new user with Google auth
            user = await User.create({
              name,
              email,
              avatar,
              authProvider: 'google',
              isVerified: true,
              profileCompletionPercentage: 30,
            });
          }

          // Generate JWT
          const token = generateToken(user._id);
          user._token = token;

          done(null, user);
        } catch (error) {
          console.error('Google OAuth error:', error);
          done(error, null);
        }
      }
    )
  );
};

module.exports = { initializePassport, generateToken };