/**
 * SkillPath Cryptographic Credential Engine
 * Applied ECDSA P-256 (secp256r1) Digital Signatures (No LLMs).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { PROFICIENCY_THRESHOLD, generateGapReport } = require('./gapService');
const { getAssessmentStatus } = require('./eloService');

const { logAudit } = require('./auditLogger');

const MIN_QUESTIONS_PER_NODE = 2; // Min answered questions on a node to mint credential

// In-memory store for issued credentials (keyed by credentialId and userId)
const credentialsStore = new Map();
const userCredentialsMap = new Map();

// Credential Revocation Registry (keyed by credentialId)
const revocationRegistry = new Map();

/**
 * Loads private key from process.env (PRIVATE_KEY_PEM / PRIVATE_KEY) or /keys/private.pem
 */
function getPrivateKey() {
  // 1. Environment Variable Loading (for production secrets managers / Docker injection)
  const envKey = process.env.PRIVATE_KEY_PEM || process.env.PRIVATE_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
    return envKey.replace(/\\n/g, '\n');
  }

  // 2. File-based key loading
  const possiblePaths = [
    path.join(__dirname, '../../../keys/private.pem'),
    path.join(__dirname, '../../keys/private.pem'),
    path.join(process.cwd(), 'keys/private.pem')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, 'utf-8');
    }
  }

  // Fallback inline key generation for test isolation if file absent
  console.warn('[CredentialService Warning] private.pem not found on disk or env. Generating ephemeral fallback key pair.');
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  process.env._EPHEMERAL_PUBLIC_KEY = publicKey;
  return privateKey;
}

/**
 * Loads public key from process.env (PUBLIC_KEY_PEM / PUBLIC_KEY) or /keys/public.pem
 */
function getPublicKeyPem() {
  // 1. Environment Variable Loading
  const envKey = process.env.PUBLIC_KEY_PEM || process.env.PUBLIC_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
    return envKey.replace(/\\n/g, '\n');
  }

  // 2. Ephemeral fallback check
  if (process.env._EPHEMERAL_PUBLIC_KEY) {
    return process.env._EPHEMERAL_PUBLIC_KEY;
  }

  // 3. File-based key loading
  const possiblePaths = [
    path.join(__dirname, '../../../keys/public.pem'),
    path.join(__dirname, '../../keys/public.pem'),
    path.join(process.cwd(), 'keys/public.pem')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, 'utf-8');
    }
  }
  return null;
}

/**
 * Pure Function: Deterministically serializes payload by sorting keys alphabetically
 * Ensures 100% exact character-for-character match between signing and verifying.
 * 
 * @param {Object} obj 
 * @returns {string} Deterministic JSON string representation
 */
function serializePayload(obj) {
  if (!obj || typeof obj !== 'object') return '';
  
  // Omit signature and revocation fields when serializing payload for verification
  const keys = Object.keys(obj).filter(k => !['signature', 'revoked', 'revokedAt', 'revocationReason'].includes(k)).sort();
  const sortedObj = {};
  for (const key of keys) {
    sortedObj[key] = obj[key];
  }
  return JSON.stringify(sortedObj);
}

/**
 * Pure Function: Evaluates whether a skill node is eligible for credential minting
 * 
 * @param {Object} params
 * @param {number} params.rating - Learner's rating for the node
 * @param {number} params.questionsAnsweredOnNode - Count of questions answered on this node
 * @param {number} [params.threshold=1100] - Rating threshold
 * @param {number} [params.minQuestions=2] - Minimum questions required
 * @returns {boolean} True if provable and eligible
 */
function isNodeProvable({ rating, questionsAnsweredOnNode = 0, threshold = PROFICIENCY_THRESHOLD, minQuestions = MIN_QUESTIONS_PER_NODE }) {
  if (rating === undefined || rating === null) return false;
  return rating >= threshold && questionsAnsweredOnNode >= minQuestions;
}

/**
 * RATIONALE FOR CREDENTIAL REVOCATION:
 * Cryptographic ECDSA signatures guarantee authenticity and payload integrity at the exact moment of issuance.
 * However, a signature alone cannot reflect post-issuance state changes — such as credentials issued in administrative error,
 * academic dishonesty or fraud discovered post-facto, or key compromises.
 * Therefore, public verification MUST consult a revocation registry alongside signature validation
 * to ensure end-to-end credential trust.
 * 
 * @param {string} credentialId 
 * @param {string} reason 
 * @returns {{ success: boolean, credentialId: string, revokedAt: string }}
 */
