const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const {
  isNodeProvable,
  issueCredential,
  verifyCredential,
  MIN_QUESTIONS_PER_NODE,
  canonicalizePayload
} = require('../src/services/credentialService');
const { PROFICIENCY_THRESHOLD } = require('../src/services/gapService');

test('Credential Service Unit & Security Tests', async (t) => {
  await t.test('(a) A validly signed credential verifies as true', () => {
    const issued = issueCredential({
      studentId: 'student-123',
      studentName: 'Alice Student',
      skillNode: 'javascript',
      score: 1250,
      targetRole: 'frontend-developer'
    });

    assert.ok(issued.signature, 'Issued credential must contain signature');
    assert.equal(issued.skillNode, 'javascript');

    const result = verifyCredential(issued);
    assert.equal(result.valid, true, 'Validly signed credential must verify as true');
    assert.ok(result.payload, 'Valid verification should include payload');
    assert.equal(result.payload.credentialId, issued.credentialId);
  });

  await t.test('(b) A credential with a tampered field verifies as false and leaks no payload', () => {
    const issued = issueCredential({
      studentId: 'student-123',
      studentName: 'Bob Student',
      skillNode: 'react',
      score: 1150
    });

    // Tamper with score (change 1150 -> 1600)
    const tamperedScore = { ...issued, score: 1600 };
    const resultScore = verifyCredential(tamperedScore);
    assert.equal(resultScore.valid, false, 'Tampered score must fail verification');
    assert.equal(resultScore.payload, undefined, 'Must NOT leak payload on verification failure');

    // Tamper with student name
    const tamperedName = { ...issued, studentName: 'Eve Hacker' };
    const resultName = verifyCredential(tamperedName);
    assert.equal(resultName.valid, false, 'Tampered name must fail verification');
  });

  await t.test('(c) A credential signed with a different key pair verifies as false', () => {
    // Generate a rogue key pair
    const rogueKeys = crypto.generateKeyPairSync('ec', {
      namedCurve: 'prime256v1',
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    // Sign credential with rogue private key
    const rogueCredential = issueCredential({
      studentId: 'student-123',
      studentName: 'Charlie Student',
      skillNode: 'git',
      score: 1200
    }, rogueKeys.privateKey);

    // Verify against standard system public key
    const result = verifyCredential(rogueCredential);
    assert.equal(result.valid, false, 'Credential signed with wrong key pair must fail verification');
  });

  await t.test('(d) Node-level pass check correctly rejects learners below threshold or question count', () => {
    // Below threshold, enough questions
    assert.equal(
      isNodeProvable({ rating: 1050, questionCount: 4 }),
      false,
      'Rating 1050 < 1100 must fail pass check'
    );

    // Above threshold, insufficient questions
    assert.equal(
      isNodeProvable({ rating: 1200, questionCount: 2 }),
      false,
      'Question count 2 < 3 must fail pass check'
    );

    // Both criteria satisfied
    assert.equal(
      isNodeProvable({ rating: PROFICIENCY_THRESHOLD, questionCount: MIN_QUESTIONS_PER_NODE }),
      true,
      'Rating >= 1100 AND questions >= 3 must pass check'
    );
  });
});
