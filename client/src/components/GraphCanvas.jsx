import React, { useState, useMemo } from 'react';

/**
 * GraphCanvas Component
 * Interactive SVG DAG rendering skill nodes and prerequisite edges.
 * Color-codes Proven (Green), Weak (Amber), and Untouched (Slate) nodes.
 */
export default function GraphCanvas({ nodes = [], proven = [], gaps = [] }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  // Map nodes with their status and rating info
  const nodeStatusMap = useMemo(() => {
    const map = new Map();
    proven.forEach(p => map.set(p.id, { ...p, status: 'proven' }));
    gaps.forEach(g => map.set(g.id, { ...g, status: g.status || 'untouched' }));
    return map;
  }, [proven, gaps]);

  // Compute node topological levels for layer placement
  const layout = useMemo(() => {
    const nodeLevels = new Map();
    const allNodeIds = new Set(nodes.map(n => n.id));

    // Calculate level based on max distance from foundational nodes
    function getLevel(id, visited = new Set()) {
      if (nodeLevels.has(id)) return nodeLevels.get(id);
      if (visited.has(id)) return 0; // prevent cycles
      visited.add(id);

      const nodeObj = nodes.find(n => n.id === id);
      if (!nodeObj || !nodeObj.prerequisites || nodeObj.prerequisites.length === 0) {
        nodeLevels.set(id, 0);
        return 0;
      }

      let maxParentLevel = -1;
      for (const pId of nodeObj.prerequisites) {
        if (allNodeIds.has(pId)) {
          maxParentLevel = Math.max(maxParentLevel, getLevel(pId, new Set(visited)));
        }
      }

      const level = maxParentLevel + 1;
      nodeLevels.set(id, level);
      return level;
    }

    nodes.forEach(n => getLevel(n.id));

    // Group nodes by level
    const levelGroups = {};
    nodes.forEach(n => {
      const lvl = nodeLevels.get(n.id) || 0;
      if (!levelGroups[lvl]) levelGroups[lvl] = [];
      levelGroups[lvl].push(n);
    });

    // Calculate SVG positions
    const positions = new Map();
    const nodeWidth = 140;
    const nodeHeight = 50;
    const levelHeight = 110;
    const canvasWidth = 1100;

    Object.keys(levelGroups).forEach(lvlStr => {
      const lvl = parseInt(lvlStr, 10);
      const group = levelGroups[lvl];
      const count = group.length;
      const spacing = Math.min(180, canvasWidth / (count + 1));
      const startX = (canvasWidth - (count - 1) * spacing) / 2;

      group.forEach((node, idx) => {
        positions.set(node.id, {
          x: startX + idx * spacing,
          y: 60 + lvl * levelHeight,
          level: lvl
        });
      });
    });

    const maxLvl = Math.max(...Object.keys(levelGroups).map(Number), 0);
    const canvasHeight = Math.max(600, 140 + maxLvl * levelHeight);

    return { positions, canvasWidth, canvasHeight };
  }, [nodes]);

  // Edges definition
  const edges = useMemo(() => {
    const list = [];
    nodes.forEach(n => {
      if (n.prerequisites) {
        n.prerequisites.forEach(pId => {
          if (layout.positions.has(pId) && layout.positions.has(n.id)) {
            list.push({
              from: pId,
              to: n.id,
              id: `${pId}->${n.id}`
            });
          }
        });
      }
    });
    return list;
  }, [nodes, layout]);

  return (
    <div className="graph-canvas-container" style={{ overflowX: 'auto', background: '#090d16', borderRadius: '16px', border: '1px solid #1e293b', padding: '1rem', position: 'relative' }}>
      {/* Legend Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', padding: '0 0.5rem' }}>
        <h4 style={{ color: '#f8fafc', margin: 0, fontSize: '0.95rem' }}>Visual Skill Taxonomy Graph</h4>
        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            Proven (≥ 1100 Elo)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
            Weak (&lt; 1100 Elo)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#475569' }} />
            Untouched
          </span>
        </div>
      </div>

      <svg width={layout.canvasWidth} height={layout.canvasHeight} style={{ display: 'block', margin: '0 auto' }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
          </marker>
          <marker id="arrow-active" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
          </marker>
          <filter id="glow-proven" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Draw Edges */}
        {edges.map(edge => {
          const fromPos = layout.positions.get(edge.from);
          const toPos = layout.positions.get(edge.to);
          if (!fromPos || !toPos) return null;

          const isHighlighted = hoveredNode === edge.from || hoveredNode === edge.to;
          // Curve control points
          const dy = toPos.y - fromPos.y;
          const pathString = `M ${fromPos.x} ${fromPos.y + 20} C ${fromPos.x} ${fromPos.y + 20 + dy / 2}, ${toPos.x} ${toPos.y - 20 - dy / 2}, ${toPos.x} ${toPos.y - 20}`;

          return (
            <path
              key={edge.id}
              d={pathString}
              fill="none"
              stroke={isHighlighted ? '#38bdf8' : '#334155'}
              strokeWidth={isHighlighted ? 2.5 : 1.5}
              strokeDasharray={isHighlighted ? 'none' : '4 3'}
              markerEnd={isHighlighted ? 'url(#arrow-active)' : 'url(#arrow)'}
              style={{ transition: 'all 0.2s ease' }}
            />
          );
        })}

        {/* Draw Nodes */}
        {nodes.map(node => {
          const pos = layout.positions.get(node.id);
          if (!pos) return null;

          const statusData = nodeStatusMap.get(node.id) || { status: 'untouched', rating: 1000 };
          const status = statusData.status;
          const rating = statusData.rating || 1000;
          const isHovered = hoveredNode === node.id;

          let fillColor = '#1e293b';
          let strokeColor = '#475569';
          let textColor = '#cbd5e1';
          let statusBadge = '';

          if (status === 'proven') {
            fillColor = 'rgba(16, 185, 129, 0.15)';
            strokeColor = '#10b981';
            textColor = '#34d399';
            statusBadge = '✓';
          } else if (status === 'weak') {
            fillColor = 'rgba(245, 158, 11, 0.15)';
            strokeColor = '#f59e0b';
            textColor = '#fbbf24';
            statusBadge = '⚠';
          }

          return (
            <g
              key={node.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
            >
              <rect
                x="-65"
                y="-20"
                width="130"
                height="40"
                rx="8"
                fill={fillColor}
                stroke={isHovered ? '#38bdf8' : strokeColor}
                strokeWidth={isHovered ? 2.5 : 1.5}
                filter={status === 'proven' ? 'url(#glow-proven)' : undefined}
              />
              <text
                x="0"
                y="-2"
                textAnchor="middle"
                fill={isHovered ? '#ffffff' : textColor}
                fontSize="11"
                fontWeight="600"
                style={{ pointerEvents: 'none' }}
              >
                {node.label.length > 16 ? node.label.substring(0, 14) + '...' : node.label}
              </text>

              <text
                x="0"
                y="12"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="9"
                fontWeight="500"
                style={{ pointerEvents: 'none' }}
              >
                {statusBadge ? `${statusBadge} ${rating} Elo` : `${rating} Elo`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
