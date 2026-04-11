const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Optional authentication middleware.
 * If a valid JWT is present, attaches req.user.
 * If not, continues without error (req.user = null).
 */
const optionalAuth = async (req, res, next) => {
  req.user = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.isVerified) {
        req.user = user;
      }
    } catch {
      // Token invalid or expired — continue as unauthenticated
    }
  }

  next();
};

module.exports = { optionalAuth };
