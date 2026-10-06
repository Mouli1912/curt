import React, { useState, useEffect } from 'react';
import { fetchAdminMetrics, fetchIntegrityReport, fetchCalibration } from '../api/client';

export default function AdminView() {
  const [metrics, setMetrics] = useState(null);
  const [integrity, setIntegrity] = useState(null);
  const [calibration, setCalibration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = () => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchAdminMetrics().catch(() => null),
      fetchIntegrityReport().catch(() => null),
      fetchCalibration().catch(() => null)
    ])
      .then(([metricsData, integrityData, calibrationData]) => {
        setMetrics(metricsData);
        setIntegrity(integrityData);
        setCalibration(calibrationData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load admin metrics:', err);
        setError('Failed to connect to Admin Debug endpoints.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded-xl w-64 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-neutral-100 dark:bg-neutral-800/60 rounded-2xl animate-pulse" />
          <div className="h-32 bg-neutral-100 dark:bg-neutral-800/60 rounded-2xl animate-pulse" />
          <div className="h-32 bg-neutral-100 dark:bg-neutral-800/60 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="bg-danger-50 dark:bg-danger-950/40 border border-danger-200 dark:border-danger-900/60 rounded-2xl p-8 space-y-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-bold text-danger-800 dark:text-danger-200">Admin Dashboard Error</h2>
          <p className="text-sm text-danger-600 dark:text-danger-300">{error}</p>
          <button
            onClick={loadData}
            className="px-6 py-2.5 bg-danger-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-danger-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const cal = calibration || metrics?.calibrationHealth || {};

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xl font-extrabold border border-primary-200 dark:border-primary-800">
              🛠️
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Assessment Engine Admin & Debug Audit
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            2PL IRT item calibration health, session standard error convergence, and privacy-first integrity telemetry.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-bold border border-neutral-300 dark:border-neutral-700 transition-colors self-start sm:self-auto"
        >
          🔄 Refresh Telemetry
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
          <div className="text-xs font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Total Sessions
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white">
            {metrics?.totalSessions || 0}
          </div>
          <div className="text-[11px] text-neutral-400">
            Completed: {metrics?.completedSessions || 0} ({metrics?.completionRate || 0}%)
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
          <div className="text-xs font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Questions Answered
          </div>
          <div className="text-3xl font-black text-primary-600 dark:text-primary-400">
            {metrics?.totalQuestionsAnswered || 0}
          </div>
          <div className="text-[11px] text-neutral-400">
            Avg per session: {metrics?.avgQuestionsPerSession || 0}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
          <div className="text-xs font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Item Calibration (2PL)
          </div>
          <div className="text-3xl font-black text-success-600 dark:text-success-400">
            {cal.calibratedCount || 0} / {cal.totalQuestions || 0}
          </div>
          <div className="text-[11px] text-neutral-400">
            Mean Discrimination a: {cal.meanDiscrimination || 1.0}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
          <div className="text-xs font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Integrity Flagged Sessions
          </div>
          <div className="text-3xl font-black text-warning-600 dark:text-warning-400">
            {integrity?.flaggedSessionsCount || 0}
          </div>
          <div className="text-[11px] text-neutral-400">
            Fast answers or tab switches
          </div>
        </div>
      </div>

      {/* 2PL IRT Calibration Status Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">📈</span>
          <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white">
            2PL IRT Question Calibration Health
          </h2>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Questions are parameterized with difficulty <code className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400">b ∈ [800, 1500]</code> and item discrimination <code className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400">a ∈ [0.8, 2.2]</code>. Higher discrimination items weight Elo updates more sharply when discriminating high vs. low capability learners.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs">
            <div className="font-bold text-neutral-500">Item Discrimination Range</div>
            <div className="text-lg font-extrabold text-neutral-900 dark:text-white mt-1">
              a = {cal.minDiscrimination || 0.8} to {cal.maxDiscrimination || 2.2}
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs">
            <div className="font-bold text-neutral-500">Mean Question Difficulty</div>
            <div className="text-lg font-extrabold text-neutral-900 dark:text-white mt-1">
              {cal.meanDifficulty || 1150} Elo
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs">
            <div className="font-bold text-neutral-500">IRT Probability Formula</div>
            <div className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400 mt-1">
              P = 1 / (1 + e^(-a*(θ - b)))
            </div>
          </div>
        </div>
      </div>

      {/* Test-Taking Integrity Signals Audit Log */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white">
              Test-Taking Integrity Telemetry Log
            </h2>
          </div>
          <span className="text-xs font-bold text-neutral-400">
            Privacy-Respecting Signal Monitoring
          </span>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
          <div className="font-bold text-neutral-800 dark:text-neutral-200">ℹ️ Judge Notice on Integrity Signals:</div>
          <div>
            Fast answers (&lt; 2000ms) and tab switches (Page Visibility API) are captured strictly for debug transparency. Learners are <strong>never auto-penalized or blocked</strong> during assessment.
          </div>
        </div>

        {!integrity?.flaggedSessions || integrity.flaggedSessions.length === 0 ? (
          <div className="text-center py-8 text-xs text-neutral-400 italic bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            No integrity anomalies flagged in current session memory.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 font-extrabold text-neutral-500 uppercase tracking-wider">
                  <th className="py-3 px-3">Session ID</th>
                  <th className="py-3 px-3">User ID</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Questions</th>
                  <th className="py-3 px-3">Fast Answers (&lt;2s)</th>
                  <th className="py-3 px-3">Tab Switches</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {integrity.flaggedSessions.map((s) => (
                  <tr key={s.sessionId} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-white">{s.sessionId}</td>
                    <td className="py-3 px-3 font-semibold text-neutral-700 dark:text-neutral-300">{s.userId}</td>
                    <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400 uppercase">{s.targetRole}</td>
                    <td className="py-3 px-3 font-bold">{s.questionsAnswered}</td>
                    <td className="py-3 px-3 font-bold text-warning-600 dark:text-warning-400">
                      {s.fastAnswersCount > 0 ? `⚠️ ${s.fastAnswersCount}` : '0'}
                    </td>
                    <td className="py-3 px-3 font-bold text-primary-600 dark:text-primary-400">
                      {s.tabSwitchCount > 0 ? `👁️ ${s.tabSwitchCount}` : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
