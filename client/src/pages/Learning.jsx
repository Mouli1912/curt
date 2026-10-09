import React, { useState } from 'react';

export default function Learning({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const learningResources = [
    {
      id: 'python-beginners',
      title: 'Python for Beginners & Data Structures',
      category: 'Programming',
      level: 'Beginner',
      levelColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      progress: 85,
      modules: '12 Modules',
      hours: '14.5 Hours',
      rating: '4.9 ⭐',
      icon: '🐍',
      url: 'https://docs.python.org/3/tutorial/'
    },
    {
      id: 'react-redux',
      title: 'Advanced React & State Management',
      category: 'Web Development',
      level: 'Intermediate',
      levelColor: 'bg-blue-50 text-blue-700 border-blue-200',
      progress: 60,
      modules: '8 Modules',
      hours: '10.0 Hours',
      rating: '4.8 ⭐',
      icon: '⚛️',
      url: 'https://react.dev/learn'
    },
    {
      id: 'data-analysis',
      title: 'Data Analysis & Pandas Masterclass',
      category: 'Data Science',
      level: 'Intermediate',
      levelColor: 'bg-blue-50 text-blue-700 border-blue-200',
      progress: 40,
      modules: '10 Modules',
      hours: '12.0 Hours',
      rating: '4.9 ⭐',
      icon: '📊',
      url: 'https://pandas.pydata.org/docs/user_guide/index.html'
    },
    {
      id: 'sql-optimization',
      title: 'SQL Query Optimization & Database Design',
      category: 'Database',
      level: 'Intermediate',
      levelColor: 'bg-blue-50 text-blue-700 border-blue-200',
      progress: 80,
      modules: '6 Modules',
      hours: '8.0 Hours',
      rating: '4.7 ⭐',
      icon: '🗄️',
      url: 'https://www.postgresql.org/docs/current/tutorial.html'
    },
    {
      id: 'system-design',
      title: 'System Design Fundamentals for Scalable Apps',
      category: 'Architecture',
      level: 'Advanced',
      levelColor: 'bg-purple-50 text-purple-700 border-purple-200',
      progress: 20,
      modules: '15 Modules',
      hours: '18.5 Hours',
      rating: '4.9 ⭐',
      icon: '⚙️',
      url: 'https://github.com/donnemartin/system-design-primer'
    },
    {
      id: 'ml-az',
      title: 'Machine Learning A-Z: Hands-on Python',
      category: 'AI / ML',
      level: 'Intermediate',
      levelColor: 'bg-blue-50 text-blue-700 border-blue-200',
      progress: 70,
      modules: '14 Modules',
      hours: '16.0 Hours',
      rating: '4.8 ⭐',
      icon: '🤖',
      url: 'https://scikit-learn.org/stable/tutorial/index.html'
    }
  ];

  const filteredResources = learningResources.filter(item => {
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Breadcrumbs */}
      <div>
        <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
          <span>Home</span>
          <span>›</span>
          <span className="text-blue-600 font-bold">Learning</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Learning & Resources
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Master industry-aligned skills with top curated learning paths, documentation, and video modules.
        </p>
      </div>

      {/* Hero Banner + Top Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Banner (Left 8 cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg shadow-blue-500/10 flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-2 max-w-md">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider">
              Curated Learning Paths
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Master Industry Skills with Free Curated Resources
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Step-by-step documentation and tutorials targeted specifically to your identified skill gaps.
            </p>
          </div>

          <div>
            <button
              onClick={() => onNavigate && onNavigate('report')}
              className="px-5 py-3 rounded-2xl bg-white text-blue-600 font-extrabold text-xs hover:bg-blue-50 shadow-md transition-all flex items-center gap-2"
            >
              <span>View Your Skill Gaps</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid (Right 4 cols) */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Active Courses</div>
            <div className="text-2xl font-black text-slate-900 my-1">4</div>
            <div className="text-[10px] text-blue-600 font-bold">2 near complete</div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Hours Learned</div>
            <div className="text-2xl font-black text-slate-900 my-1">24h</div>
            <div className="text-[10px] text-emerald-600 font-bold">↑ 4h this week</div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Active Streak</div>
            <div className="text-2xl font-black text-slate-900 my-1">12🔥</div>
            <div className="text-[10px] text-amber-600 font-bold">Keep it up!</div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Saved Resources</div>
            <div className="text-2xl font-black text-slate-900 my-1">8</div>
            <div className="text-[10px] text-purple-600 font-bold">Bookmarks</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-3 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Resources (12)' },
            { id: 'in-progress', label: 'In Progress (4)' },
            { id: 'completed', label: 'Completed (5)' },
            { id: 'saved', label: 'Saved (3)' }
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

        <div className="relative flex-1 md:w-64">
          <input
            type="text"
            placeholder="Search learning paths & docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-100 border-0 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>
      </div>

      {/* Main Grid: Resource Cards (Left 8 cols) + Right Sidebar (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Resource Cards Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredResources.map(res => (
            <div
              key={res.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">
                    {res.icon}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold border ${res.levelColor}`}>
                    {res.level}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{res.title}</h3>
                  <span className="text-[11px] font-semibold text-slate-400">{res.category}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>Progress</span>
                    <span className="text-blue-600 font-extrabold">{res.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${res.progress}%` }} />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
                  <span>{res.modules}</span>
                  <span>•</span>
                  <span>{res.hours}</span>
                  <span>•</span>
                  <span className="font-bold text-slate-700">{res.rating}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Continue Learning</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Recommended Next Resource Widget */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="text-xs font-extrabold text-slate-900">Recommended Next Resource</div>
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">📚</span>
                <span className="text-xs font-extrabold text-slate-900">Data Structures & Algorithms</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Prerequisite requirement for System Design and Backend Developer track.
              </p>
              <button
                onClick={() => onNavigate && onNavigate('report')}
                className="w-full py-2 rounded-xl bg-blue-600 text-white font-extrabold text-xs hover:bg-blue-700 transition-colors"
              >
                Start Module →
              </button>
            </div>
          </div>

          {/* Learning Streak Widget */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-slate-900">Learning Streak</span>
              <span className="font-extrabold text-amber-500">12 Days 🔥</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                <div key={d} className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < 6 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {i < 6 ? '✓' : ''}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{d}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
