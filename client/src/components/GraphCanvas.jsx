import React, { useState } from 'react';

export default function GraphCanvas({ nodes = [], provenIds = [], gaps = [] }) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Map status for fast lookup
  const provenSet = new Set(provenIds.map(id => typeof id === 'object' ? id.id : id));
  const gapMap = new Map((gaps || []).map(g => [g.id, g.status]));

  function getNodeStatus(nodeId) {
    if (provenSet.has(nodeId)) return 'proven';
    return gapMap.get(nodeId) || 'untouched';
  }

  // Pre-calculate layered layout coordinates for nodes
  // Level 0: HTML, Git, Figma
  // Level 1: CSS, JS
  // Level 2: DOM, Responsive, REST API, TS, Tailwind, Vite
  // Level 3: React, Async JS, Web Security
  // Level 4: State Mgmt, Next.js, GraphQL, PWA, Micro-Frontends
  const layoutLevels = {
    'html': { level: 0, row: 0 },
    'git': { level: 0, row: 1 },
    'figma': { level: 0, row: 2 },

    'css': { level: 1, row: 0 },
    'javascript': { level: 1, row: 1 },

    'dom': { level: 2, row: 0 },
    'responsive-design': { level: 2, row: 1 },
    'rest-api': { level: 2, row: 2 },
    'typescript': { level: 2, row: 3 },
    'tailwind': { level: 2, row: 4 },

    'react': { level: 3, row: 0 },
    'async-js': { level: 3, row: 1 },
    'web-performance': { level: 3, row: 2 },

    'state-management': { level: 4, row: 0 },
    'nextjs': { level: 4, row: 1 },
    'graphql': { level: 4, row: 2 },
    'micro-frontends': { level: 4, row: 3 }
  };

  const svgWidth = 850;
  const svgHeight = 420;
  const levelSpacing = 160;
  const rowSpacing = 80;
  const startX = 70;
  const startY = 60;

  // Compute (x,y) positions for each node
  const nodePositions = {};
  const renderedNodes = nodes.filter(n => layoutLevels[n.id] !== undefined);

  renderedNodes.forEach(node => {
    const layout = layoutLevels[node.id];
    nodePositions[node.id] = {
      x: startX + layout.level * levelSpacing,
      y: startY + layout.row * rowSpacing,
      ...node
    };
  });

  // Build edges list (from prereq -> dependent)
  const edges = [];
  renderedNodes.forEach(node => {
    const targetPos = nodePositions[node.id];
    if (!targetPos) return;

    (node.prerequisites || []).forEach(prereqId => {
      const sourcePos = nodePositions[prereqId];
      if (sourcePos) {
        edges.push({
          id: `${prereqId}->${node.id}`,
          source: sourcePos,
          target: targetPos
        });
      }
    });
  });

  return (
    <div className="card-white" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
            🕸️ Interactive Skill Graph Topology
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Prerequisite DAG graph illustrating proven competencies vs active gaps.
          </p>
        </div>

        {/* Graph Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', fontWeight: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
            <span>Proven</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
            <span>Weak Gap</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6366f1' }} />
            <span>Untouched Gap</span>
          </div>
        </div>
      </div>

      {/* SVG Layout */}
      <div style={{ width: '100%', overflowX: 'auto', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem' }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', minWidth: '700px', height: 'auto' }}>
          
          <defs>
            <marker id="arrowhead" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
            </marker>
            <marker id="arrowhead-proven" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
          </defs>

          {/* Render Prerequisite Edges */}
          {edges.map(edge => {
            const isSourceProven = getNodeStatus(edge.source.id) === 'proven';
            const strokeColor = isSourceProven ? '#a7f3d0' : '#cbd5e1';
            const marker = isSourceProven ? 'url(#arrowhead-proven)' : 'url(#arrowhead)';

            return (
              <line
                key={edge.id}
                x1={edge.source.x}
                y1={edge.source.y}
                x2={edge.target.x}
                y2={edge.target.y}
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeDasharray={isSourceProven ? 'none' : '4 4'}
                markerEnd={marker}
              />
            );
          })}

          {/* Render Nodes */}
          {Object.values(nodePositions).map(node => {
            const status = getNodeStatus(node.id);
            const isSelected = selectedNode?.id === node.id;

            let fillColor = '#6366f1'; // untouched
            let strokeColor = '#4338ca';
            let iconText = '○';

            if (status === 'proven') {
              fillColor = '#10b981';
              strokeColor = '#047857';
              iconText = '✓';
            } else if (status === 'weak') {
              fillColor = '#f59e0b';
              strokeColor = '#b45309';
              iconText = '⚡';
            }

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNode(node)}
                style={{ cursor: 'pointer' }}
              >
                {/* Node Circle */}
                <circle
                  r={isSelected ? "22" : "18"}
                  fill={fillColor}
                  stroke={isSelected ? "#0f172a" : strokeColor}
                  strokeWidth={isSelected ? "3" : "2"}
                  style={{ transition: 'all 0.2s ease' }}
                />

                {/* Node Status Icon */}
                <text
                  textAnchor="middle"
                  dy="4"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="800"
                  pointerEvents="none"
                >
                  {iconText}
                </text>

                {/* Node Label Below */}
                <text
                  textAnchor="middle"
                  dy="34"
                  fill="#0f172a"
                  fontSize="11"
                  fontWeight="700"
                  pointerEvents="none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Card */}
      {selectedNode && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem 1.25rem',
          background: '#eff6ff',
          borderRadius: '10px',
          border: '1px solid #93c5fd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontWeight: 800, color: '#1e40af', fontSize: '1rem' }}>{selectedNode.label}</span>
              <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', background: '#dbeafe', borderRadius: '4px', color: '#1d4ed8', fontWeight: 700 }}>
                Status: {getNodeStatus(selectedNode.id).toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#3b82f6', marginTop: '0.25rem' }}>
              Prerequisites: {selectedNode.prerequisites?.length > 0 ? selectedNode.prerequisites.join(', ') : 'None (Foundational Node)'}
            </div>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
