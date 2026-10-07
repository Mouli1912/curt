import React from 'react';

export default function Header({
  selectedUser,
  setSelectedUser,
  selectedRole,
  setSelectedRole,
  demoUsers,
  targetRoles,
  onToggleMobile,
  searchQuery,
  setSearchQuery
}) {
  const activePersona = (demoUsers && demoUsers.find(u => u.id === selectedUser)) || { name: 'Suraj Bhan', initials: 'SB' };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left Search Bar + Mobile Menu Button */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar navigation"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search skills, assessments, or learning resources..."
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100/80 border-0 text-sm placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 font-medium"
          />
        </div>
      </div>

      {/* Right Controls & User Profile */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        
        {/* Role & Persona Controls (Preserving functionality) */}
        {targetRoles && (
          <div className="hidden md:flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ROLE:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole && setSelectedRole(e.target.value)}
              className="bg-transparent text-xs font-bold text-blue-600 border-none cursor-pointer focus:outline-none pr-1"
            >
              {targetRoles.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>
        )}

        {demoUsers && (
          <div className="hidden md:flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser && setSelectedUser(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 border-none cursor-pointer focus:outline-none pr-1"
            >
              <option value="pro-user">⭐ pro-user (Suraj)</option>
              <option value="mid-user">🟡 mid-user (Alex)</option>
              <option value="fresh-user">🟢 fresh-user (Morgan)</option>
              <option value="recruiter-user">💼 recruiter-user</option>
            </select>
          </div>
        )}

        {/* Notification Bell */}
        <button
          className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        {/* User Profile Info */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
            {activePersona.initials || 'SB'}
          </div>

          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight">
              Suraj Bhan
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Student
            </div>
          </div>

          <svg className="w-4 h-4 text-slate-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

      </div>
    </header>
  );
}
