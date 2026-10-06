const { describe, it } = require('node:test');
const assert = require('node:assert');
const {
  searchDiscoverableLearners,
  setUserDiscoverability,
  getPublicProfile,
  usersStore
} = require('../src/services/userService');
const {
  issueCredential,
  revokeCredential,
  bulkVerifyCredentials
} = require('../src/services/credentialService');
const { getAdminAnalytics } = require('../src/services/adminAnalyticsService');

describe('Recruiter Layer & Ecosystem Features Unit Tests', () => {

  it('(1) searchDiscoverableLearners correctly filters by skill/role and strictly excludes non-discoverable learners', () => {
    // pro-user and mid-user are discoverable (true). fresh-user is discoverable (false).
    setUserDiscoverability('pro-user', true);
    setUserDiscoverability('mid-user', true);
    setUserDiscoverability('fresh-user', false);

    const allDiscoverable = searchDiscoverableLearners({ skill: '', role: 'all' });
    const usernames = allDiscoverable.map(u => u.username);

    assert.ok(usernames.includes('surajbhan'), 'pro-user (surajbhan) should be present');
    assert.ok(usernames.includes('alexrivers'), 'mid-user (alexrivers) should be present');
    assert.strictEqual(
      usernames.includes('morganlee'),
      false,
      'fresh-user (morganlee) MUST be excluded because isPubliclyDiscoverable is false'
    );
  });

  it('(2) learner who opts out of discoverability is genuinely excluded from search and public profile access', () => {
    // Opt-out pro-user
    setUserDiscoverability('pro-user', false);

    const searchResults = searchDiscoverableLearners({ skill: 'react', role: 'all' });
    const foundPro = searchResults.some(u => u.userId === 'pro-user');
    assert.strictEqual(foundPro, false, 'Opted-out pro-user must NOT be returned in search results');

    const profileRes = getPublicProfile('surajbhan');
    assert.strictEqual(profileRes.discoverable, false, 'Public profile access must return discoverable: false when opted out');

    // Opt back in
    setUserDiscoverability('pro-user', true);
    const postOptInProfile = getPublicProfile('surajbhan');
    assert.strictEqual(postOptInProfile.discoverable, true, 'Profile must be accessible after opting back in');
  });

  it('(3) bulkVerifyCredentials correctly handles a mixed batch of valid, tampered, missing, and revoked credentials in one pass', () => {
    // 1. Valid Credential
    const validCred = issueCredential({
      studentId: 'pro-user',
      studentName: 'Suraj Bhan Kumar',
      skillNode: 'javascript',
      score: 1400
    });

    // 2. Revoked Credential
    const revokedCred = issueCredential({
      studentId: 'pro-user',
      studentName: 'Suraj Bhan Kumar',
      skillNode: 'react',
      score: 1350
    });
    revokeCredential(revokedCred.credentialId, 'Testing bulk revocation');

    // 3. Tampered Invalid Credential
    const tamperedCred = {
      ...validCred,
      credentialId: 'cred-tampered-fake-123',
      score: 1800 // score altered after signing
    };

    // 4. Missing Credential ID
    const missingId = 'cred-non-existent-999';

    const batchInput = [validCred.credentialId, revokedCred.credentialId, tamperedCred, missingId];
    const summary = bulkVerifyCredentials(batchInput);

    assert.strictEqual(summary.totalCount, 4, 'Total batch count should be 4');
    assert.strictEqual(summary.validCount, 1, 'Should have exactly 1 valid credential');
    assert.strictEqual(summary.revokedCount, 1, 'Should have exactly 1 revoked credential');
    assert.strictEqual(summary.invalidCount, 2, 'Should have 2 invalid/missing items');

    const validRes = summary.results.find(r => r.credentialId === validCred.credentialId);
    assert.strictEqual(validRes.valid, true);

    const revokedRes = summary.results.find(r => r.credentialId === revokedCred.credentialId);
    assert.strictEqual(revokedRes.revoked, true);

    const missingRes = summary.results.find(r => r.credentialId === missingId);
    assert.strictEqual(missingRes.status, 'NOT_FOUND');
  });

  it('(4) getAdminAnalytics returns aggregate non-PII metrics and skill demand rankings', () => {
    const analytics = getAdminAnalytics();

    assert.ok(analytics.overview, 'Analytics should return overview');
    assert.ok(analytics.overview.totalLearners >= 1, 'Total learners should be >= 1');
    assert.ok(analytics.topInDemandSkills.length > 0, 'Should return top in-demand skills');
    assert.ok(analytics.readinessDistribution, 'Should return readiness distribution breakdown');
  });

});
