const { describe, it } = require('node:test');
const assert = require('node:assert');
const {
  PROFICIENCY_THRESHOLD,
  sortSkillsTopologically,
  generateGapReportPure
} = require('../src/services/gapService');

describe('Skill Gap Analysis & Topological Routing Unit Tests', () => {

  const sampleGraph = {
    role: 'frontend-developer',
    nodes: [
      { id: 'react', label: 'React', prerequisites: ['javascript', 'dom'], demandScore: 0.9 },
      { id: 'javascript', label: 'JavaScript', prerequisites: ['html'], demandScore: 0.8 },
      { id: 'html', label: 'HTML5', prerequisites: [], demandScore: 0.7 },
      { id: 'dom', label: 'DOM Manipulation', prerequisites: ['html', 'javascript'], demandScore: 0.5 }
    ]
  };

  it('(a) a learner with zero ratings gets every node as a gap in correct prerequisite order', () => {
    const emptyRatings = {};
    const report = generateGapReportPure(sampleGraph, emptyRatings, PROFICIENCY_THRESHOLD);

    assert.strictEqual(report.readinessPercent, 0);
    assert.strictEqual(report.proven.length, 0);
    assert.strictEqual(report.gaps.length, 4);

    // Verify topological order: html must precede javascript, javascript & dom must precede react
    const gapIds = report.gaps.map(g => g.id);

    const htmlIdx = gapIds.indexOf('html');
    const jsIdx = gapIds.indexOf('javascript');
    const domIdx = gapIds.indexOf('dom');
    const reactIdx = gapIds.indexOf('react');

    assert.ok(htmlIdx < jsIdx, `HTML (idx ${htmlIdx}) must precede JavaScript (idx ${jsIdx})`);
    assert.ok(jsIdx < reactIdx, `JavaScript (idx ${jsIdx}) must precede React (idx ${reactIdx})`);
    assert.ok(domIdx < reactIdx, `DOM (idx ${domIdx}) must precede React (idx ${reactIdx})`);
  });

  it('(b) a learner proven on all prerequisites but not the target node itself gets exactly that one gap', () => {
    const ratings = {
      html: 1300,
      javascript: 1250,
      dom: 1200
      // react is omitted or < 1100
    };

    const report = generateGapReportPure(sampleGraph, ratings, PROFICIENCY_THRESHOLD);

    assert.strictEqual(report.proven.length, 3);
    assert.deepStrictEqual(report.proven.sort(), ['dom', 'html', 'javascript']);
    assert.strictEqual(report.gaps.length, 1);
    assert.strictEqual(report.gaps[0].id, 'react');
    assert.strictEqual(report.gaps[0].status, 'untouched');
    assert.strictEqual(report.readinessPercent, 75); // 3 of 4 = 75%
  });

  it('(c) readinessPercent is computed correctly for a known small graph', () => {
    const smallGraph = {
      role: 'web-dev',
      nodes: [
        { id: 'n1', label: 'Node 1', prerequisites: [] },
        { id: 'n2', label: 'Node 2', prerequisites: ['n1'] },
        { id: 'n3', label: 'Node 3', prerequisites: ['n2'] },
        { id: 'n4', label: 'Node 4', prerequisites: ['n3'] }
      ]
    };

    const ratings = {
      n1: 1200,
      n2: 1150
      // n3 and n4 unproven
    };

    const report = generateGapReportPure(smallGraph, ratings, PROFICIENCY_THRESHOLD);

    // 2 proven out of 4 total nodes = 50%
    assert.strictEqual(report.provenCount, 2);
    assert.strictEqual(report.totalNodes, 4);
    assert.strictEqual(report.readinessPercent, 50);
  });

  it('correctly classifies weak vs untouched gaps', () => {
    const ratings = {
      html: 1200,     // proven (>= 1100)
      javascript: 950  // weak (< 1100)
      // dom and react are untouched
    };

    const report = generateGapReportPure(sampleGraph, ratings, PROFICIENCY_THRESHOLD);

    const jsGap = report.gaps.find(g => g.id === 'javascript');
    const reactGap = report.gaps.find(g => g.id === 'react');

    assert.strictEqual(jsGap.status, 'weak');
    assert.strictEqual(reactGap.status, 'untouched');
  });

});
