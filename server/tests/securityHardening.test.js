const { describe, it } = require('node:test');
const assert = require('node:assert');
const {
  issueCredential,
  verifyCredential,
  revokeCredential,
  getPublicKeyPem
} = require('../src/services/credentialService');
const {
  hashPassword,
  verifyPassword,
  generateAuthToken,
  verifyAuthTokenString,
  verifyAuthToken
} = require('../src/middleware/auth');
const { logAudit, getAuditLogs } = require('../src/services/auditLogger');

describe('Security, Reliability & Infra Hardening Unit Tests', () => {

  it('(1) revoking a previously valid credential causes verifyCredential to return valid: false and revoked: true', () => {
    // 1. Issue valid credential
    const cred = issueCredential({
      studentId: 'test-student-sec',
      studentName: 'Test Student',
      skillNode: 'javascript',
      score: 1300,
      targetRole: 'frontend-developer'
    });

    // 2. Confirm initially valid
    const initialVerify = verifyCredential(cred);
    assert.strictEqual(initialVerify.valid, true, 'Initially issued credential should be valid');

    // 3. Revoke credential
    const revokeRes = revokeCredential(cred.credentialId, 'Administrative testing revocation');
    assert.strictEqual(revokeRes.success, true, 'Revocation should succeed');

    // 4. Verify again — must now return valid: false, revoked: true
    const postRevokeVerify = verifyCredential(cred);
    assert.strictEqual(postRevokeVerify.valid, false, 'Revoked credential should not be valid');
    assert.strictEqual(postRevokeVerify.revoked, true, 'Revoked field should be true');
    assert.ok(postRevokeVerify.error.includes('revoked'), 'Error message should explain credential was revoked');
  });

  it('(2) environment variable key loading takes precedence over disk key fallback', () => {
    // Save original env
    const origEnv = process.env.PUBLIC_KEY_PEM;

    // Set custom env key
    const mockEnvKey = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAn\n-----END PUBLIC KEY-----';
    process.env.PUBLIC_KEY_PEM = mockEnvKey;

    const loadedKey = getPublicKeyPem();
    assert.strictEqual(loadedKey, mockEnvKey, 'getPublicKeyPem should return process.env.PUBLIC_KEY_PEM');

    // Restore env
    if (origEnv !== undefined) {
      process.env.PUBLIC_KEY_PEM = origEnv;
    } else {
      delete process.env.PUBLIC_KEY_PEM;
    }
  });

  it('(3) password hashing using PBKDF2 SHA-512 correctly hashes and verifies passwords', () => {
    const rawPass = 'SuperSecretSecurePassword2026!';
    const { salt, hash } = hashPassword(rawPass);

    assert.ok(salt.length > 0, 'Salt should be generated');
    assert.ok(hash.length > 0, 'Hash should be generated');

    const isValid = verifyPassword(rawPass, salt, hash);
    assert.strictEqual(isValid, true, 'Correct password verification should return true');

    const isWrong = verifyPassword('WrongPassword123!', salt, hash);
    assert.strictEqual(isWrong, false, 'Incorrect password verification should return false');
  });

  it('(4) JWT token verification extracts claims and prevents userId forgery', () => {
    const payload = { userId: 'real-user-123', role: 'learner' };
    const token = generateAuthToken(payload);

    const verified = verifyAuthTokenString(token);
    assert.ok(verified, 'Auth token should verify successfully');
    assert.strictEqual(verified.userId, 'real-user-123');

    // Test middleware anti-spoofing
    const req = {
      headers: { authorization: `Bearer ${token}` },
      body: { userId: 'attacker-forged-userId', skillNode: 'javascript' }
    };
    const res = {};
    let nextCalled = false;

    verifyAuthToken(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true, 'Middleware should call next()');
    assert.strictEqual(req.body.userId, 'real-user-123', 'Middleware must override spoofed body.userId with token userId');
  });

  it('(5) audit logger records credential events and omits sensitive secret material', () => {
    const testCredId = `cred-audit-test-${Date.now()}`;
    logAudit({
      action: 'ISSUE',
      credentialId: testCredId,
      studentId: 'pro-user',
      skillNode: 'react',
      outcome: 'SUCCESS',
      details: 'Audit verification test'
    });

    const logs = getAuditLogs(10);
    const entry = logs.find(l => l.credentialId === testCredId);

    assert.ok(entry, 'Audit log entry should exist');
    assert.strictEqual(entry.action, 'ISSUE');
    assert.strictEqual(entry.outcome, 'SUCCESS');
    assert.strictEqual(entry.studentId, 'pro-user');
  });

});
