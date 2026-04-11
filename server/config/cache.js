const NodeCache = require('node-cache');

// stdTTL: default time-to-live in seconds (5 minutes)
// checkperiod: interval in seconds to check for expired keys
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

module.exports = cache;
