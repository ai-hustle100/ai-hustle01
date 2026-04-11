const express = require('express');
const router = express.Router();
const { subscribe } = require('../controllers/subscribeController');
const { subscribeLimiter } = require('../middleware/rateLimiter');

router.post('/', subscribeLimiter, subscribe);

module.exports = router;
