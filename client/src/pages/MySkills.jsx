import React, { useState } from 'react';

export default function MySkills({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'proficient' | 'in-progress' | 'not-started'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('progress');
  const [selectedSkillId, setSelectedSkillId] = useState('python');

  const skillsData = [
    { id: 'python', name: 'Python', category: 'Programming Language', icon: '🐍', progress: 85, status: 'Proficient', completedCount: 3, totalAssessments: 3 },
    { id: 'ml', name: 'Machine Learning', category: 'AI / ML', icon: '🤖', progress: 70, status: 'In Progress', completedCount: 2, totalAssessments: 3 },
    { id: 'data-analysis', name: 'Data Analysis', category: 'Data Science', icon: '📊', progress: 60, status: 'In Progress', completedCount: 2, totalAssessments: 4 },
    { id: 'web-dev', name: 'Web Development', category: 'Development', icon: '💻', progress: 40, status: 'Not Started', completedCount: 1, totalAssessments: 3 },
    { id: 'sql', name: 'SQL', category: 'Database', icon: '🗄️', progress: 80, status: 'Proficient', completedCount: 3, totalAssessments: 3 },
    { id: 'cloud', name: 'Cloud Computing', category: 'Cloud / DevOps', icon: '☁️', progress: 65, status: 'In Progress', completedCount: 2, totalAssessments: 4 },
    { id: 'gen-ai', name: 'Generative AI', category: 'AI / ML', icon: '✨', progress: 55, status: 'In Progress', completedCount: 2, totalAssessments: 4 },
    { id: 'statistics', name: 'Statistics', category: 'Mathematics', icon: '∑', progress: 75, status: 'Proficient', completedCount: 3, totalAssessments: 3 },
    { id: 'system-design', name: 'System Design', category: 'Development', icon: '⚙️', progress: 30, status: 'Not Started', completedCount: 1, totalAssessments: 3 },
  ];

  const selectedSkill = skillsData.find(s => s.id === selectedSkillId) || skillsData[0];

  const filteredSkills = skillsData.filter(skill => {
    if (activeFilter === 'proficient' && skill.status !== 'Proficient') return false;
    if (activeFilter === 'in-progress' && skill.status !== 'In Progress') return false;
    if (activeFilter === 'not-started' && skill.status !== 'Not Started') return false;
    if (searchQuery && !skill.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <span>Home</span>
            <span>›</span>
            <span className="text-blue-600 font-bold">My Skills</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Skills
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your skills, see your progress, and keep improving with assessments and personalized learning resources.
          </p>
        </div>

        <button
          onClick={() => alert('Add Skill modal opened')}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="text-base leading-none">+</span>
          <span>Add Skill</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
            📚
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Skills</div>
            <div className="text-2xl font-black text-slate-900 leading-none mt-1">12</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1">↑ 3 this month</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
            ✓
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Proficient Skills</div>
            <div className="text-2xl font-black text-slate-900 leading-none mt-1">5</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1">↑ 2 this month</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
            🕒
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">In Progress</div>
            <div className="text-2xl font-black text-slate-900 leading-none mt-1">4</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1">↑ 1 this month</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-bold">
            ⏳
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Not Started</div>
            <div className="text-2xl font-black text-slate-900 leading-none mt-1">3</div>
            <div className="text-[11px] font-medium text-slate-400 mt-1">No change</div>
          </div>
        </div>
      </div>

      {/* Filter Bar & Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-3 rounded-3xl border border-slate-200 shadow-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Skills (12)' },
            { id: 'proficient', label: 'Proficient (5)' },
            { id: 'in-progress', label: 'In Progress (4)' },
            { id: 'not-started', label: 'Not Started (3)' }
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

        {/* Search & Sort */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-48">
            <input
              type="text"
              placeholder="Search skills..."
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
            <option value="progress">Sort by: Progress</option>
            <option value="name">Sort by: Name</option>
          </select>
        </div>
      </div>

      {/* Main Grid + Skill Detail Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 3x3 Grid of Skill Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSkills.map(skill => {
            const isSelected = selectedSkillId === skill.id;
            return (
              <div
                key={skill.id}
                onClick={() => setSelectedSkillId(skill.id)}
                className={`bg-white p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                        {skill.icon}
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-slate-900">{skill.name}</div>
                        <div className="text-[11px] text-slate-400 font-medium">{skill.category}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold border ${
                      skill.status === 'Proficient'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : skill.status === 'In Progress'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {skill.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          skill.status === 'Proficient' ? 'bg-emerald-500' : skill.status === 'In Progress' ? 'bg-blue-600' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>
                    <div className="text-right text-xs font-black text-slate-700">{skill.progress}%</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <span>📑</span> Assessments {skill.completedCount}/{skill.totalAssessments}
                  </span>
                  <button className="text-blue-600 font-extrabold hover:text-blue-700 flex items-center gap-1">
                    <span>View Details</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Panel Sidebar */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {/* Header info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">
              {selectedSkill.icon}
            </div>
            <div>
              <div className="font-extrabold text-base text-slate-900">{selectedSkill.name}</div>
              <div className="text-xs text-slate-400 font-medium">{selectedSkill.category}</div>
            </div>
            <span className="ml-auto px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {selectedSkill.status}
            </span>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-100 text-xs font-bold text-slate-500 gap-4">
            <button className="pb-2 border-b-2 border-blue-600 text-blue-600 font-extrabold">Overview</button>
            <button className="pb-2 hover:text-slate-900">Assessments</button>
            <button className="pb-2 hover:text-slate-900">Learning Resources</button>
          </div>

          {/* Skill Progress Circle Widget */}
          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
            <div className="text-xs font-extrabold text-slate-900">Skill Progress</div>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" className="stroke-slate-200" strokeWidth="4" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" className="stroke-emerald-500" strokeWidth="4" strokeDasharray={`${selectedSkill.progress}, 100`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-sm text-slate-900">
                  {selectedSkill.progress}%
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-extrabold text-emerald-700">{selectedSkill.status}</div>
                <div className="text-[11px] text-slate-500 leading-snug">
                  You have a strong understanding of {selectedSkill.name}.
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Performance Breakdown */}
          <div className="space-y-2">
            <div className="text-xs font-extrabold text-slate-900">Assessment Performance</div>
            <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <div className="text-base font-black text-slate-900">{selectedSkill.completedCount}</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Completed</div>
              </div>
              <div>
                <div className="text-base font-black text-slate-900">0</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Pending</div>
              </div>
              <div>
                <div className="text-base font-black text-slate-900">0</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Not Started</div>
              </div>
            </div>
          </div>

          {/* Recent Assessments List */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-slate-900">Recent Assessments</span>
              <span className="text-blue-600 font-bold cursor-pointer">View All →</span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { title: `${selectedSkill.name} Basics`, score: '92%', date: '12 Aug 2026' },
                { title: `Data Structures in ${selectedSkill.name}`, score: '88%', date: '5 Jul 2026' },
                { title: `${selectedSkill.name} for Data Analysis`, score: '85%', date: '20 Jun 2026' }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl border border-slate-100 bg-white">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                    <span className="font-bold text-slate-800">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-emerald-600">{item.score}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Learning CTA Button */}
          <button
            onClick={() => onNavigate && onNavigate('learning')}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue Learning</span>
            <span>→</span>
          </button>
        </div>

      </div>
    </div>
  );
}
