import React, { useEffect, useState } from 'react';
import { fetchSkillGraph } from '../api/client';
import { CardGridSkeleton } from '../components/SkeletonLoader';

const ROLE_OPTIONS = [
  { id: 'frontend-developer', title: '🎨 Frontend Developer', desc: 'React, TypeScript, CSS3, DOM, Responsive Web, REST APIs' },
  { id: 'backend-developer', title: '⚙️ Backend Developer', desc: 'Node.js, Python, Express, SQL, PostgreSQL, Docker, Microservices' },
  { id: 'data-analyst', title: '📊 Data Analyst', desc: 'Python, Pandas, SQL, Tableau, Power BI, Statistics, A/B Testing' }
];

export default function Landing({ targetRole = 'frontend-developer', onSelectRole, onNavigate }) {
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGraph = () => {
    setLoading(true);
    setError(null);
    fetchSkillGraph(targetRole)
      .then(data => {
        setGraph(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching skill graph:', err);
        setError(`Failed to fetch real-time market skill taxonomy graph for ${targetRole}.`);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadGraph();
  }, [targetRole]);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2 sm:pt-6">
        <div className="lg:col-span-7 space-y-6">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-100 text-accent-700 dark:bg-accent-950 dark:text-accent-300 border border-accent-200 dark:border-accent-800 text-xs font-extrabold uppercase tracking-wider">
            <span>🎓</span> SKILLPATH — SDG 4 TRACK
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
            Job-Demand-Driven <br />
            <span className="text-primary-600 dark:text-primary-400">Skill Assessment &</span> <br />
            <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-500 bg-clip-text text-transparent">
              Verifiable Credentialing
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl">
            Bridge the gap between college education and industry hiring demand with objective, deterministic skill measurement across multiple tech engineering tracks.
          </p>

          {/* Role Selector Cards */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              SELECT TARGET ROLE PATHWAY:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {ROLE_OPTIONS.map(r => (
                <button
                  key={r.id}
                  onClick={() => onSelectRole && onSelectRole(r.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    targetRole === r.id
                      ? 'bg-primary-50 dark:bg-primary-950/80 border-primary-500 ring-2 ring-primary-500/20 font-bold'
                      : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-extrabold text-neutral-900 dark:text-white">{r.title}</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => onNavigate && onNavigate('assessment')}
              className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 shadow-lg shadow-primary-500/25 dark:shadow-primary-900/40 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 active:translate-y-0"
            >
              ⚡ Take Adaptive Assessment
            </button>

            <button
              onClick={() => onNavigate && onNavigate('report')}
              className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-neutral-800 dark:text-neutral-100 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              🎯 View Skill Gap Report
            </button>

            <button
              onClick={() => onNavigate && onNavigate('verify')}
              className="px-5 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-success-600 hover:bg-success-500 shadow-md shadow-success-600/20 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-success-500"
            >
              🛡️ Verify Credential
            </button>
          </div>

          {/* Deterministic Banner */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-success-50 dark:bg-success-950/40 border border-success-200 dark:border-success-900/60 text-success-800 dark:text-success-200 text-xs sm:text-sm">
            <span className="text-xl">⚡</span>
            <div>
              <strong className="font-extrabold">100% Deterministic & LLM-Free:</strong> Zero GPT/LLM APIs. Applied Elo psychometrics, TF-IDF NLP keyword extraction, and ECDSA P-256 signatures.
            </div>
          </div>
        </div>

        {/* Right Hero Graphic Mockup */}
        <div className="lg:col-span-5 relative">
          <div className="relative bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-900/5 dark:shadow-none">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-danger-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-warning-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-success-500 inline-block" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-success-100 text-success-800 dark:bg-success-950 dark:text-success-300 flex items-center gap-1 border border-success-200 dark:border-success-800">
                <span>✓</span> ECDSA VERIFIED
              </span>
            </div>

            {/* Line Chart Mockup */}
            <div className="bg-neutral-100 dark:bg-neutral-800/60 rounded-2xl p-4 mb-6">
              <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 tracking-wider uppercase mb-2">
                LIVE ELO RATING PROGRESSION
              </div>
              <svg viewBox="0 0 300 80" className="w-full h-20 overflow-visible">
                <path
                  d="M0 60 Q 60 50, 120 20 T 240 30 T 300 10"
                  fill="none"
                  className="stroke-primary-600 dark:stroke-primary-400"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="300" cy="10" r="5" className="fill-primary-600 dark:fill-primary-400 animate-pulse" />
              </svg>
            </div>

            {/* Skill Credential Card Preview */}
            <div className="bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                  <span>🛡️</span> SKILL CREDENTIAL
                </div>
                <div className="text-base font-extrabold text-neutral-900 dark:text-white mt-1 capitalize">
                  {targetRole.replace('-', ' ')}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  ECDSA P-256 Signed • 1420 Elo
                </div>
              </div>

              <div className="w-12 h-12 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center text-xl shrink-0 font-bold">
                📷
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
            Why SkillPath is Different
          </h2>
          <div className="w-12 h-1 bg-primary-600 rounded-full mx-auto" />
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Engineered from ground-up using real job posting data and mathematical Elo scoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 border-b-4 border-b-primary-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center text-2xl mb-4">
              📊
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
              Built from Real Job Postings
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Extracted automatically from market demand datasets, keeping skill requirements aligned with real industry needs.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 border-b-4 border-b-warning-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-warning-50 dark:bg-warning-950/60 text-warning-600 dark:text-warning-400 flex items-center justify-center text-2xl mb-4">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
              Adaptive Elo Psychometrics
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Chess-like rating updates that dynamically adjust difficulty after every question to reach precise skill estimates.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 border-b-4 border-b-success-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-success-50 dark:bg-success-950/60 text-success-600 dark:text-success-400 flex items-center justify-center text-2xl mb-4">
              🛡️
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
              ECDSA Cryptographic Credentials
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Tamper-proof credentials signed with ECDSA P-256 keys, instantly verifiable by recruiters without database calls.
            </p>
          </div>
        </div>
      </section>

      {/* Extracted Industry Skill Graph & Market Demand */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
            Industry Skill Taxonomy & Demand Scores ({graph?.nodes?.length || 0} skills)
          </h2>
          <div className="w-12 h-1 bg-primary-600 rounded-full mx-auto" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Real market demand weightings extracted for <strong className="capitalize text-neutral-900 dark:text-white">{targetRole.replace('-', ' ')}</strong>.
          </p>
        </div>

        {loading ? (
          <CardGridSkeleton count={6} />
        ) : error ? (
          <div className="bg-danger-50 dark:bg-danger-950/40 border border-danger-200 dark:border-danger-900/60 rounded-2xl p-6 text-center space-y-3">
            <div className="text-3xl">⚠️</div>
            <h3 className="font-bold text-danger-800 dark:text-danger-200 text-lg">Failed to Load Taxonomy</h3>
            <p className="text-sm text-danger-600 dark:text-danger-300">{error}</p>
            <button
              onClick={loadGraph}
              className="px-4 py-2 bg-danger-600 text-white rounded-lg text-sm font-bold hover:bg-danger-500 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : graph && graph.nodes ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {graph.nodes.map((node) => (
              <div
                key={node.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:border-primary-400 dark:hover:border-primary-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                      {node.label}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 border border-primary-200 dark:border-primary-800 capitalize shrink-0">
                      {node.category}
                    </span>
                  </div>

                  <div className="space-y-1.5 my-3">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-neutral-500 dark:text-neutral-400">Industry Demand Score</span>
                      <span className="text-success-600 dark:text-success-400 font-extrabold">
                        {(node.demandScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-success-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(node.demandScore * 100, 5)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-neutral-400">
                      <span>Sample Reliability Confidence</span>
                      <span className="font-bold">{Math.round((node.confidence || 0.8) * 100)}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
                  {node.prerequisites && node.prerequisites.length > 0 ? (
                    <div>
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">Prereqs: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {node.prerequisites.map((reqId) => (
                          <span
                            key={reqId}
                            className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] font-mono"
                          >
                            {reqId}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="italic text-neutral-400 dark:text-neutral-500">Foundational skill (no prerequisites)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
