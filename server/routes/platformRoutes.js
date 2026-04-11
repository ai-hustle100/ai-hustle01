const express = require('express');
const router = express.Router();
const { getAllPlatforms, getPlatformById, toggleBookmark, getBookmarks } = require('../controllers/platformController');
const { protect } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/optionalAuth');

// Public routes
router.get('/', getAllPlatforms);

// Protected routes
router.get('/bookmarks/list', protect, getBookmarks);

// Public with optional auth (shows bookmark status if logged in)
router.get('/:id', optionalAuth, getPlatformById);

// Protected — must be logged in to bookmark
router.post('/:id/bookmark', protect, toggleBookmark);

module.exports = router;