function revokeCredential(credentialId, reason = 'Revoked by issuing authority') {
  if (!credentialId) {
    throw new Error('Missing credentialId for revocation.');
  }

  const revokedAt = new Date().toISOString();
  const revocationRecord = {
    credentialId,
    revoked: true,
    revokedAt,
    reason
  };

  revocationRegistry.set(credentialId, revocationRecord);

  // Update in-memory stored credential if present
  const stored = credentialsStore.get(credentialId);
  if (stored) {
    stored.revoked = true;
    stored.revokedAt = revokedAt;
    stored.revocationReason = reason;
  }

  logAudit({
    action: 'REVOKE',
    credentialId,
    studentId: stored?.studentId || 'N/A',
    skillNode: stored?.skillNode || 'N/A',
    outcome: 'SUCCESS',
    details: reason
  });

  return {
    success: true,
    credentialId,
    revokedAt,
    reason
  };
}

/**
 * Mints and cryptographically signs a credential using ECDSA P-256
 * 
 * @param {Object} params
 * @param {string} params.studentId
 * @param {string} params.studentName
 * @param {string} params.skillNode
 * @param {number} params.score
 * @param {string} params.targetRole
 * @returns {Object} Full signed credential object
 */
function issueCredential({ studentId = 'pro-user', studentName = 'Suraj Bhan Kumar', skillNode, score = 1250, targetRole = 'frontend-developer' }) {
  if (!skillNode) {
    throw new Error('Missing required parameter: skillNode.');
  }

  const credentialId = `cred-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const issuedAt = new Date().toISOString();

  const payload = {
    credentialId,
    studentId,
    studentName,
    skillNode,
    score: Number(score),
    targetRole,
    issuedAt
  };

  const serialized = serializePayload(payload);
  const privateKey = getPrivateKey();

  // Create ECDSA signature using SHA-256
  const sign = crypto.createSign('SHA256');
  sign.update(Buffer.from(serialized, 'utf-8'));
  sign.end();
  const signature = sign.sign(privateKey, 'base64');

  const fullCredential = {
    ...payload,
    revoked: false,
    signature
  };

  // Persist in memory store
  credentialsStore.set(credentialId, fullCredential);
  
  if (!userCredentialsMap.has(studentId)) {
    userCredentialsMap.set(studentId, []);
  }
  userCredentialsMap.get(studentId).push(fullCredential);

  logAudit({
    action: 'ISSUE',
    credentialId,
    studentId,
    skillNode,
    outcome: 'SUCCESS'
  });

  return fullCredential;
}

/**
 * Verifies authenticity & revocation status of a credential using ECDSA public key
 * 
 * @param {Object} credentialObject - Full credential object including signature
 * @param {string} [publicKeyOverride] - Optional PEM public key override for testing
 * @returns {{ valid: boolean, revoked?: boolean, payload?: Object, error?: string }} Verification result
 */
function verifyCredential(credentialObject, publicKeyOverride = null) {
  if (!credentialObject || typeof credentialObject !== 'object' || !credentialObject.signature) {
    logAudit({ action: 'VERIFY_FAILED', credentialId: credentialObject?.credentialId, outcome: 'FAILED', details: 'Malformed payload' });
    return { valid: false, error: 'Invalid credential payload structure or missing signature.' };
  }

  const { signature, revoked, revokedAt, revocationReason, ...payload } = credentialObject;
  const credentialId = payload.credentialId;

  // 1. Check Revocation Registry
  const revocationInfo = revocationRegistry.get(credentialId);
  if (revoked || credentialObject.revoked || revocationInfo) {
    const revAt = revokedAt || revocationInfo?.revokedAt || new Date().toISOString();
    logAudit({
      action: 'VERIFY_FAILED',
      credentialId,
      studentId: payload.studentId,
      skillNode: payload.skillNode,
      outcome: 'REVOKED',
      details: 'Credential revoked'
    });

    return {
      valid: false,
      revoked: true,
      revokedAt: revAt,
      error: 'Credential has been revoked by issuing authority.'
    };
  }

  // 2. Cryptographic Signature Verification
  const serialized = serializePayload(payload);

  const publicKey = publicKeyOverride || getPublicKeyPem();
  if (!publicKey) {
    logAudit({ action: 'VERIFY_FAILED', credentialId, outcome: 'FAILED', details: 'Public key missing' });
    return { valid: false, error: 'Public key unavailable for signature verification.' };
  }

  try {
    const verify = crypto.createVerify('SHA256');
    verify.update(Buffer.from(serialized, 'utf-8'));
    verify.end();

    const isValid = verify.verify(publicKey, Buffer.from(signature, 'base64'));

    if (isValid) {
      logAudit({
        action: 'VERIFY',
        credentialId,
        studentId: payload.studentId,
        skillNode: payload.skillNode,
        outcome: 'SUCCESS'
      });

      return {
        valid: true,
        revoked: false,
        payload
      };
    } else {
      logAudit({ action: 'VERIFY_FAILED', credentialId, outcome: 'FAILED', details: 'Signature mismatch' });
      // SECURITY: Do NOT leak payload on failure
      return {
        valid: false,
        error: 'Cryptographic signature verification failed. Credential may have been tampered with or issued by an untrusted key.'
      };
    }
  } catch (err) {
    logAudit({ action: 'VERIFY_FAILED', credentialId, outcome: 'FAILED', details: err.message });
    return {
      valid: false,
      error: `Signature verification error: ${err.message}`
    };
  }
}

/**
 * Fetches issued credential by ID
 */
function getCredentialById(credentialId) {
  return credentialsStore.get(credentialId) || null;
}

/**
 * Server-side evaluation to check eligibility and issue credential for a user
 */
function issueCredentialForUser(userId, skillNode) {
  const status = getAssessmentStatus(userId);
  let userRating = 1200;
  let questionsCount = 3;

  if (status && status.exists) {
    userRating = status.ratings ? status.ratings[skillNode] : 1000;
    const history = status.history || [];
    questionsCount = history.filter(h => h.skillNode === skillNode).length;
  } else {
    // Demo fallback for pro-user / mid-user
    if (userId === 'pro-user') {
      userRating = 1350;
      questionsCount = 4;
    } else if (userId === 'mid-user' && ['html', 'css', 'javascript', 'git'].includes(skillNode)) {
      userRating = 1150;
      questionsCount = 3;
    } else {
      userRating = 900;
      questionsCount = 0;
    }
  }

  const provable = isNodeProvable({
    rating: userRating,
    questionsAnsweredOnNode: questionsCount,
    threshold: PROFICIENCY_THRESHOLD,
    minQuestions: MIN_QUESTIONS_PER_NODE
  });

  if (!provable) {
    throw new Error(`User ${userId} does not meet requirements for ${skillNode}. Rating: ${userRating}, Questions: ${questionsCount}.`);
  }

  const userNameMap = {
    'pro-user': 'Suraj Bhan Kumar (Pro)',
    'mid-user': 'Alex Rivers (Mid)',
    'fresh-user': 'Morgan Lee (Fresh)'
  };

  return issueCredential({
    studentId: userId,
    studentName: userNameMap[userId] || 'Suraj Bhan Kumar',
    skillNode,
    score: userRating,
    targetRole: 'frontend-developer'
  });
}

/**
 * Bulk verification function for recruiters checking multiple candidate credentials
 * Accepts array of credential IDs or array of credential objects.
 * Reuses verifyCredential logic underneath.
 * 
 * @param {Array<string|Object>} credentialInputs 
 * @returns {{ totalCount: number, validCount: number, revokedCount: number, invalidCount: number, results: Array }}
 */
function bulkVerifyCredentials(credentialInputs = []) {
  if (!Array.isArray(credentialInputs)) {
    throw new Error('credentialInputs must be an array.');
  }

  const results = [];
  let validCount = 0;
  let revokedCount = 0;
  let invalidCount = 0;

  for (const input of credentialInputs) {
    if (!input) continue;

    let credObj = null;
    let inputId = typeof input === 'string' ? input.trim() : input.credentialId;

    if (typeof input === 'string') {
      credObj = getCredentialById(inputId);
      if (!credObj) {
        invalidCount++;
        results.push({
          credentialId: inputId,
          valid: false,
          revoked: false,
          status: 'NOT_FOUND',
          error: 'Credential ID not found in system registry.'
        });
        continue;
      }
    } else if (typeof input === 'object') {
      credObj = input;
    }

    const verifyRes = verifyCredential(credObj);
    const status = verifyRes.valid ? 'VALID' : verifyRes.revoked ? 'REVOKED' : 'INVALID';

    if (verifyRes.valid) validCount++;
    else if (verifyRes.revoked) revokedCount++;
    else invalidCount++;

    results.push({
      credentialId: credObj?.credentialId || inputId || 'N/A',
      studentName: credObj?.studentName || verifyRes.payload?.studentName || 'N/A',
      skillNode: credObj?.skillNode || verifyRes.payload?.skillNode || 'N/A',
      score: credObj?.score || verifyRes.payload?.score,
      valid: verifyRes.valid,
      revoked: verifyRes.revoked || false,
      status,
      error: verifyRes.error || null,
      issuedAt: credObj?.issuedAt || verifyRes.payload?.issuedAt
    });
  }

  return {
    totalCount: results.length,
    validCount,
    revokedCount,
    invalidCount,
    results
  };
}

module.exports = {
  MIN_QUESTIONS_PER_NODE,
  serializePayload,
  isNodeProvable,
  issueCredential,
  verifyCredential,
  revokeCredential,
  bulkVerifyCredentials,
  getCredentialById,
  getPublicKeyPem,
  issueCredentialForUser
};
