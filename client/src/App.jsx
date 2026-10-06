import React, { useState } from 'react';
import Landing from './pages/Landing';
import Assessment from './pages/Assessment';
import GapReport from './pages/GapReport';
import CredentialVerify from './pages/CredentialVerify';
import AdminView from './pages/AdminView';
import RecruiterSearch from './pages/RecruiterSearch';
import PublicProfile from './pages/PublicProfile';
import AdminAnalytics from './pages/AdminAnalytics';
import { useTheme } from './context/ThemeContext';
import './styles/index.css';

const DEMO_USERS = [
  {
    id: 'pro-user',
    name: 'pro-user',
    label: 'Pro Learner',
    badge: '⭐ Pro (Near Complete)',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    avatarBg: 'bg-gradient-to-br from-amber-500 to-amber-700',
    initials: 'PRO',
    desc: 'Senior Candidate • 95% Complete • Signed ECDSA Credential'
  },
  {
    id: 'mid-user',
    name: 'mid-user',
    label: 'Mid Learner',
    badge: '🟡 Mid-Progress (4 Proven)',
    color: 'bg-primary-100 text-primary-800 dark:bg-primary-950/60 dark:text-primary-300 border-primary-300 dark:border-primary-700',
    avatarBg: 'bg-gradient-to-br from-primary-500 to-indigo-600',
    initials: 'MID',
    desc: 'Mid-Level Candidate • 4 Skills Proven • 50% Readiness'
  },
  {
    id: 'fresh-user',
    name: 'fresh-user',
    label: 'Fresh Learner',
    badge: '🟢 Fresh Start (0%)',
    color: 'bg-success-100 text-success-800 dark:bg-success-950/60 dark:text-success-300 border-success-300 dark:border-success-700',
    avatarBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    initials: 'NEW',
    desc: 'Fresh Candidate • 0% Progress • Inviting Onboarding Slate'
  },
  {
    id: 'recruiter-user',
    name: 'recruiter-user',
    label: 'Recruiter Persona',
    badge: '💼 Tech Recruiter',
    color: 'bg-accent-100 text-accent-800 dark:bg-accent-950/60 dark:text-accent-300 border-accent-300 dark:border-accent-700',
    avatarBg: 'bg-gradient-to-br from-purple-600 to-accent-600',
    initials: 'REC',
    desc: 'Tech Talent Recruiter • Talent Search & Bulk Credential Verification'
  }
];

