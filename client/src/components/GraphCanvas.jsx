import React, { useState, useMemo, useRef } from 'react';

export default function GraphCanvas({ nodes = [], provenIds = [], gaps = [] }) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [layoutMode, setLayoutMode] = useState('dag'); // 'dag' | 'compact' | 'expanded'
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef(null);

  // Map status lookup
  const provenSet = useMemo(() => {
    return new Set((provenIds || []).map(id => typeof id === 'object' ? id.id : id));
  }, [provenIds]);

  const gapMap = useMemo(() => {
    return new Map((gaps || []).map(g => [g.id, g.status || 'weak']));
  }, [gaps]);

  const getNodeStatus = (nodeId) => {
    if (provenSet.has(nodeId)) return 'proven';
    return gapMap.get(nodeId) || 'untouched';
  };

  // Node Icon Mapping
  const getNodeIcon = (nodeId, label = '') => {
    const id = nodeId.toLowerCase();
    if (id.includes('html')) return '5';
    if (id.includes('css')) return '3';
    if (id === 'javascript' || id === 'js') return 'JS';
    if (id === 'typescript' || id === 'ts') return 'TS';
    if (id.includes('react')) return '⚛️';
    if (id.includes('python')) return '🐍';
    if (id.includes('sql') || id.includes('postgres') || id.includes('database')) return '🗄️';
    if (id.includes('node')) return '🟢';
    if (id.includes('git')) return '🔀';
    if (id.includes('figma')) return '🎨';
    if (id.includes('next')) return 'N';
    if (id.includes('docker')) return '🐳';
    if (id.includes('k8s') || id.includes('kubernetes')) return '☸️';
    if (id.includes('aws') || id.includes('cloud')) return '☁️';
    if (id.includes('stat') || id.includes('math')) return '∑';
    if (id.includes('api') || id.includes('rest')) return '☁️';
    if (id.includes('dom')) return '🔲';
    if (id.includes('responsive')) return '🖥️';
    if (id.includes('perf')) return '⚡';
    if (id.includes('state')) return '📦';
    if (id.includes('graph')) return '⚛️';
    if (id.includes('design') || id.includes('ui')) return '🎨';
    if (id.includes('pwa') || id.includes('mobile')) return '📱';
    if (id.includes('testing') || id.includes('test')) return '🧪';
    return label.slice(0, 2).toUpperCase() || '•';
  };

  // Calculate stats for summary cards
  const stats = useMemo(() => {
    let proven = 0;
    let weak = 0;
    let untouched = 0;
    nodes.forEach(n => {
      const s = getNodeStatus(n.id);
      if (s === 'proven') proven++;
      else if (s === 'weak') weak++;
      else untouched++;
    });
    return { proven, weak, untouched, total: nodes.length };
  }, [nodes, provenSet, gapMap]);

  // Categories list for filter dropdown
  const categories = useMemo(() => {
    const set = new Set(nodes.map(n => n.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [nodes]);

  // Compute Topological Rank (DAG column) for each node automatically
  const nodeRankMap = useMemo(() => {
    const ranks = {};
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    function getRank(nodeId, visited = new Set()) {
      if (ranks[nodeId] !== undefined) return ranks[nodeId];
      if (visited.has(nodeId)) return 0; // Prevent cyclic loops
      visited.add(nodeId);

      const node = nodeMap.get(nodeId);
      if (!node || !node.prerequisites || node.prerequisites.length === 0) {
        ranks[nodeId] = 0;
        return 0;
      }

      let maxPrereqRank = 0;
      for (const preId of node.prerequisites) {
        if (nodeMap.has(preId)) {
          const r = getRank(preId, new Set(visited));
          if (r > maxPrereqRank) maxPrereqRank = r;
        }
      }

      ranks[nodeId] = maxPrereqRank + 1;
      return ranks[nodeId];
    }

    nodes.forEach(n => getRank(n.id));
    return ranks;
  }, [nodes]);

  // Group nodes by Rank Layer
  const { nodePositions, maxRank, maxRowLength } = useMemo(() => {
    const ranks = {};
    nodes.forEach(n => {
      const r = nodeRankMap[n.id] || 0;
      if (!ranks[r]) ranks[r] = [];
      ranks[r].push(n);
    });

    const rankKeys = Object.keys(ranks).map(Number).sort((a, b) => a - b);
    const maxRankVal = rankKeys.length > 0 ? Math.max(...rankKeys) : 0;
    let maxRow = 1;

    // Spacing configuration based on layoutMode
    const colSpacing = layoutMode === 'expanded' ? 240 : layoutMode === 'compact' ? 170 : 200;
    const rowSpacing = layoutMode === 'expanded' ? 110 : layoutMode === 'compact' ? 85 : 95;
    const paddingX = 100;
    const paddingY = 80;

    const positions = {};

    rankKeys.forEach((r) => {
      const layerNodes = ranks[r];
      if (layerNodes.length > maxRow) maxRow = layerNodes.length;

      const layerHeight = (layerNodes.length - 1) * rowSpacing;
      const startY = paddingY + Math.max(0, (400 - layerHeight) / 2);

      layerNodes.forEach((node, rowIdx) => {
        positions[node.id] = {
          x: paddingX + r * colSpacing,
          y: startY + rowIdx * rowSpacing,
          rank: r,
          rowIdx,
          ...node
        };
      });
    });

    return {
      nodePositions: positions,
      maxRank: maxRankVal,
      maxRowLength: maxRow
    };
  }, [nodes, nodeRankMap, layoutMode]);

  // Calculate dynamic SVG canvas bounds
  const colSpacing = layoutMode === 'expanded' ? 240 : layoutMode === 'compact' ? 170 : 200;
  const svgWidth = Math.max(960, (maxRank + 1) * colSpacing + 200);
  const svgHeight = Math.max(520, maxRowLength * 100 + 160);

  // Build edges list with topological positions
  const edges = useMemo(() => {
    const edgeList = [];
    nodes.forEach(node => {
      const targetPos = nodePositions[node.id];
      if (!targetPos) return;

      (node.prerequisites || []).forEach(preId => {
        const sourcePos = nodePositions[preId];
        if (sourcePos) {
          edgeList.push({
            id: `${preId}->${node.id}`,
            sourceId: preId,
            targetId: node.id,
            source: sourcePos,
            target: targetPos
          });
        }
      });
    });
    return edgeList;
  }, [nodes, nodePositions]);

  // Selected Node Details & Connected Edges
  const selectedNode = selectedNodeId ? nodePositions[selectedNodeId] : null;

  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId) return new Set();
    const set = new Set([selectedNodeId]);
    edges.forEach(e => {
      if (e.sourceId === selectedNodeId) set.add(e.targetId);
      if (e.targetId === selectedNodeId) set.add(e.sourceId);
    });
    return set;
  }, [selectedNodeId, edges]);

  // Compute direct dependencies (prereqs) and dependent downstream skills for selected node
  const selectedDependencies = useMemo(() => {
    if (!selectedNode) return [];
    return (selectedNode.prerequisites || [])
      .map(id => nodePositions[id])
      .filter(Boolean);
  }, [selectedNode, nodePositions]);

  const selectedDependents = useMemo(() => {
    if (!selectedNodeId) return [];
    return edges
      .filter(e => e.sourceId === selectedNodeId)
      .map(e => e.target)
      .filter(Boolean);
  }, [selectedNodeId, edges, nodePositions]);

  // Handlers for Reset & Fit View
  const handleReset = () => {
    setSelectedNodeId(null);
    setSearchQuery('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setLayoutMode('dag');
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleFitView = () => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className={`space-y-5 transition-all ${isFullscreen ? 'fixed inset-0 z-50 bg-[#f8fafc] p-6 overflow-y-auto' : ''}`}>
      
      {/* 1. Header & Top Summary Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-black border border-blue-200 shadow-xs">
              🕸️
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Interactive Skill Graph Topology
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            DAG topology showing proven competencies vs gaps. Edge thickness and dash reflect sample confidence.
          </p>
        </div>

        {/* Top Summary Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm shrink-0">
              ✓
            </div>
            <div>
              <div className="text-base font-black text-slate-900 leading-none">{stats.proven}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Proven Skills</div>
            </div>
          </div>

          <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm shrink-0">
              !
            </div>
            <div>
              <div className="text-base font-black text-slate-900 leading-none">{stats.weak}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Weak Gaps</div>
            </div>
          </div>

          <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0">
              ○
            </div>
            <div>
              <div className="text-base font-black text-slate-900 leading-none">{stats.untouched}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Untouched</div>
            </div>
          </div>

          <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm shrink-0">
              📈
            </div>
            <div>
              <div className="text-base font-black text-slate-900 leading-none">{stats.total}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total Skills</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls & Filters Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Filter Inputs */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-100 border-0 font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-2.5 top-2 text-slate-400">🔍</span>
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 border-0 font-bold text-slate-700 cursor-pointer capitalize"
          >
            <option value="all">All Categories</option>
            {categories.filter(c => c !== 'all').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 border-0 font-bold text-slate-700 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="proven">Proven Only</option>
            <option value="weak">Weak Gaps</option>
            <option value="untouched">Untouched</option>
          </select>

          {/* Layout Selector */}
          <select
            value={layoutMode}
            onChange={(e) => setLayoutMode(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 border-0 font-bold text-slate-700 cursor-pointer"
          >
            <option value="dag">Layout: Hierarchical (DAG)</option>
            <option value="compact">Layout: Compact</option>
            <option value="expanded">Layout: Expanded</option>
          </select>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleFitView}
            className="px-3 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-extrabold flex items-center gap-1.5 transition-colors"
          >
            <span>🔍</span>
            <span>Fit View</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>🔄</span>
            <span>Reset</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
            title="Toggle Fullscreen Workspace"
          >
            {isFullscreen ? '✕' : '⛶'}
          </button>
        </div>
      </div>

      {/* 3. Main Workspace Grid: Graph Canvas (Left 8 cols) + Right Details & Legend (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Interactive SVG Canvas */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-3 sm:p-5 shadow-xs relative overflow-hidden">
          
          <div ref={canvasRef} className="w-full overflow-auto bg-[#f8fafc] rounded-2xl border border-slate-200/80 p-4 min-h-[480px]">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible select-none"
              style={{
                transform: `scale(${zoomScale}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: 'top left',
                transition: 'transform 0.2s ease-out'
              }}
            >
              <defs>
                {/* Arrowhead Markers for Directed DAG Edges */}
                <marker id="arrow-proven" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                </marker>
                <marker id="arrow-weak" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                </marker>
                <marker id="arrow-neutral" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                </marker>
              </defs>

              {/* Render Smooth Bezier Directed Curved Edges */}
              {edges.map(edge => {
                const sourceStatus = getNodeStatus(edge.sourceId);
                const targetStatus = getNodeStatus(edge.targetId);

                // Filter logic matching
                if (statusFilter === 'proven' && (sourceStatus !== 'proven' || targetStatus !== 'proven')) return null;
                if (statusFilter === 'weak' && sourceStatus !== 'weak' && targetStatus !== 'weak') return null;

                const isConnectedToSelected = selectedNodeId && (edge.sourceId === selectedNodeId || edge.targetId === selectedNodeId);
                const isDimmed = selectedNodeId && !isConnectedToSelected;

                let strokeColor = '#94a3b8';
                let markerId = 'url(#arrow-neutral)';

                if (sourceStatus === 'proven') {
                  strokeColor = '#10b981';
                  markerId = 'url(#arrow-proven)';
                } else if (sourceStatus === 'weak') {
                  strokeColor = '#f59e0b';
                  markerId = 'url(#arrow-weak)';
                }

                const sourceConf = edge.source.confidence !== undefined ? edge.source.confidence : 0.8;
                const isHighConf = sourceConf >= 0.7;

                // Bezier Curve Calculation
                const dx = (edge.target.x - edge.source.x) / 2;
                const pathD = `M ${edge.source.x} ${edge.source.y} C ${edge.source.x + dx} ${edge.source.y}, ${edge.target.x - dx} ${edge.target.y}, ${edge.target.x} ${edge.target.y}`;

                return (
                  <path
                    key={edge.id}
                    d={pathD}
                    fill="none"
                    stroke={isConnectedToSelected ? '#2563eb' : strokeColor}
                    strokeWidth={isConnectedToSelected ? '3' : isHighConf ? '2' : '1.5'}
                    strokeDasharray={isHighConf ? 'none' : '4 4'}
                    opacity={isDimmed ? 0.15 : isConnectedToSelected ? 1 : 0.6}
                    markerEnd={markerId}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Render Nodes */}
              {Object.values(nodePositions).map(node => {
                const status = getNodeStatus(node.id);

                // Apply Filters
                if (statusFilter !== 'all' && status !== statusFilter) return null;
                if (categoryFilter !== 'all' && node.category !== categoryFilter) return null;

                const matchesSearch = searchQuery && node.label.toLowerCase().includes(searchQuery.toLowerCase());
                const isSelected = selectedNodeId === node.id;
                const isConnected = connectedNodeIds.has(node.id);
                const isDimmed = selectedNodeId && !isConnected;

                let nodeRingColor = '#818cf8'; // untouched purple ring
                let nodeBgColor = '#ffffff';
                let badgeText = '';
                let badgeBg = '';

                if (status === 'proven') {
                  nodeRingColor = '#10b981';
                  badgeText = '✓';
                  badgeBg = '#10b981';
                } else if (status === 'weak') {
                  nodeRingColor = '#f59e0b';
                  badgeText = '!';
                  badgeBg = '#f59e0b';
                }

                const iconSymbol = getNodeIcon(node.id, node.label);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                    className="cursor-pointer transition-all duration-300"
                    opacity={isDimmed ? 0.25 : 1}
                  >
                    {/* Focus / Selection Glow */}
                    {isSelected && (
                      <circle
                        r="32"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="4"
                        className="animate-pulse"
                        opacity="0.8"
                      />
                    )}

                    {/* Search Highlight Circle */}
                    {matchesSearch && (
                      <circle
                        r="34"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeDasharray="4 4"
                      />
                    )}

                    {/* Outer Circle Container Ring */}
                    <circle
                      r="24"
                      fill={nodeBgColor}
                      stroke={isSelected ? '#2563eb' : nodeRingColor}
                      strokeWidth={isSelected ? '3.5' : '3'}
                      className="shadow-sm"
                    />

                    {/* Node Center Icon / Initials */}
                    <text
                      textAnchor="middle"
                      dy="5"
                      fill="#0f172a"
                      fontSize="13"
                      fontWeight="900"
                      pointerEvents="none"
                    >
                      {iconSymbol}
                    </text>

                    {/* Top Right Status Badge Circle */}
                    {badgeText && (
                      <g transform="translate(16, -16)">
                        <circle r="9" fill={badgeBg} stroke="#ffffff" strokeWidth="2" />
                        <text
                          textAnchor="middle"
                          dy="3.5"
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight="900"
                          pointerEvents="none"
                        >
                          {badgeText}
                        </text>
                      </g>
                    )}

                    {/* Skill Label Pill Directly Below Node (Zero Overlap) */}
                    <g transform="translate(0, 36)" pointerEvents="none">
                      <rect
                        x="-55"
                        y="-10"
                        width="110"
                        height="20"
                        rx="10"
                        fill="#ffffff"
                        stroke={isSelected ? '#2563eb' : '#e2e8f0'}
                        strokeWidth="1"
                        className="shadow-xs"
                      />
                      <text
                        textAnchor="middle"
                        dy="4"
                        fill="#0f172a"
                        fontSize="10"
                        fontWeight="800"
                      >
                        {node.label.length > 16 ? `${node.label.slice(0, 14)}..` : node.label}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[11px] text-slate-400 mt-2 flex justify-between items-center px-1">
            <span>💡 Click any node to inspect details and trace prerequisite pathways.</span>
            <span>DAG Rank Layers: {maxRank + 1}</span>
          </div>
        </div>

        {/* Right Sidebar Widgets: Legend & Node Details Panel */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Legend Widget */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Legend</h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-600 shrink-0" />
                <div>
                  <div className="font-extrabold text-slate-900">Proven</div>
                  <div className="text-[10px] text-slate-400">Completed and verified</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-amber-600 shrink-0" />
                <div>
                  <div className="font-extrabold text-slate-900">Weak Gap</div>
                  <div className="text-[10px] text-slate-400">Partially covered</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 border border-indigo-600 shrink-0" />
                <div>
                  <div className="font-extrabold text-slate-900">Untouched</div>
                  <div className="text-[10px] text-slate-400">Not started yet</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-3 text-slate-600">
                  <span className="w-6 border-t-2 border-slate-700" />
                  <span className="font-semibold text-[11px]">Strong Dependency</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="w-6 border-t-2 border-dashed border-slate-400" />
                  <span className="font-medium text-[11px]">Lower Confidence</span>
                </div>
              </div>
            </div>
          </div>

          {/* Node Details Panel Widget */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Node Details</h3>

            {selectedNode ? (
              <div className="space-y-4 animate-slide-up">
                {/* Node Title & Status Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 font-black text-lg flex items-center justify-center shrink-0 border border-amber-200">
                      {getNodeIcon(selectedNode.id, selectedNode.label)}
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">{selectedNode.label}</h4>
                      <span className="text-[11px] text-slate-400 capitalize">{selectedNode.category || 'General'}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold capitalize ${
                    getNodeStatus(selectedNode.id) === 'proven'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : getNodeStatus(selectedNode.id) === 'weak'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {getNodeStatus(selectedNode.id)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedNode.description || `Essential competency required for target role. Master prerequisites to build verified proficiency.`}
                </p>

                {/* Skill Level Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Skill Level</span>
                    <span className="text-blue-600 font-extrabold">
                      {getNodeStatus(selectedNode.id) === 'proven' ? '85%' : getNodeStatus(selectedNode.id) === 'weak' ? '45%' : '0%'}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        getNodeStatus(selectedNode.id) === 'proven' ? 'bg-emerald-500' : getNodeStatus(selectedNode.id) === 'weak' ? 'bg-amber-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: getNodeStatus(selectedNode.id) === 'proven' ? '85%' : getNodeStatus(selectedNode.id) === 'weak' ? '45%' : '5%' }}
                    />
                  </div>
                </div>

                {/* Stats Breakdown */}
                <div className="space-y-2 text-xs pt-1 border-t border-slate-100">
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Dependencies</span>
                    <span className="font-extrabold text-slate-900">{selectedDependencies.length}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Dependent Skills</span>
                    <span className="font-extrabold text-slate-900">{selectedDependents.length}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Category</span>
                    <span className="font-bold text-blue-600 capitalize">{selectedNode.category || 'General'}</span>
                  </div>
                </div>

                {/* View Learning Resources Action Button */}
                <a
                  href="#resources"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(`node-resource-${selectedNode.id}`) || document.getElementById('gap-resources-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Learning Resources</span>
                  <span>→</span>
                </a>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 space-y-2">
                <div className="text-3xl">👆</div>
                <div className="text-xs font-bold text-slate-700">No Skill Selected</div>
                <div className="text-[11px] leading-tight">
                  Click any node in the graph to inspect prerequisites, downstream dependents, and resources.
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
