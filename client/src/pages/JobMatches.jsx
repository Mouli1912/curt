import React, { useState } from 'react';

export default function JobMatches({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('match');

  const jobsList = [
    {
      id: 'job-1',
      title: 'Software Engineer Intern',
      company: 'Google',
      logo: '🔴',
      location: 'Bengaluru, India',
      type: 'Full-time',
      match: '92% Match',
      matchColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      skills: ['Python', 'Machine Learning', 'Data Structures'],
      extraSkillsCount: 2
    },
    {
      id: 'job-2',
      title: 'Machine Learning Engineer',
      company: 'Microsoft',
      logo: '🟦',
      location: 'Hyderabad, India',
      type: 'Full-time',
      match: '82% Match',
      matchColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      skills: ['Python', 'ML', 'Data Analysis'],
      extraSkillsCount: 3
    },
    {
      id: 'job-3',
      title: 'Data Analyst',
      company: 'Amazon',
      logo: '🟧',
      location: 'Bengaluru, India',
      type: 'Full-time',
      match: '84% Match',
      matchColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      skills: ['SQL', 'Python', 'Data Visualization'],
      extraSkillsCount: 2
    },
    {
      id: 'job-4',
      title: 'Frontend Developer',
      company: 'Adobe',
      logo: '🟥',
      location: 'Noida, India',
      type: 'Full-time',
      match: '78% Match',
      matchColor: 'bg-amber-50 text-amber-700 border-amber-200',
      skills: ['React', 'JavaScript', 'HTML/CSS'],
      extraSkillsCount: 2
    },
    {
      id: 'job-5',
      title: 'Software Development Engineer',
      company: 'Flipkart',
      logo: '🟨',
      location: 'Bengaluru, India',
      type: 'Full-time',
      match: '76% Match',
      matchColor: 'bg-amber-50 text-amber-700 border-amber-200',
      skills: ['Java', 'DSA', 'System Design'],
      extraSkillsCount: 2
    }
  ];

  const filteredJobs = jobsList.filter(job => {
    if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) && !job.company.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <span>Home</span>
            <span>›</span>
            <span className="text-blue-600 font-bold">Job Matches</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Job Matches
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Find job opportunities that match your verified skills. Improve your skills to unlock more opportunities.
          </p>
        </div>

        <button
          onClick={() => alert('Preferences modal opened')}
          className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span>⚙️</span>
          <span>Update Preferences</span>
        </button>
      </div>

      {/* Top 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold shrink-0">
            🎯
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Matched Jobs</div>
            <div className="text-2xl font-black text-slate-900 leading-none mt-1">18</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1">↑ 6 new this week</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-bold shrink-0">
            🏢
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Top Companies</div>
            <div className="text-2xl font-black text-slate-900 leading-none mt-1">25</div>
            <div className="text-[11px] font-medium text-slate-500 mt-1">Google, Microsoft, Amazon</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold shrink-0">
            ⭐
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Match Accuracy</div>
            <div className="text-2xl font-black text-slate-900 leading-none mt-1">92%</div>
            <div className="text-[11px] font-medium text-slate-500 mt-1">Based on your skills</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-bold shrink-0">
            💼
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Applied Jobs</div>
            <div className="text-2xl font-black text-slate-900 leading-none mt-1">4</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1">↑ 2 this month</div>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg shadow-blue-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Boost Your Chances</h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            You're a great fit for 18 jobs. Improve your skills to unlock 32 more opportunities.
          </p>
        </div>

        <button
          onClick={() => onNavigate && onNavigate('learning')}
          className="px-6 py-3.5 rounded-2xl bg-white text-blue-600 font-extrabold text-xs hover:bg-blue-50 shadow-md transition-all shrink-0 flex items-center gap-2"
        >
          <span>Explore Learning Paths</span>
          <span>→</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-3 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Jobs (18)' },
            { id: 'best', label: 'Best Match (10)' },
            { id: 'remote', label: 'Remote (8)' },
            { id: 'internships', label: 'Internships (6)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-48">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-100 border-0 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 border-0 text-xs font-bold text-slate-700 cursor-pointer focus:ring-2 focus:ring-blue-500"
          >
            <option value="match">Sort by: Match Score</option>
            <option value="recent">Sort by: Most Recent</option>
          </select>
        </div>
      </div>

      {/* Main Grid Layout: Job Listings (Left 8 cols) + Right Sidebar (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Job Listings List */}
        <div className="lg:col-span-8 space-y-4">
          {filteredJobs.map(job => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">
                    {job.logo}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{job.title}</h3>
                    <div className="text-xs font-bold text-slate-700 mt-0.5">{job.company}</div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-medium">
                      <span>📍 {job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-xl text-xs font-black border ${job.matchColor}`}>
                    {job.match}
                  </span>
                  <button className="text-slate-400 hover:text-slate-600 text-lg">🔖</button>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5 items-center">
                  {job.skills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold">
                      {skill}
                    </span>
                  ))}
                  {job.extraSkillsCount > 0 && (
                    <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-500 text-[11px] font-bold">
                      +{job.extraSkillsCount}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => alert(`Applied to ${job.title} at ${job.company}`)}
                  className="px-6 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all self-end sm:self-auto flex items-center gap-1"
                >
                  <span>Apply</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Your Skill Match Widget */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-slate-900">Your Skill Match</span>
              <span className="text-blue-600 font-bold cursor-pointer">View All →</span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { name: 'Python', match: 90, bar: 'bg-emerald-500' },
                { name: 'Machine Learning', match: 75, bar: 'bg-blue-600' },
                { name: 'Data Analysis', match: 70, bar: 'bg-blue-600' },
                { name: 'SQL', match: 65, bar: 'bg-blue-600' },
                { name: 'Web Development', match: 60, bar: 'bg-indigo-500' }
              ].map(sm => (
                <div key={sm.name} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-800">{sm.name}</span>
                    <span className="text-slate-500">{sm.match}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${sm.bar}`} style={{ width: `${sm.match}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Hiring Companies Widget */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-slate-900">Top Hiring Companies</span>
              <span className="text-blue-600 font-bold cursor-pointer">View All →</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { name: 'Google', open: '24 open positions', logo: '🔴' },
                { name: 'Microsoft', open: '18 open positions', logo: '🟦' },
                { name: 'Amazon', open: '16 open positions', logo: '🟧' },
                { name: 'Adobe', open: '12 open positions', logo: '🟥' },
                { name: 'Flipkart', open: '10 open positions', logo: '🟨' }
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{c.logo}</span>
                    <div>
                      <div className="font-extrabold text-slate-900">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{c.open}</div>
                    </div>
                  </div>
                  <span className="text-slate-400 text-xs">›</span>
                </div>
              ))}
            </div>
          </div>

          {/* Improve Your Match Score Card */}
          <div className="bg-emerald-50/60 p-5 rounded-3xl border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">💡</span>
              <span>Improve Your Match Score</span>
            </div>
            <p className="text-xs text-emerald-800 font-medium leading-relaxed">
              Complete recommended skills to get better job matches.
            </p>
            <button
              onClick={() => onNavigate && onNavigate('learning')}
              className="w-full py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-extrabold text-xs hover:bg-emerald-100 transition-colors"
            >
              View Recommendations →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
