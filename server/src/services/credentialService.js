/**
 * Credential Service
 * ECDSA P-256 (secp256r1) Digital Signature Issuance and Offline Verification.
 * Pure applied cryptography with zero LLM / external API dependencies.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { PROFICIENCY_THRESHOLD } = require('./gapService');

const MIN_QUESTIONS_PER_NODE = 3;

// Paths to cryptographic keys
const keysDir = path.join(__dirname, '../../../keys');
const privateKeyPath = path.join(keysDir, 'private.pem');
const publicKeyPath = path.join(keysDir, 'public.pem');

// In-memory store for issued credentials (keyed by credentialId)
const issuedCredentials = new Map();

/**
 * Loads private key from file.
 * Private key is used strictly server-side and never returned in API responses or logs.
 */
function getPrivateKey() {
  if (!fs.existsSync(privateKeyPath)) {
    throw new Error('Private key not found at /keys/private.pem. Please run node scripts/generateKeys.js first.');
  }
  return fs.readFileSync(privateKeyPath, 'utf8');
}

/**
 * Loads public key from file.
 */
function getPublicKey() {
  if (!fs.existsSync(publicKeyPath)) {
    throw new Error('Public key not found at /keys/public.pem. Please run node scripts/generateKeys.js first.');
  }
  return fs.readFileSync(publicKeyPath, 'utf8');
}

/**
 * Checks if a learner meets the node-level pass criteria to mint a credential:
 * 1. Learner Elo rating >= PROFICIENCY_THRESHOLD (1100).
 * 2. Learner has answered at least MIN_QUESTIONS_PER_NODE (3) on that specific node.
 * 
 * @param {{ rating: number, questionCount: number }} params
 * @returns {boolean} True if learner qualifies for credential minting
 */
function isNodeProvable({ rating, questionCount }) {
  const numRating = Number(rating);
  const numQuestions = Number(questionCount);

  if (isNaN(numRating) || isNaN(numQuestions)) {
    return false;
  }

  return numRating >= PROFICIENCY_THRESHOLD && numQuestions >= MIN_QUESTIONS_PER_NODE;
}

/**
 * Canonicalizes a payload object by sorting keys alphabetically.
 * Ensures 100% deterministic JSON stringification during signing and verification.
 * 
 * @param {Object} payload - Object payload
 * @returns {string} Canonical JSON string
 */
function canonicalizePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return '';
  }
  const sortedKeys = Object.keys(payload).sort();
  const canonicalObj = {};
  for (const key of sortedKeys) {
    canonicalObj[key] = payload[key];
  }
  return JSON.stringify(canonicalObj);
}

/**
 * Issues a cryptographically signed ECDSA credential for a proven skill node.
 * 
 * @param {Object} params
 * @param {string} params.studentId - Learner ID
 * @param {string} params.studentName - Learner name
 * @param {string} params.skillNode - Skill node ID (e.g. "javascript")
 * @param {number} params.score - Learner Elo rating for skill node
 * @param {string} [params.targetRole] - Target role title
 * @param {string} [customPrivateKey] - Optional key override for unit testing
 * @returns {Object} Full signed credential object
 */
function issueCredential({ studentId, studentName = 'Learner', skillNode, score, targetRole = 'frontend-developer' }, customPrivateKey = null) {
  if (!studentId || !skillNode || score === undefined) {
    throw new Error('Missing required credential fields: studentId, skillNode, score.');
  }

  const credentialId = crypto.randomUUID();
  const issuedAt = new Date().toISOString();

  // Payload portion to be signed
  const payload = {
    credentialId,
    studentId,
    studentName,
    skillNode,
    score: Number(score),
    targetRole,
    issuedAt
  };

  const canonicalStr = canonicalizePayload(payload);
  const privateKey = customPrivateKey || getPrivateKey();

  // Compute ECDSA P-256 digital signature over SHA-256 hash of canonical payload
  const sign = crypto.createSign('SHA256');
  sign.update(Buffer.from(canonicalStr, 'utf8'));
  sign.end();
  const signature = sign.sign(privateKey, 'base64');

  const credentialObj = {
    ...payload,
    signature
  };

  // Persist to store
  issuedCredentials.set(credentialId, credentialObj);

  return credentialObj;
}

/**
 * Verifies authenticity of an ECDSA signed credential.
 * Can be run offline using public key without database or server state.
 * 
 * @param {Object} credentialObj - Full credential object including signature
 * @param {string} [customPublicKey] - Optional public key override for unit testing
 * @returns {{ valid: boolean, payload?: Object, error?: string }} Verification result
 */
function verifyCredential(credentialObj, customPublicKey = null) {
  if (!credentialObj || typeof credentialObj !== 'object') {
    return { valid: false, error: 'Invalid credential format.' };
  }

  const { signature, ...payload } = credentialObj;

  if (!signature || typeof signature !== 'string') {
    return { valid: false, error: 'Missing or malformed digital signature.' };
  }

  // Ensure all required payload keys exist
  if (!payload.credentialId || !payload.studentId || !payload.skillNode || payload.score === undefined) {
    return { valid: false, error: 'Incomplete payload fields.' };
  }

  const canonicalStr = canonicalizePayload(payload);

  try {
    const publicKey = customPublicKey || getPublicKey();
    const verify = crypto.createVerify('SHA256');
    verify.update(Buffer.from(canonicalStr, 'utf8'));
    verify.end();

    const isValid = verify.verify(publicKey, signature, 'base64');

    if (isValid) {
      return {
        valid: true,
        payload
      };
    } else {
      // Security rule: Never echo back payload when valid is false
      return {
        valid: false,
        error: 'Cryptographic signature verification failed. Credential payload may be tampered.'
      };
    }
  } catch (err) {
    return {
      valid: false,
      error: `Verification error: ${err.message}`
    };
  }
}

/**
 * Retrieves an issued credential by ID.
 * 
 * @param {string} credentialId
 * @returns {Object|null}
 */
function getCredentialById(credentialId) {
  return issuedCredentials.get(credentialId) || null;
}

module.exports = {
  MIN_QUESTIONS_PER_NODE,
  isNodeProvable,
  canonicalizePayload,
  issueCredential,
  verifyCredential,
  getCredentialById,
  getPublicKey,
  issuedCredentials
};
