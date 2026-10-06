import React, { useState, useEffect } from 'react';
import { fetchAdminAnalytics } from '../api/client';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = () => {
    setLoading(true);
    setError(null);

    fetchAdminAnalytics()
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load admin analytics:', err);
        setError('Failed to retrieve aggregate market analytics.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-36 bg-neutral-100 dark:bg-neutral-800/60 rounded-3xl animate-pulse" />
          <div className="h-36 bg-neutral-100 dark:bg-neutral-800/60 rounded-3xl animate-pulse" />
          <div className="h-36 bg-neutral-100 dark:bg-neutral-800/60 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-200 p-8 rounded-3xl space-y-4 border border-danger-200">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-bold">Analytics Error</h2>
          <p className="text-xs">{error}</p>
          <button
            onClick={loadData}
            className="px-6 py-2 bg-danger-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-danger-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overview, readinessDistribution, topInDemandSkills } = analytics;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xl font-extrabold border border-primary-200 dark:border-primary-800">
              📊
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Platform Market Demand & Talent Supply Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Aggregate non-PII hiring demand trends, talent readiness tiers, and skill graph metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-200 border border-primary-300">
            Pillar 4: Market Intelligence
          </span>
        </div>
      </div>

      {/* Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider">Total Learners</div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white">{overview?.totalLearners || 0}</div>
          <div className="text-[11px] text-neutral-400">Total registered talent accounts</div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider">Total Recruiters</div>
          <div className="text-3xl font-black text-accent-600 dark:text-accent-400">{overview?.totalRecruiters || 0}</div>
          <div className="text-[11px] text-neutral-400">Active hiring organizations</div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider">Questions Answered</div>
          <div className="text-3xl font-black text-primary-600 dark:text-primary-400">{overview?.totalQuestionsAnswered || 0}</div>
          <div className="text-[11px] text-neutral-400">2PL IRT response data points</div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider">Completion Rate</div>
          <div className="text-3xl font-black text-success-600 dark:text-success-400">{overview?.completionRate || 0}%</div>
          <div className="text-[11px] text-neutral-400">Assessment session stabilization</div>
        </div>
      </div>

      {/* Section 1: Readiness Tiers Distribution */}
      <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>🌱</span> Talent Supply Readiness Tiers
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Breakdown of learners across baseline, mid-progress, and job-ready proficiency thresholds.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-success-50/60 dark:bg-success-950/40 p-5 rounded-2xl border border-success-200 dark:border-success-900/60 space-y-2">
            <div className="flex justify-between items-center text-xs font-extrabold text-success-800 dark:text-success-200">
              <span>⭐ Job-Ready Tier (≥80%)</span>
              <span>{readinessDistribution?.proPercent || 0}%</span>
            </div>
            <div className="text-2xl font-black text-success-900 dark:text-success-100">
              {readinessDistribution?.proLearnersCount || 0} Learners
            </div>
            <div className="h-2 bg-success-200 dark:bg-success-900 rounded-full overflow-hidden">
              <div className="h-full bg-success-600 rounded-full" style={{ width: `${readinessDistribution?.proPercent || 0}%` }} />
            </div>
          </div>

          <div className="bg-primary-50/60 dark:bg-primary-950/40 p-5 rounded-2xl border border-primary-200 dark:border-primary-900/60 space-y-2">
            <div className="flex justify-between items-center text-xs font-extrabold text-primary-800 dark:text-primary-200">
              <span>🟡 Mid-Progress Tier (40-79%)</span>
              <span>{readinessDistribution?.midPercent || 0}%</span>
            </div>
            <div className="text-2xl font-black text-primary-900 dark:text-primary-100">
              {readinessDistribution?.midLearnersCount || 0} Learners
            </div>
            <div className="h-2 bg-primary-200 dark:bg-primary-900 rounded-full overflow-hidden">
              <div className="h-full bg-primary-600 rounded-full" style={{ width: `${readinessDistribution?.midPercent || 0}%` }} />
            </div>
          </div>

          <div className="bg-amber-50/60 dark:bg-amber-950/40 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-2">
            <div className="flex justify-between items-center text-xs font-extrabold text-amber-800 dark:text-amber-200">
              <span>🟢 Fresh Onboarding Tier (0-39%)</span>
              <span>{readinessDistribution?.freshPercent || 0}%</span>
            </div>
            <div className="text-2xl font-black text-amber-900 dark:text-amber-100">
              {readinessDistribution?.freshLearnersCount || 0} Learners
            </div>
            <div className="h-2 bg-amber-200 dark:bg-amber-900 rounded-full overflow-hidden">
              <div className="h-full bg-amber-600 rounded-full" style={{ width: `${readinessDistribution?.freshPercent || 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Top In-Demand Skills Across Target Roles */}
      <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>📈</span> Top Market-Demand Skills Across Job Postings
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Normalized market demand scores extracted classical NLP pipeline across job postings.
          </p>
        </div>

        <div className="space-y-3">
          {topInDemandSkills && topInDemandSkills.map((skill, idx) => (
            <div key={skill.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-extrabold text-[11px]">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-extrabold text-neutral-900 dark:text-white text-sm capitalize">{skill.label}</div>
                  <div className="text-[11px] text-neutral-400 capitalize">{skill.category} Domain</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-32 hidden sm:block h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-600 rounded-full" style={{ width: `${skill.marketDemandPercent}%` }} />
                </div>
                <span className="font-black text-primary-600 dark:text-primary-400 text-sm">
                  {skill.marketDemandPercent}% Demand
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
