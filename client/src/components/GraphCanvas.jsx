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
  const layoutLevels = {
    // Frontend
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
    'micro-frontends': { level: 4, row: 3 },

    // Backend
    'linux': { level: 0, row: 0 },
    'nodejs': { level: 1, row: 0 },
    'python': { level: 1, row: 1 },
    'java': { level: 1, row: 2 },
    'sql': { level: 1, row: 3 },
    'express': { level: 2, row: 0 },
    'django': { level: 2, row: 1 },
    'fastapi': { level: 2, row: 2 },
    'spring-boot': { level: 2, row: 3 },
    'postgresql': { level: 2, row: 4 },
    'docker': { level: 3, row: 0 },
    'redis': { level: 3, row: 1 },
    'microservices': { level: 4, row: 0 },
    'kubernetes': { level: 4, row: 1 },
    'system-design': { level: 4, row: 2 },

    // Data Analyst
    'excel': { level: 0, row: 0 },
    'pandas': { level: 2, row: 0 },
    'numpy': { level: 2, row: 1 },
    'tableau': { level: 2, row: 2 },
    'power-bi': { level: 2, row: 3 },
    'statistics': { level: 2, row: 4 },
    'probability': { level: 3, row: 0 },
    'ab-testing': { level: 4, row: 0 },
    'eda': { level: 3, row: 1 },
    'scikit-learn': { level: 3, row: 2 },
    'machine-learning-basics': { level: 4, row: 1 },
    'data-cleaning': { level: 3, row: 3 },
    'data-warehousing': { level: 3, row: 4 },
    'etl-pipelines': { level: 3, row: 5 },
    'airflow': { level: 4, row: 2 }
  };

  const svgWidth = 850;
  const svgHeight = 440;
  const levelSpacing = 160;
  const rowSpacing = 75;
  const startX = 70;
  const startY = 55;

  // Filter nodes present in taxonomy layout or fallback dynamic layout
  const renderedNodes = nodes.filter(n => n.id);
  const nodePositions = {};

  renderedNodes.forEach((node, idx) => {
    const layout = layoutLevels[node.id] || { level: idx % 5, row: Math.floor(idx / 5) };
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
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h3 className="text-base font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>🕸️</span> Interactive Skill Graph Topology
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            DAG topology showing proven competencies vs gaps. Edge thickness & dash reflect sample confidence.
          </p>
        </div>

        {/* Graph Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50" />
            <span className="text-neutral-700 dark:text-neutral-300">Proven</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="text-neutral-700 dark:text-neutral-300">Weak Gap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
            <span className="text-neutral-700 dark:text-neutral-300">Untouched</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
            <span className="w-4 border-t-2 border-dashed border-neutral-400 inline-block" />
            <span>Lower Confidence</span>
          </div>
        </div>
      </div>

      {/* SVG Layout Wrapper */}
      <div className="w-full overflow-x-auto bg-neutral-50 dark:bg-neutral-950/60 rounded-xl border border-neutral-200 dark:border-neutral-800 p-2 sm:p-4">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full min-w-[700px] h-auto overflow-visible">
          
          <defs>
            <marker id="arrowhead" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-neutral-300 dark:fill-neutral-700" />
            </marker>
            <marker id="arrowhead-proven" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-emerald-500" />
            </marker>
          </defs>

          {/* Render Prerequisite Edges with Confidence Weighting */}
          {edges.map(edge => {
            const isSourceProven = getNodeStatus(edge.source.id) === 'proven';
            const strokeColor = isSourceProven ? '#10b981' : '#94a3b8';
            const marker = isSourceProven ? 'url(#arrowhead-proven)' : 'url(#arrowhead)';

            const sourceConf = edge.source.confidence !== undefined ? edge.source.confidence : 0.8;
            const isHighConf = sourceConf >= 0.7;
            const strokeWidth = isSourceProven ? (isHighConf ? '3' : '2') : (isHighConf ? '1.75' : '1');
            const strokeDasharray = isHighConf ? 'none' : '4 4';
            const opacity = isSourceProven ? (isHighConf ? 0.95 : 0.65) : (isHighConf ? 0.5 : 0.3);

            return (
              <line
                key={edge.id}
                x1={edge.source.x}
                y1={edge.source.y}
                x2={edge.target.x}
                y2={edge.target.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                opacity={opacity}
                markerEnd={marker}
                className="transition-all duration-300"
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
                tabIndex={0}
                role="button"
                aria-label={`Skill Node ${node.label}, Status ${status}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedNode(node);
                  }
                }}
                className="cursor-pointer group focus:outline-none"
              >
                {/* Subtle Pulse Glow Circle for Proven Nodes */}
                {status === 'proven' && (
                  <circle
                    r="24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    opacity="0.5"
                    className="animate-pulse-glow"
                  />
                )}

                {/* Node Circle */}
                <circle
                  r={isSelected ? "22" : "18"}
                  fill={fillColor}
                  stroke={isSelected ? "#000000" : strokeColor}
                  strokeWidth={isSelected ? "3" : "2"}
                  className="transition-all duration-300 group-hover:scale-110"
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
                  className="fill-neutral-900 dark:fill-neutral-100 font-bold text-[11px]"
                  pointerEvents="none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Card with Confidence Indicator */}
      {selectedNode && (
        <div className="mt-4 p-4 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-300 dark:border-primary-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-slide-up">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-primary-900 dark:text-primary-100 text-sm">{selectedNode.label}</span>
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-primary-200 text-primary-900 dark:bg-primary-900 dark:text-primary-200 capitalize">
                Status: {getNodeStatus(selectedNode.id)}
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-success-100 text-success-800 dark:bg-success-950 dark:text-success-200 border border-success-300">
                Confidence: {Math.round((selectedNode.confidence !== undefined ? selectedNode.confidence : 0.8) * 100)}% ({selectedNode.confidence >= 0.7 ? 'High Reliability' : 'Lower Sample Size'})
              </span>
            </div>
            <div className="text-xs text-primary-700 dark:text-primary-300 mt-1">
              Prerequisites: {selectedNode.prerequisites?.length > 0 ? selectedNode.prerequisites.join(', ') : 'None (Foundational Node)'}
            </div>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white text-lg font-bold p-1 self-end sm:self-auto"
            aria-label="Close details"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
