const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { generateGapReport, PROFICIENCY_THRESHOLD } = require('../src/services/gapService');

test('Report API & Resource Integrity Integration Tests', async (t) => {
  const skillGraphPath = path.join(__dirname, '../../data/skill_graph.json');
  const skillGraph = JSON.parse(fs.readFileSync(skillGraphPath, 'utf8'));

  await t.test('1. Full skill graph generates valid gap report with 100% real resource links', () => {
    const report = generateGapReport(skillGraph, {}, []);

    assert.equal(report.targetRole, 'frontend-developer');
    assert.equal(report.readinessPercent, 0);
    assert.equal(report.totalNodes, 34);
    assert.equal(report.gaps.length, 34);

    // Verify topological order across all 34 nodes
    const nodeOrderMap = new Map();
    report.gaps.forEach((g, idx) => {
      nodeOrderMap.set(g.id, idx);
    });

    report.gaps.forEach(g => {
      const gIndex = nodeOrderMap.get(g.id);
      (g.prerequisites || []).forEach(preId => {
        if (nodeOrderMap.has(preId)) {
          const preIndex = nodeOrderMap.get(preId);
          assert.ok(
            preIndex < gIndex,
            `Prerequisite '${preId}' (index ${preIndex}) must appear before '${g.id}' (index ${gIndex})`
          );
        }
      });
    });

    // Verify every resource URL is real and plausible
    report.gaps.forEach(g => {
      assert.ok(Array.isArray(g.resources), `Node ${g.id} must have a resources array`);
      assert.ok(g.resources.length > 0, `Node ${g.id} must have at least 1 curated resource`);
      g.resources.forEach(r => {
        assert.ok(r.title && r.title.length > 0, `Resource in ${g.id} missing title`);
        assert.ok(r.url && r.url.startsWith('http'), `Resource in ${g.id} has invalid URL: ${r.url}`);
        assert.notEqual(r.url.includes('example.com'), true, `Resource URL in ${g.id} cannot be placeholder example.com`);
        assert.ok(['docs', 'video', 'article', 'interactive'].includes(r.type), `Resource type '${r.type}' in ${g.id} invalid`);
      });
    });
  });

  await t.test('2. Readiness percentage updates dynamically as ratings increase', () => {
    const partialRatings = {
      html: 1150,
      css: 1200,
      javascript: 1100,
      git: 1150
    };

    const report = generateGapReport(skillGraph, partialRatings, []);

    assert.equal(report.provenCount, 4);
    assert.equal(report.readinessPercent, Math.round((4 / 34) * 100)); // 12%
    assert.equal(report.gaps.length, 30);
  });
});
