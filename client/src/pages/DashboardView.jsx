import React, { useEffect, useState } from 'react';
import { fetchSkillGraph } from '../api/client';

export default function DashboardView({ targetRole = 'frontend-developer', onSelectRole, onNavigate }) {
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    fetchSkillGraph(targetRole)
      .then(data => setGraph(data))
      .catch(err => console.error('Error loading graph in dashboard:', err));
  }, [targetRole]);

  return (
    <div className="space-y-6 pb-10">
      
      {/* 1. Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-10 text-white shadow-xl shadow-blue-500/10">
        {/* Background Decorative SVG */}
        <div className="absolute right-0 top-0 bottom-0 opacity-15 pointer-events-none hidden md:block">
          <svg className="h-full" viewBox="0 0 400 300" fill="none">
            <circle cx="200" cy="150" r="120" stroke="white" strokeWidth="4" />
            <path d="M50 200 C 150 100, 250 250, 350 50" stroke="white" strokeWidth="6" />
          </svg>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
              Welcome back, Suraj!
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Prove your skills.<br />
              Build your career.
            </h1>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl leading-relaxed opacity-95">
              Take assessments, learn from the best resources, and get verified skills that employers trust.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate && onNavigate('assessments')}
                className="px-6 py-3.5 rounded-2xl bg-white text-blue-600 font-extrabold text-sm hover:bg-blue-50 shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <span>Start an Assessment</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right Visual Path Roadmap Graphic */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-end gap-2.5">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>🚩 Land Your Dream Job</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-bold flex items-center gap-2 mr-8">
              <span>⚙️ Get Verified</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-bold flex items-center gap-2 mr-16">
              <span>📄 Practice</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-bold flex items-center gap-2 mr-24">
              <span>📖 Learn</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Overall Skill Score */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Overall Skill Score</span>
            <span className="text-slate-400 cursor-help" title="Calculated from your verified skill ratings">ⓘ</span>
          </div>

          <div className="flex items-center gap-4 py-1">
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" className="stroke-slate-100" strokeWidth="4" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" className="stroke-emerald-500" strokeWidth="4" strokeDasharray="78, 100" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-black text-lg text-slate-900">
                78%
              </div>
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ▲ +12%
              </span>
              <div className="text-[11px] text-slate-400">from last month</div>
            </div>
          </div>

          <div className="text-xs text-slate-500 leading-snug">
            You're on track! Keep learning and taking assessments.
          </div>
        </div>

        {/* Card 2: Skills */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
              📚
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Skills</div>
              <div className="text-2xl font-black text-slate-900 leading-none">12</div>
              <div className="text-[11px] text-slate-400 font-medium">Skills Tracked</div>
            </div>
          </div>

          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-slate-600 font-medium"><span className="w-2 h-2 rounded-full bg-emerald-500" /> 8 Proficient</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-slate-600 font-medium"><span className="w-2 h-2 rounded-full bg-blue-500" /> 3 In Progress</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-slate-600 font-medium"><span className="w-2 h-2 rounded-full bg-slate-300" /> 1 Not Started</span>
            </div>
          </div>
        </div>

        {/* Card 3: Assessments */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
              📑
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Assessments</div>
              <div className="text-2xl font-black text-slate-900 leading-none">5</div>
              <div className="text-[11px] text-slate-400 font-medium">Completed</div>
            </div>
          </div>

          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-slate-600 font-medium"><span className="w-2 h-2 rounded-full bg-emerald-500" /> 3 Passed</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-slate-600 font-medium"><span className="w-2 h-2 rounded-full bg-blue-500" /> 1 In Progress</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-slate-600 font-medium"><span className="w-2 h-2 rounded-full bg-slate-300" /> 1 Not Started</span>
            </div>
          </div>
        </div>

        {/* Card 4: Learning Hours */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold">
                🕒
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Learning Hours</div>
                <div className="text-2xl font-black text-slate-900 leading-none">24</div>
                <div className="text-[11px] text-slate-400 font-medium">This Month</div>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
              ↑ 20%
            </span>
          </div>

          {/* Mini Bar Chart Mon-Sun */}
          <div className="flex items-end justify-between gap-1 h-10 pt-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const heights = [40, 75, 45, 50, 35, 90, 60];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-blue-100 rounded-t-sm" style={{ height: `${heights[i]}%` }}>
                    <div className="w-full bg-blue-600 rounded-t-sm" style={{ height: '70%' }} />
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. Middle Section: My Skills (Left) + Recommended Skills (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* My Skills Preview */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-slate-900">My Skills</h3>
            <button
              onClick={() => onNavigate && onNavigate('my-skills')}
              className="text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <span>→</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {[
              { name: 'Python', percent: 85, badge: 'Proficient', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', bar: 'bg-emerald-500', icon: '🐍' },
              { name: 'Machine Learning', percent: 70, badge: 'In Progress', color: 'bg-blue-100 text-blue-800 border-blue-200', bar: 'bg-blue-600', icon: '🤖' },
              { name: 'Data Analysis', percent: 60, badge: 'In Progress', color: 'bg-blue-100 text-blue-800 border-blue-200', bar: 'bg-blue-600', icon: '📊' },
              { name: 'Web Development', percent: 40, badge: 'Not Started', color: 'bg-slate-100 text-slate-600 border-slate-200', bar: 'bg-indigo-500', icon: '💻' }
            ].map(skill => (
              <div key={skill.name} className="flex items-center justify-between gap-4 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 w-1/3">
                  <span className="text-xl">{skill.icon}</span>
                  <span className="text-xs font-bold text-slate-900 truncate">{skill.name}</span>
                </div>

                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${skill.bar} rounded-full`} style={{ width: `${skill.percent}%` }} />
                  </div>
                  <span className="text-xs font-extrabold text-slate-700 w-10 text-right">{skill.percent}%</span>
                </div>

                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border ${skill.color}`}>
                  {skill.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Skills */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-slate-900">Recommended Skills</h3>
            <button
              onClick={() => onNavigate && onNavigate('learning')}
              className="text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: 'SQL', desc: 'High demand in Data roles', badge: 'In Demand', badgeColor: 'bg-blue-100 text-blue-700', icon: '🗄️' },
              { name: 'Cloud Computing', desc: 'Essential for modern roles', badge: 'High Impact', badgeColor: 'bg-emerald-100 text-emerald-700', icon: '☁️' },
              { name: 'Generative AI', desc: 'Trending in the industry', badge: 'Trending', badgeColor: 'bg-purple-100 text-purple-700', icon: '✨' }
            ].map(item => (
              <div key={item.name} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-xs">
                    {item.icon}
                  </div>
                  <div className="font-extrabold text-xs text-slate-900">{item.name}</div>
                  <div className="text-[11px] text-slate-500 leading-tight">{item.desc}</div>
                </div>

                <div className="space-y-2">
                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <button
                    onClick={() => onNavigate && onNavigate('learning')}
                    className="w-full py-2 rounded-xl bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-extrabold transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Start Learning</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Bottom Section: Recent Activity (Left) + Job Matches (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Activity */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-slate-900">Recent Activity</h3>
            <button
              onClick={() => onNavigate && onNavigate('progress')}
              className="text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <span>→</span>
            </button>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Completed Python Basics Assessment', detail: 'Scored 92%', time: '2 days ago', icon: '✓', iconBg: 'bg-emerald-500 text-white' },
              { title: 'Started Machine Learning Learning Path', detail: '5 modules', time: '4 days ago', icon: '📖', iconBg: 'bg-blue-500 text-white' },
              { title: 'Earned Data Analysis Skill Badge', detail: '7 modules', time: '7 days ago', icon: '⭐', iconBg: 'bg-purple-500 text-white' }
            ].map((act, i) => (
              <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${act.iconBg} flex items-center justify-center font-bold text-xs shrink-0`}>
                    {act.icon}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">{act.title}</div>
                    <div className="text-[11px] text-slate-500">{act.detail}</div>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Job Matches */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-slate-900">Job Matches</h3>
            <button
              onClick={() => onNavigate && onNavigate('job-matches')}
              className="text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: 'Software Engineer', company: 'Google', location: 'Bengaluru, India', match: '92% Match', logo: '🔴' },
              { title: 'Machine Learning Engineer', company: 'Microsoft', location: 'Hyderabad, India', match: '88% Match', logo: '🟦' },
              { title: 'Data Analyst', company: 'Amazon', location: 'Bengaluru, India', match: '84% Match', logo: '🟧' }
            ].map((job, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{job.logo}</span>
                    <span className="text-xs font-bold text-slate-900 truncate">{job.title}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">{job.company}</div>
                  <div className="text-[10px] text-slate-400">{job.location}</div>
                </div>

                <div className="pt-1">
                  <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {job.match}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
