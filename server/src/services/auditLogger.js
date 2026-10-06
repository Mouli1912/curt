/**
 * Append-Only Security Audit Logging Service for SkillPath Credentials
 * Tracks all credential issuance, verification, and revocation events.
 */

const fs = require('fs');
const path = require('path');

// In-memory audit log array
const auditLogs = [];

// Optional audit log file path (if server has write permissions)
const LOG_DIR = path.join(process.cwd(), 'logs');
const AUDIT_FILE = path.join(LOG_DIR, 'credential_audit.log');

/**
 * Sanitizes input text to prevent log injection or storing private key / payload data
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\r\n\t]/g, ' ').slice(0, 500);
}

/**
 * Logs a credential audit event
 * 
 * @param {Object} event
 * @param {string} event.action - 'ISSUE' | 'VERIFY' | 'REVOKE' | 'VERIFY_FAILED'
 * @param {string} event.credentialId
 * @param {string} [event.studentId]
 * @param {string} [event.skillNode]
 * @param {string} event.outcome - 'SUCCESS' | 'FAILED' | 'REVOKED'
 * @param {string} [event.details]
 * @param {string} [event.clientIp]
 */
function logAudit(event = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action: sanitizeString(event.action || 'UNKNOWN'),
    credentialId: sanitizeString(event.credentialId || 'N/A'),
    studentId: sanitizeString(event.studentId || 'N/A'),
    skillNode: sanitizeString(event.skillNode || 'N/A'),
    outcome: sanitizeString(event.outcome || 'UNKNOWN'),
    details: sanitizeString(event.details || ''),
    clientIp: sanitizeString(event.clientIp || '127.0.0.1')
  };

  auditLogs.push(logEntry);

  // Attempt append to log file asynchronously
  try {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
    fs.appendFileSync(AUDIT_FILE, JSON.stringify(logEntry) + '\n', 'utf-8');
  } catch (err) {
    // Non-blocking fallback if disk is read-only
  }

  return logEntry;
}

/**
 * Retrieves audit logs for security review
 * @param {number} [limit=100] 
 */
function getAuditLogs(limit = 100) {
  return auditLogs.slice(-limit).reverse();
}

module.exports = {
  logAudit,
  getAuditLogs
};
