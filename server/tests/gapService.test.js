const test = require('node:test');
const assert = require('node:assert/strict');
const { generateGapReport, PROFICIENCY_THRESHOLD, topologicalSortNodes } = require('../src/services/gapService');

test('Gap Service Unit Tests', async (t) => {
  // Mock graph: HTML (no prereqs) -> JS (prereq: html) -> React (prereq: js)
  const mockGraph = {
    role: 'frontend-developer',
    title: 'Frontend Developer',
    nodes: [
      { id: 'react', label: 'React', prerequisites: ['javascript'], demandScore: 0.9, resources: [] },
      { id: 'javascript', label: 'JavaScript', prerequisites: ['html'], demandScore: 0.8, resources: [] },
      { id: 'html', label: 'HTML5', prerequisites: [], demandScore: 0.7, resources: [] }
    ]
  };

  await t.test('(a) Learner with zero ratings gets every node as a gap in correct prerequisite order', () => {
    const report = generateGapReport(mockGraph, {}, []);

    assert.equal(report.readinessPercent, 0);
    assert.equal(report.proven.length, 0);
    assert.equal(report.gaps.length, 3);

    // Verify topological order: html must come before javascript, javascript before react
    const gapIds = report.gaps.map(g => g.id);
    const htmlIdx = gapIds.indexOf('html');
    const jsIdx = gapIds.indexOf('javascript');
    const reactIdx = gapIds.indexOf('react');

    assert.ok(htmlIdx < jsIdx, 'html must precede javascript in gap list');
    assert.ok(jsIdx < reactIdx, 'javascript must precede react in gap list');
  });

  await t.test('(b) Learner proven on all prerequisites but not target node gets exactly that target node as gap', () => {
    const learnerRatings = {
      html: 1200,       // >= 1100 (proven)
      javascript: 1150, // >= 1100 (proven)
      react: 1000       // < 1100 (untouched/weak)
    };

    const report = generateGapReport(mockGraph, learnerRatings, []);

    assert.equal(report.proven.length, 2);
    assert.equal(report.gaps.length, 1);
    assert.equal(report.gaps[0].id, 'react', 'Only react should remain in the gap list');
  });

  await t.test('(c) readinessPercent is computed correctly for a known graph', () => {
    const learnerRatings = {
      html: 1150 // 1 out of 3 proven = 33%
    };

    const report = generateGapReport(mockGraph, learnerRatings, []);

    assert.equal(report.readinessPercent, 33);
    assert.equal(report.provenCount, 1);
    assert.equal(report.totalNodes, 3);
  });
});
