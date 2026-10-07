import React, { useState } from 'react';

export default function Progress({ onNavigate }) {
  const [timeRange, setTimeRange] = useState('Aug 2026 - Oct 2026');
  const [chartPeriod, setChartPeriod] = useState('Last 6 Months');

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <span>Home</span>
            <span>›</span>
            <span className="text-blue-600 font-bold">Progress</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your learning journey, see detailed analytics, and measure your growth over time.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold text-slate-700 self-start sm:self-auto">
          <span>📅</span>
          <span>{timeRange}</span>
          <span>▼</span>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Progress */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold shrink-0">
            📊
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Overall Progress</div>
            <div className="text-2xl font-black text-slate-900 leading-none mt-1">78%</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1">↑ 12% from last month</div>
          </div>
        </div>

        {/* Skill Badges */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold shrink-0">
            🏆
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Skill Badges</div>
            <div className="text-2xl font-black text-slate-900 leading-none mt-1">8</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1">↑ 2 this month</div>
          </div>
        </div>

        {/* Assessments Completed */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-bold shrink-0">
            🎯
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Assessments Completed</div>
            <div className="text-2xl font-black text-slate-900 leading-none mt-1">12</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1">↑ 2 this month</div>
          </div>
        </div>

        {/* Learning Hours */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold shrink-0">
            🕒
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Learning Hours</div>
            <div className="text-2xl font-black text-slate-900 leading-none mt-1">42</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1">↑ 5 this month</div>
          </div>
        </div>
      </div>

      {/* Middle Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Learning Progress Over Time Line Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-slate-900">Learning Progress Over Time</h3>
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 border-0 text-xs font-bold text-slate-700 cursor-pointer"
            >
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="Last 1 Year">Last 1 Year</option>
            </select>
          </div>

          {/* SVG Line Chart Container */}
          <div className="relative pt-4 pb-2">
            <div className="h-48 w-full flex items-end justify-between relative border-b border-slate-200">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-300">
                <div className="border-b border-slate-100 flex justify-between"><span>100%</span></div>
                <div className="border-b border-slate-100 flex justify-between"><span>75%</span></div>
                <div className="border-b border-slate-100 flex justify-between"><span>50%</span></div>
                <div className="border-b border-slate-100 flex justify-between"><span>25%</span></div>
                <div><span>0%</span></div>
              </div>

              {/* Chart SVG */}
              <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible z-10">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <path
                  d="M 10 110 L 80 90 L 160 70 L 240 55 L 320 40 L 400 25 L 480 15 L 480 150 L 10 150 Z"
                  fill="url(#chartGrad)"
                />

                <path
                  d="M 10 110 L 80 90 L 160 70 L 240 55 L 320 40 L 400 25 L 480 15"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Points */}
                {[
                  { x: 10, y: 110, val: '25%' },
                  { x: 80, y: 90, val: '35%' },
                  { x: 160, y: 70, val: '45%' },
                  { x: 240, y: 55, val: '55%' },
                  { x: 320, y: 40, val: '65%' },
                  { x: 400, y: 25, val: '72%' },
                  { x: 480, y: 15, val: '78%' }
                ].map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#3b82f6" stroke="white" strokeWidth="2" />
                    {i === 6 && (
                      <g transform={`translate(${pt.x - 18}, ${pt.y - 28})`}>
                        <rect width="36" height="20" rx="6" fill="#1e293b" />
                        <text x="18" y="14" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">{pt.val}</text>
                      </g>
                    )}
                  </g>
                ))}
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-xs text-slate-400 font-medium pt-2 px-1">
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
            </div>
          </div>
        </div>

        {/* Skill Category Progress Donut Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="text-base font-extrabold text-slate-900">Skill Category Progress</h3>

          <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-2">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="4" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="85, 100" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="70, 100" strokeDashoffset="-25" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="60, 100" strokeDashoffset="-50" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900">78%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Overall</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-semibold">
            {[
              { label: 'Programming', val: '85%', color: 'bg-blue-500' },
              { label: 'Data Science', val: '70%', color: 'bg-emerald-500' },
              { label: 'Web Development', val: '60%', color: 'bg-purple-500' },
              { label: 'Database', val: '80%', color: 'bg-amber-500' },
              { label: 'Cloud Computing', val: '55%', color: 'bg-sky-500' },
              { label: 'Others', val: '40%', color: 'bg-slate-300' }
            ].map(cat => (
              <div key={cat.label} className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                  {cat.label}
                </span>
                <span className="font-extrabold text-slate-900">{cat.val}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Grid Row: Progress by Skills + Milestones + Streak + Time Spent */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Progress by Skills (Left 6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-slate-900">Progress by Skills</h3>
            <button onClick={() => onNavigate && onNavigate('my-skills')} className="text-xs font-extrabold text-blue-600 hover:text-blue-700">View All →</button>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Python', percent: 85, badge: 'Proficient', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', bar: 'bg-emerald-500', icon: '🐍' },
              { name: 'Machine Learning', percent: 70, badge: 'In Progress', color: 'bg-blue-100 text-blue-800 border-blue-200', bar: 'bg-blue-600', icon: '🤖' },
              { name: 'Data Analysis', percent: 60, badge: 'In Progress', color: 'bg-blue-100 text-blue-800 border-blue-200', bar: 'bg-blue-600', icon: '📊' },
              { name: 'Web Development', percent: 40, badge: 'Not Started', color: 'bg-slate-100 text-slate-600 border-slate-200', bar: 'bg-indigo-500', icon: '💻' },
              { name: 'SQL', percent: 80, badge: 'Proficient', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', bar: 'bg-emerald-500', icon: '🗄️' }
            ].map(skill => (
              <div key={skill.name} className="flex items-center justify-between gap-4 p-2 rounded-2xl">
                <div className="flex items-center gap-3 w-1/3">
                  <span className="text-lg">{skill.icon}</span>
                  <span className="text-xs font-bold text-slate-900 truncate">{skill.name}</span>
                </div>

                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${skill.bar} rounded-full`} style={{ width: `${skill.percent}%` }} />
                  </div>
                  <span className="text-xs font-extrabold text-slate-700 w-10 text-right">{skill.percent}%</span>
                </div>

                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold border ${skill.color}`}>
                  {skill.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones (Right 6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-slate-900">Milestones</h3>
            <span className="text-xs font-extrabold text-blue-600 cursor-pointer">View All →</span>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Completed Python Basics', date: '12 Aug 2026', icon: '✓', color: 'bg-emerald-500 text-white' },
              { title: 'Earned First Skill Badge', date: '20 Aug 2026', icon: '🏆', color: 'bg-blue-500 text-white' },
              { title: 'Completed ML Fundamentals', date: '5 Sep 2026', icon: '✓', color: 'bg-emerald-500 text-white' },
              { title: 'Reached 75% Overall Progress', date: '18 Sep 2026', icon: '📈', color: 'bg-purple-500 text-white' },
              { title: 'Next Milestone: Complete SQL', date: 'In Progress', icon: '🎯', color: 'bg-amber-500 text-white' }
            ].map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl ${m.color} flex items-center justify-center font-bold text-xs shrink-0`}>
                    {m.icon}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">{m.title}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{m.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Streak (Left 6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-slate-900">Learning Streak</h3>
            <span className="text-xs font-black text-amber-500">12 Days 🔥</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl">🔥</span>
            <div>
              <div className="text-xl font-black text-slate-900">12 Days</div>
              <div className="text-xs text-slate-500">Keep it up! You're doing great.</div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < 5 ? 'bg-emerald-500 text-white' : i === 5 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {i <= 5 ? '✓' : ''}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Time Spent Learning (Right 6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-slate-900">Time Spent Learning</h3>
            <select className="px-3 py-1 rounded-xl bg-slate-100 border-0 text-xs font-bold text-slate-700 cursor-pointer">
              <option value="This Month">This Month</option>
              <option value="This Week">This Week</option>
            </select>
          </div>

          <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2 border-b border-slate-100">
            {[
              { day: 'Mon', hours: '1.5h', height: '40%' },
              { day: 'Tue', hours: '2.0h', height: '60%' },
              { day: 'Wed', hours: '1.8h', height: '50%' },
              { day: 'Thu', hours: '2.5h', height: '80%' },
              { day: 'Fri', hours: '1.2h', height: '35%' },
              { day: 'Sat', hours: '2.1h', height: '65%' },
              { day: 'Sun', hours: '1.9h', height: '55%' }
            ].map(item => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-bold text-slate-500">{item.hours}</span>
                <div className="w-full bg-blue-500 rounded-t-lg transition-all" style={{ height: item.height }} />
              </div>
            ))}
          </div>

          <div className="flex justify-between text-xs text-slate-400 font-medium px-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

      </div>
    </div>
  );
}
