import React, { useState } from 'react';
import Assessment from './Assessment';

export default function AssessmentsView({ userId = 'pro-user', targetRole = 'frontend-developer', onFinish }) {
  const [activeTestId, setActiveTestId] = useState(null); // When non-null, renders live test runner!
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  if (activeTestId) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setActiveTestId(null)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors"
        >
          <span>← Back to Assessment List</span>
        </button>
        <Assessment
          userId={userId}
          targetRole={targetRole}
          onFinish={() => {
            setActiveTestId(null);
            if (onFinish) onFinish();
          }}
        />
      </div>
    );
  }

  const assessmentList = [
    {
      id: 'python-basics',
      title: 'Python Basics',
      tag: 'Recommended',
      level: 'Easy',
      levelColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: '🐍',
      desc: 'Test your fundamental Python programming skills including syntax, data structures, and problem solving.',
      questions: '40 questions',
      duration: '60 mins',
      taken: '12.5K+ taken'
    },
    {
      id: 'ml-fundamentals',
      title: 'Machine Learning Fundamentals',
      level: 'Medium',
      levelColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: '🤖',
      desc: 'Assess your understanding of core ML concepts, algorithms, and real-world applications.',
      questions: '50 questions',
      duration: '75 mins',
      taken: '8.3K+ taken'
    },
    {
      id: 'data-analysis-python',
      title: 'Data Analysis with Python',
      level: 'Medium',
      levelColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: '📊',
      desc: 'Test your data analysis skills using Pandas, NumPy, and visualization libraries.',
      questions: '45 questions',
      duration: '60 mins',
      taken: '6.1K+ taken'
    },
    {
      id: 'web-dev',
      title: 'Web Development',
      level: 'Medium',
      levelColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: '💻',
      desc: 'Evaluate your HTML, CSS, JavaScript, and modern web development skills.',
      questions: '40 questions',
      duration: '60 mins',
      taken: '9.4K+ taken'
    },
    {
      id: 'sql-db',
      title: 'SQL and Databases',
      level: 'Easy',
      levelColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: '🗄️',
      desc: 'Test your SQL skills including queries, joins, and database design concepts.',
      questions: '35 questions',
      duration: '60 mins',
      taken: '15.2K+ taken'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Breadcrumbs */}
      <div>
        <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
          <span>Home</span>
          <span>›</span>
          <span className="text-blue-600 font-bold">Assessments</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Assessments
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Test your skills, get verified, and track your improvement with industry-aligned assessments.
        </p>
      </div>

      {/* Hero Banner + Assessment Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Banner (Left 8 cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg shadow-blue-500/10 flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-2 max-w-md">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Show what you know.</h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Take assessments, earn skill badges, and get verified for real opportunities.
            </p>
          </div>

          <div>
            <button
              onClick={() => setActiveTestId('python-basics')}
              className="px-5 py-3 rounded-2xl bg-white text-blue-600 font-extrabold text-xs hover:bg-blue-50 shadow-md transition-all flex items-center gap-2"
            >
              <span>Browse Assessments</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Stats Card (Right 4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-900">Your Assessment Stats</span>
            <span className="text-blue-600 font-bold cursor-pointer">View All →</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" className="stroke-slate-100" strokeWidth="4" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" className="stroke-emerald-500" strokeWidth="4" strokeDasharray="40, 100" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-black text-sm text-slate-900">
                40%
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>2 Completed</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>2 In Progress</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span>8 Not Started</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-3 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All (12)' },
            { id: 'available', label: 'Available (8)' },
            { id: 'in-progress', label: 'In Progress (2)' },
            { id: 'completed', label: 'Completed (2)' }
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
              placeholder="Search assessments..."
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
            <option value="recommended">Sort by: Recommended</option>
            <option value="name">Sort by: Name</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Assessment List (Left 8 cols) + Right Sidebar (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Assessment Cards List */}
        <div className="lg:col-span-8 space-y-4">
          {assessmentList.map(item => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900">{item.title}</h3>
                      {item.tag && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-snug mt-1 max-w-lg">{item.desc}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium pt-1">
                  <span className="flex items-center gap-1.5">
                    <span>📋</span> {item.questions}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span>⏱️</span> {item.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span>👥</span> {item.taken}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 self-stretch sm:self-auto justify-between shrink-0">
                <span className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${item.levelColor}`}>
                  {item.level}
                </span>

                <button
                  onClick={() => setActiveTestId(item.id)}
                  className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1"
                >
                  <span>Start Assessment</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Skill Badges Widget */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-slate-900">Skill Badges</span>
              <span className="text-blue-600 font-bold cursor-pointer">View All →</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { name: 'Python Basics', icon: '🐍', status: 'unlocked' },
                { name: 'Machine Learning', icon: '🤖', status: 'unlocked' },
                { name: 'Data Analysis', icon: '📊', status: 'unlocked' },
                { name: 'SQL', icon: '🔒', status: 'locked' }
              ].map((b, i) => (
                <div key={i} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-xs">
                    {b.icon}
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-700 leading-tight">{b.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Assessments Widget */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-slate-900">Upcoming Assessments</span>
              <span className="text-blue-600 font-bold cursor-pointer">View All →</span>
            </div>

            <div className="space-y-2.5">
              {[
                { day: '15', month: 'Aug', title: 'Advanced Python', detail: '75 mins • 50 questions' },
                { day: '18', month: 'Aug', title: 'Data Visualization', detail: '60 mins • 40 questions' },
                { day: '22', month: 'Aug', title: 'Deep Learning Basics', detail: '75 mins • 50 questions' }
              ].map((up, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex flex-col items-center justify-center shrink-0 font-extrabold leading-none">
                      <span className="text-xs">{up.day}</span>
                      <span className="text-[9px] uppercase">{up.month}</span>
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">{up.title}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{up.detail}</div>
                    </div>
                  </div>
                  <span className="text-slate-400 font-bold text-sm">›</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certification Benefits Widget */}
          <div className="bg-emerald-50/60 p-5 rounded-3xl border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">✓</span>
              <span>Certification Benefits</span>
            </div>
            <div className="space-y-2 text-xs text-emerald-900 font-medium">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Get verified skill badges
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Increase your profile visibility
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Unlock better job opportunities
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
