/**
 * Rate Limiting Middleware
 * Prevents rapid-fire rating manipulation on /api/assessment/answer.
 */

const requestCounts = new Map();

/**
 * Creates a rate-limiting middleware.
 * @param {number} windowMs - Time window in milliseconds (e.g. 60000ms = 1 min)
 * @param {number} maxRequests - Max requests allowed within window
 */
function createRateLimiter(windowMs = 60000, maxRequests = 30) {
  return (req, res, next) => {
    const identifier = req.body?.userId || req.ip || 'global';
    const now = Date.now();

    if (!requestCounts.has(identifier)) {
      requestCounts.set(identifier, []);
    }

    const timestamps = requestCounts.get(identifier);
    // Filter timestamps within current window
    const validTimestamps = timestamps.filter(ts => now - ts < windowMs);

    if (validTimestamps.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too many answer submissions.',
        message: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds allowed.`,
        retryAfterSeconds: Math.ceil((windowMs - (now - validTimestamps[0])) / 1000)
      });
    }

    validTimestamps.push(now);
    requestCounts.set(identifier, validTimestamps);
    next();
  };
}

module.exports = {
  createRateLimiter,
  answerRateLimiter: createRateLimiter(60000, 30) // 30 requests per minute
};
