const Subscriber = require('../models/Subscriber');

// @desc    Subscribe email
// @route   POST /api/subscribe
// @access  Public
const subscribe = async (req, res) => {
  try {
    const { email, source } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if email already subscribed
    const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      // Don't expose that email already exists — return success
      return res.json({ message: 'You\'re in! We\'ll send you the best AI opportunities.' });
    }

    await Subscriber.create({
      email: email.toLowerCase().trim(),
      source: source || 'hero_form',
    });

    res.status(201).json({ message: 'You\'re in! We\'ll send you the best AI opportunities.' });
  } catch (error) {
    console.error('Subscribe error:', error);
    if (error.code === 11000) {
      // Duplicate key — return success anyway
      return res.json({ message: 'You\'re in! We\'ll send you the best AI opportunities.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { subscribe };
