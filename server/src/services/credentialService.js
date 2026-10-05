/**
 * SkillPath Cryptographic Credential Engine
 * Applied ECDSA P-256 (secp256r1) Digital Signatures (No LLMs).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { PROFICIENCY_THRESHOLD, generateGapReport } = require('./gapService');
const { getAssessmentStatus } = require('./eloService');

const MIN_QUESTIONS_PER_NODE = 2; // Min answered questions on a node to mint credential

// In-memory store for issued credentials (keyed by credentialId and userId)
const credentialsStore = new Map();
const userCredentialsMap = new Map();

/**
 * Loads private key from /keys/private.pem
 */
function getPrivateKey() {
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
  console.warn('[CredentialService Warning] private.pem not found on disk. Generating ephemeral fallback key pair.');
  const { privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  return privateKey;
}

/**
 * Loads public key from /keys/public.pem
 */
function getPublicKeyPem() {
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
  
  // Omit signature field when serializing payload
  const keys = Object.keys(obj).filter(k => k !== 'signature').sort();
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
    signature
  };

  // Persist in memory store
  credentialsStore.set(credentialId, fullCredential);
  
  if (!userCredentialsMap.has(studentId)) {
    userCredentialsMap.set(studentId, []);
  }
  userCredentialsMap.get(studentId).push(fullCredential);

  return fullCredential;
}

/**
 * Verifies authenticity of a credential using ECDSA public key
 * 
 * @param {Object} credentialObject - Full credential object including signature
 * @param {string} [publicKeyOverride] - Optional PEM public key override for testing
 * @returns {{ valid: boolean, payload?: Object, error?: string }} Verification result
 */
function verifyCredential(credentialObject, publicKeyOverride = null) {
  if (!credentialObject || typeof credentialObject !== 'object' || !credentialObject.signature) {
    return { valid: false, error: 'Invalid credential payload structure or missing signature.' };
  }

  const { signature, ...payload } = credentialObject;
  const serialized = serializePayload(payload);

  const publicKey = publicKeyOverride || getPublicKeyPem();
  if (!publicKey) {
    return { valid: false, error: 'Public key unavailable for signature verification.' };
  }

  try {
    const verify = crypto.createVerify('SHA256');
    verify.update(Buffer.from(serialized, 'utf-8'));
    verify.end();

    const isValid = verify.verify(publicKey, Buffer.from(signature, 'base64'));

    if (isValid) {
      return {
        valid: true,
        payload
      };
    } else {
      // SECURITY: Do NOT leak payload on failure
      return {
        valid: false,
        error: 'Cryptographic signature verification failed. Credential may have been tampered with or issued by an untrusted key.'
      };
    }
  } catch (err) {
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

module.exports = {
  MIN_QUESTIONS_PER_NODE,
  serializePayload,
  isNodeProvable,
  issueCredential,
  verifyCredential,
  getCredentialById,
  getPublicKeyPem,
  issueCredentialForUser
};