const TARGET_ROLES = [
  { id: 'frontend-developer', label: '🎨 Frontend Developer', taxonomyCount: '34 skills' },
  { id: 'backend-developer', label: '⚙️ Backend Developer', taxonomyCount: '30 skills' },
  { id: 'data-analyst', label: '📊 Data Analyst', taxonomyCount: '26 skills' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [selectedUser, setSelectedUser] = useState('pro-user');
  const [selectedRole, setSelectedRole] = useState('frontend-developer');
  const [targetUsername, setTargetUsername] = useState('surajbhan');
  const { theme, toggleTheme } = useTheme();

  const activePersona = DEMO_USERS.find(u => u.id === selectedUser) || DEMO_USERS[0];

  const handleOpenProfile = (username) => {
    setTargetUsername(username || 'surajbhan');
    setActiveTab('profile');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 flex flex-col">
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Left Brand & SDG Tag */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('landing')}
                className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-1"
                aria-label="SkillPath Home"
              >
                <span className="text-2xl transition-transform group-hover:scale-110">🎓</span>
                <span className="font-extrabold text-xl tracking-tight text-neutral-900 dark:text-white">
                  Skill<span className="text-primary-600 dark:text-primary-400">Path</span>
                </span>
              </button>

              <span className="hidden xl:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-accent-100 text-accent-700 dark:bg-accent-950 dark:text-accent-300 border border-accent-200 dark:border-accent-800 tracking-wide uppercase">
                SDG 4 TRACK
              </span>
            </div>

            {/* Middle: Role Picker & Demo Account Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Role Selector */}
              <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800/80 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700">
                <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider hidden sm:inline">
                  ROLE:
                </span>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-bold text-primary-700 dark:text-primary-300 border-none cursor-pointer focus:outline-none pr-1"
                  aria-label="Select Target Career Role"
                >
                  {TARGET_ROLES.map(r => (
                    <option key={r.id} value={r.id} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Demo Persona Switcher */}
              <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800/80 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700">
                <span className={`w-2 h-2 rounded-full ${selectedUser === 'pro-user' ? 'bg-amber-500' : selectedUser === 'mid-user' ? 'bg-primary-500' : selectedUser === 'recruiter-user' ? 'bg-purple-500' : 'bg-emerald-500'}`} />
                <select
                  value={selectedUser}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedUser(val);
                    if (val === 'recruiter-user') {
                      setActiveTab('recruiter');
                    }
                  }}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-none cursor-pointer focus:outline-none pr-1"
                  aria-label="Select Demo Account Persona"
                >
                  <option value="pro-user" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">⭐ pro-user (Near Complete)</option>
                  <option value="mid-user" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">🟡 mid-user (4 Proven)</option>
                  <option value="fresh-user" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">🟢 fresh-user (Fresh Start 0%)</option>
                  <option value="recruiter-user" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">💼 recruiter-user (Recruiter Persona)</option>
                </select>
              </div>
            </div>

            {/* Right Side: Navigation Tabs, Dark Mode Toggle & Avatar */}
            <div className="flex items-center gap-2 sm:gap-3">
              <nav className="hidden xl:flex items-center gap-1" aria-label="Main Navigation">
                <button
                  onClick={() => setActiveTab('landing')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    activeTab === 'landing'
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                  aria-current={activeTab === 'landing' ? 'page' : undefined}
                >
                  <span>🏠</span> Home
                </button>

                <button
                  onClick={() => setActiveTab('assessment')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    activeTab === 'assessment'
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                  aria-current={activeTab === 'assessment' ? 'page' : undefined}
                >
                  <span>⚡</span> Assessment
                </button>

                <button
                  onClick={() => setActiveTab('report')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    activeTab === 'report'
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                  aria-current={activeTab === 'report' ? 'page' : undefined}
                >
                  <span>🎯</span> Gap Report
                </button>

                <button
                  onClick={() => handleOpenProfile('surajbhan')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    activeTab === 'profile'
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                  aria-current={activeTab === 'profile' ? 'page' : undefined}
                >
                  <span>🌐</span> Shareable Profile
                </button>

                <button
                  onClick={() => setActiveTab('recruiter')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    activeTab === 'recruiter'
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                  aria-current={activeTab === 'recruiter' ? 'page' : undefined}
                >
                  <span>💼</span> Recruiter Search
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    activeTab === 'analytics'
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                  aria-current={activeTab === 'analytics' ? 'page' : undefined}
                >
                  <span>📊</span> Analytics
                </button>

                <button
                  onClick={() => setActiveTab('verify')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    activeTab === 'verify'
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                  aria-current={activeTab === 'verify' ? 'page' : undefined}
                >
                  <span>🛡️</span> Verify
                </button>
              </nav>



              {/* User Avatar with Persona Tooltip */}
              <div
                className={`w-9 h-9 rounded-full ${activePersona.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shadow-sm cursor-help ring-2 ring-white dark:ring-neutral-800`}
                title={activePersona.desc}
                aria-label={`Active persona: ${activePersona.label}`}
              >
                {activePersona.initials}
              </div>
            </div>

          </div>
        </div>

        {/* Responsive Mobile / Tablet Tab Strip */}
        <div className="xl:hidden flex overflow-x-auto border-t border-neutral-200 dark:border-neutral-800 px-4 py-2 gap-2 scrollbar-none bg-neutral-50/90 dark:bg-neutral-900/90">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'landing' ? 'bg-primary-600 text-white' : 'text-neutral-600 dark:text-neutral-300 bg-neutral-200/60 dark:bg-neutral-800'
            }`}
          >
            🏠 Home
          </button>
          <button
            onClick={() => setActiveTab('assessment')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'assessment' ? 'bg-primary-600 text-white' : 'text-neutral-600 dark:text-neutral-300 bg-neutral-200/60 dark:bg-neutral-800'
            }`}
          >
            ⚡ Assessment
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'report' ? 'bg-primary-600 text-white' : 'text-neutral-600 dark:text-neutral-300 bg-neutral-200/60 dark:bg-neutral-800'
            }`}
          >
            🎯 Gap Report
          </button>
          <button
            onClick={() => handleOpenProfile('surajbhan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'profile' ? 'bg-primary-600 text-white' : 'text-neutral-600 dark:text-neutral-300 bg-neutral-200/60 dark:bg-neutral-800'
            }`}
          >
            🌐 Shareable Profile
          </button>
          <button
            onClick={() => setActiveTab('recruiter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'recruiter' ? 'bg-primary-600 text-white' : 'text-neutral-600 dark:text-neutral-300 bg-neutral-200/60 dark:bg-neutral-800'
            }`}
          >
            💼 Recruiter Search
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'analytics' ? 'bg-primary-600 text-white' : 'text-neutral-600 dark:text-neutral-300 bg-neutral-200/60 dark:bg-neutral-800'
            }`}
          >
            📊 Analytics
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'verify' ? 'bg-primary-600 text-white' : 'text-neutral-600 dark:text-neutral-300 bg-neutral-200/60 dark:bg-neutral-800'
            }`}
          >
            🛡️ Verify
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'admin' ? 'bg-primary-600 text-white' : 'text-neutral-600 dark:text-neutral-300 bg-neutral-200/60 dark:bg-neutral-800'
            }`}
          >
            🛠️ Admin
          </button>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {activeTab === 'landing' && (
          <Landing
            targetRole={selectedRole}
            onSelectRole={setSelectedRole}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === 'assessment' && (
          <Assessment
            userId={selectedUser}
            targetRole={selectedRole}
            onFinish={() => setActiveTab('report')}
          />
        )}
        {activeTab === 'report' && (
          <GapReport
            userId={selectedUser}
            targetRole={selectedRole}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === 'profile' && (
          <PublicProfile
            username={targetUsername}
            currentUserId={selectedUser}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === 'recruiter' && (
          <RecruiterSearch
            onSelectProfile={handleOpenProfile}
          />
        )}
        {activeTab === 'analytics' && <AdminAnalytics />}
        {activeTab === 'verify' && <CredentialVerify />}
        {activeTab === 'admin' && <AdminView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-6 text-center text-xs text-neutral-500 dark:text-neutral-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold">
            <span>🎓 SkillPath Engine</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400">100% Deterministic (Zero LLM API)</span>
          </div>
          <div>
            Applied Elo Psychometric Engine & ECDSA P-256 Public Key Cryptography
          </div>
        </div>
      </footer>
    </div>
  );
}
