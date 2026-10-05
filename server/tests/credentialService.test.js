const { describe, it } = require('node:test');
const assert = require('node:assert');
const crypto = require('crypto');
const {
  isNodeProvable,
  issueCredential,
  verifyCredential,
  PROFICIENCY_THRESHOLD
} = require('../src/services/credentialService');

describe('Cryptographic ECDSA Credential Engine Unit Tests', () => {

  it('(a) a validly signed credential verifies as true', () => {
    const credential = issueCredential({
      studentId: 'test-student',
      studentName: 'Jane Doe',
      skillNode: 'react',
      score: 1350,
      targetRole: 'frontend-developer'
    });

    assert.ok(credential.credentialId, 'Credential should have credentialId');
    assert.ok(credential.signature, 'Credential should have ECDSA signature');

    const result = verifyCredential(credential);
    assert.strictEqual(result.valid, true);
    assert.ok(result.payload, 'Valid verification should include payload');
    assert.strictEqual(result.payload.studentName, 'Jane Doe');
    assert.strictEqual(result.payload.skillNode, 'react');
  });

  it('(b) a credential with a tampered field (e.g. score changed after signing) verifies as false', () => {
    const originalCred = issueCredential({
      studentId: 'test-student',
      studentName: 'John Smith',
      skillNode: 'javascript',
      score: 1150,
      targetRole: 'frontend-developer'
    });

    // Tamper with the score field from 1150 -> 1600!
    const tamperedCred = {
      ...originalCred,
      score: 1600
    };

    const result = verifyCredential(tamperedCred);
    assert.strictEqual(result.valid, false, 'Tampered credential MUST fail verification!');
    assert.strictEqual(result.payload, undefined, 'Payload MUST NOT be leaked on verification failure!');
    assert.ok(result.error, 'Error message should explain signature failure');
  });

  it('(c) a credential signed with a different key pair verifies as false', () => {
    // Generate a different ephemeral key pair
    const { privateKey: fakePrivateKey, publicKey: fakePublicKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'prime256v1',
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    // Issue a credential signed with the REAL key pair
    const realCred = issueCredential({
      studentId: 'test-student',
      studentName: 'Alice',
      skillNode: 'html',
      score: 1200,
      targetRole: 'frontend-developer'
    });

    // Verify realCred against the FAKE public key
    const result = verifyCredential(realCred, fakePublicKey);
    assert.strictEqual(result.valid, false, 'Verification against untrusted public key MUST fail!');
    assert.strictEqual(result.payload, undefined);
  });

  it('(d) the node-level pass check correctly rejects a learner below threshold or below minimum question count', () => {
    // Case 1: Rating >= threshold (1200), questions = 3 -> Pass
    assert.strictEqual(
      isNodeProvable({ rating: 1200, questionsAnsweredOnNode: 3, threshold: 1100, minQuestions: 2 }),
      true
    );

    // Case 2: Rating < threshold (1050), questions = 5 -> Reject (below threshold)
    assert.strictEqual(
      isNodeProvable({ rating: 1050, questionsAnsweredOnNode: 5, threshold: 1100, minQuestions: 2 }),
      false
    );

    // Case 3: Rating >= threshold (1400), questions = 1 -> Reject (below min questions)
    assert.strictEqual(
      isNodeProvable({ rating: 1400, questionsAnsweredOnNode: 1, threshold: 1100, minQuestions: 2 }),
      false
    );

    // Case 4: No rating -> Reject
    assert.strictEqual(
      isNodeProvable({ rating: undefined, questionsAnsweredOnNode: 0 }),
      false
    );
  });

});
