/**
 * Request Logging Middleware for Abuse Prevention & Auditability
 * Captures request metadata while strictly excluding sensitive data (passwords, keys, tokens).
 */

function sanitizeBody(body) {
  if (!body || typeof body !== 'object') return undefined;
  const safe = { ...body };
  delete safe.password;
  delete safe.privateKey;
  delete safe.secret;
  delete safe.token;
  return safe;
}

function requestLoggerMiddleware(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userId = req.user?.userId || req.body?.userId || 'anonymous';

    const logMessage = `[HTTP] ${new Date().toISOString()} | ${req.method} ${req.originalUrl || req.url} | Status: ${res.statusCode} | Duration: ${durationMs}ms | IP: ${clientIp} | User: ${userId}`;

    // Suppress health checks to keep logs clean
    if (!req.path.startsWith('/api/health')) {
      console.log(logMessage);
    }
  });

  next();
}

module.exports = {
  requestLoggerMiddleware
};
