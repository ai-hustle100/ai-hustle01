const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Platform name is required'],
    trim: true,
    unique: true,
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: 200,
  },
  fullDescription: {
    type: String,
    required: [true, 'Full description is required'],
  },
  category: {
    type: String,
    required: true,
    enum: ['Freelancing', 'AI Tools', 'Surveys', 'Micro Tasks', 'Content Creation', 'Teaching', 'Development', 'Design', 'Data Labeling', 'Other'],
  },
  earningPotential: {
    type: String,
    required: true,
    enum: ['$', '$$', '$$$', '$$$$', '$$$$$'],
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 3,
  },
  website: {
    type: String,
    required: [true, 'Website URL is required'],
  },
  logo: {
    type: String,
    default: '',
  },
  steps: [{
    type: String,
  }],
  pros: [{
    type: String,
  }],
  cons: [{
    type: String,
  }],
  tags: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for search
platformSchema.index({ name: 'text', shortDescription: 'text', tags: 'text' });

module.exports = mongoose.model('Platform', platformSchema);
