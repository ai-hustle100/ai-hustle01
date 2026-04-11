const Platform = require('../models/Platform');
const User = require('../models/User');
const cache = require('../config/cache');

// @desc    Get all platforms (basic info - public)
// @route   GET /api/platforms
// @access  Public
const getAllPlatforms = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12 } = req.query;

    // Build cache key
    const cacheKey = `platforms_${category || 'all'}_${search || ''}_${sort || 'latest'}_${page}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }

    // Build filter
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { name: { $regex: searchRegex } },
        { shortDescription: { $regex: searchRegex } },
        { tags: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
      ];
    }

    // Build sort
    let sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'earning') sortOption = { earningPotential: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Return only basic info for public view
    const platforms = await Platform.find(filter)
      .select('name shortDescription category earningPotential rating logo tags')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Platform.countDocuments(filter);

    const result = {
      platforms,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      },
    };

    // Cache for 5 minutes
    cache.set(cacheKey, result, 300);
    res.set('X-Cache', 'MISS');

    res.json(result);
  } catch (error) {
    console.error('Get platforms error:', error);
    res.status(500).json({ message: 'Server error fetching platforms' });
  }
};

// @desc    Get platform by ID (full details - public with optional auth)
// @route   GET /api/platforms/:id
// @access  Public (optional auth for bookmark status)
const getPlatformById = async (req, res) => {
  try {
    const platformId = req.params.id;

    // Check cache
    const cacheKey = `platform_${platformId}`;
    const cached = cache.get(cacheKey);

    let platform;
    if (cached) {
      platform = cached;
      res.set('X-Cache', 'HIT');
    } else {
      platform = await Platform.findById(platformId);
      if (!platform) {
        return res.status(404).json({ message: 'Platform not found' });
      }
      // Cache for 10 minutes
      cache.set(cacheKey, platform.toObject(), 600);
      res.set('X-Cache', 'MISS');
      platform = platform.toObject();
    }

    // Check if user has bookmarked this platform (only if authenticated)
    let isBookmarked = false;
    if (req.user) {
      isBookmarked = req.user.bookmarks.some(
        (bid) => bid.toString() === platformId
      );
    }

    res.json({
      platform: {
        ...platform,
        isBookmarked,
      },
    });
  } catch (error) {
    console.error('Get platform error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Platform not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle bookmark platform
// @route   POST /api/platforms/:id/bookmark
// @access  Private
const toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const platformId = req.params.id;

    // Check if platform exists
    const platform = await Platform.findById(platformId);
    if (!platform) {
      return res.status(404).json({ message: 'Platform not found' });
    }

    const bookmarkIndex = user.bookmarks.findIndex(
      (bid) => bid.toString() === platformId
    );

    if (bookmarkIndex > -1) {
      // Remove bookmark
      user.bookmarks.splice(bookmarkIndex, 1);
      await user.save();
      return res.json({ message: 'Bookmark removed', isBookmarked: false });
    } else {
      // Add bookmark
      user.bookmarks.push(platformId);
      await user.save();
      return res.json({ message: 'Platform bookmarked', isBookmarked: true });
    }
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user bookmarks
// @route   GET /api/platforms/bookmarks/list
// @access  Private
const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks');
    res.json({ platforms: user.bookmarks });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllPlatforms, getPlatformById, toggleBookmark, getBookmarks };
