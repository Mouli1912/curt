/**
 * Rate Limiter Middleware for Assessment API
 * Prevents rapid-fire rating manipulation and automated brute-forcing.
 */

const requestCounts = new Map();

// Clean up expired IP windows every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Creates a rate limiter middleware with specified window and request limits
 * @param {Object} options 
 * @param {number} options.windowMs - Time window in milliseconds (default 60s)
 * @param {number} options.max - Maximum requests allowed per window (default 30)
 */
function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 60 * 1000;
  const maxRequests = options.max || 30;

  return (req, res, next) => {
    const key = req.body?.userId || req.ip || 'global';
    const now = Date.now();

    let record = requestCounts.get(key);
    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + windowMs };
    }

    record.count += 1;
    requestCounts.set(key, record);

    if (record.count > maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        error: 'Too many requests. Rate limit exceeded. Please wait before submitting another answer.',
        retryAfterSeconds: retryAfter
      });
    }

    next();
  };
}

module.exports = {
  createRateLimiter
};
