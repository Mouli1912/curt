import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import DashboardView from './pages/DashboardView';
import MySkills from './pages/MySkills';
import AssessmentsView from './pages/AssessmentsView';
import Learning from './pages/Learning';
import Progress from './pages/Progress';
import JobMatches from './pages/JobMatches';

import GapReport from './pages/GapReport';
import CredentialVerify from './pages/CredentialVerify';
import AdminView from './pages/AdminView';
import RecruiterSearch from './pages/RecruiterSearch';
import PublicProfile from './pages/PublicProfile';
import AdminAnalytics from './pages/AdminAnalytics';

import './styles/index.css';

const DEMO_USERS = [
  {
    id: 'pro-user',
    name: 'Suraj Bhan',
    label: 'Pro Learner (Suraj)',
    badge: '⭐ Pro (Near Complete)',
    initials: 'SB',
    desc: 'Senior Candidate • 95% Complete • Signed ECDSA Credential'
  },
  {
    id: 'mid-user',
    name: 'Alex Rivers',
    label: 'Mid Learner (Alex)',
    badge: '🟡 Mid-Progress (4 Proven)',
    initials: 'AR',
    desc: 'Mid-Level Candidate • 4 Skills Proven • 50% Readiness'
  },
  {
    id: 'fresh-user',
    name: 'Morgan Lee',
    label: 'Fresh Learner (Morgan)',
    badge: '🟢 Fresh Start (0%)',
    initials: 'ML',
    desc: 'Fresh Candidate • 0% Progress • Inviting Onboarding Slate'
  },
  {
    id: 'recruiter-user',
    name: 'Tech Recruiter',
    label: 'Recruiter Persona',
    badge: '💼 Tech Recruiter',
    initials: 'TR',
    desc: 'Tech Talent Recruiter • Talent Search & Bulk Credential Verification'
  }
];

const TARGET_ROLES = [
  { id: 'frontend-developer', label: '🎨 Frontend Developer' },
  { id: 'backend-developer', label: '⚙️ Backend Developer' },
  { id: 'data-analyst', label: '📊 Data Analyst' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState('pro-user');
  const [selectedRole, setSelectedRole] = useState('frontend-developer');
  const [targetUsername, setTargetUsername] = useState('surajbhan');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenProfile = (username) => {
    setTargetUsername(username || 'surajbhan');
    setActiveTab('profile');
  };

  const handleNavigation = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      <div className="flex flex-1">
        {/* Consistent Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onNavigate={handleNavigation}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Right Main Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <Header
            selectedUser={selectedUser}
            setSelectedUser={(val) => {
              setSelectedUser(val);
              if (val === 'recruiter-user') {
                setActiveTab('recruiter');
              }
            }}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            demoUsers={DEMO_USERS}
            targetRoles={TARGET_ROLES}
            onToggleMobile={() => setMobileOpen(!mobileOpen)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Secondary Quick Navigation Bar for Extra Features (Gap Report, Verification, Recruiter, Admin) */}
          <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-2 flex items-center gap-2 overflow-x-auto text-xs font-semibold scrollbar-none">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0 mr-1">
              ENGINEER TOOLS:
            </span>

            <button
              onClick={() => handleNavigation('report')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'report' ? 'bg-blue-600 text-white font-extrabold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>🎯</span> Skill Gap Report
            </button>

            <button
              onClick={() => handleOpenProfile('surajbhan')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'profile' ? 'bg-blue-600 text-white font-extrabold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>🌐</span> Shareable Profile
            </button>

            <button
              onClick={() => handleNavigation('recruiter')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'recruiter' ? 'bg-blue-600 text-white font-extrabold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>💼</span> Recruiter Search
            </button>

            <button
              onClick={() => handleNavigation('verify')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'verify' ? 'bg-blue-600 text-white font-extrabold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>🛡️</span> Verify ECDSA
            </button>

            <button
              onClick={() => handleNavigation('analytics')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'analytics' ? 'bg-blue-600 text-white font-extrabold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>📊</span> Analytics
            </button>

            <button
              onClick={() => handleNavigation('admin')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'admin' ? 'bg-blue-600 text-white font-extrabold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>🛠️</span> Admin
            </button>
          </div>

          {/* Main Content Body */}
          <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
            {(activeTab === 'dashboard' || activeTab === 'landing') && (
              <DashboardView
                targetRole={selectedRole}
                onSelectRole={setSelectedRole}
                onNavigate={handleNavigation}
              />
            )}

            {activeTab === 'my-skills' && (
              <MySkills onNavigate={handleNavigation} />
            )}

            {(activeTab === 'assessments' || activeTab === 'assessment') && (
              <AssessmentsView
                userId={selectedUser}
                targetRole={selectedRole}
                onFinish={() => handleNavigation('report')}
              />
            )}

            {activeTab === 'learning' && (
              <Learning onNavigate={handleNavigation} />
            )}

            {activeTab === 'progress' && (
              <Progress onNavigate={handleNavigation} />
            )}

            {activeTab === 'job-matches' && (
              <JobMatches onNavigate={handleNavigation} />
            )}

            {activeTab === 'report' && (
              <GapReport
                userId={selectedUser}
                targetRole={selectedRole}
                onNavigate={handleNavigation}
              />
            )}

            {activeTab === 'profile' && (
              <PublicProfile
                username={targetUsername}
                currentUserId={selectedUser}
                onNavigate={handleNavigation}
              />
            )}

            {activeTab === 'recruiter' && (
              <RecruiterSearch onSelectProfile={handleOpenProfile} />
            )}

            {activeTab === 'analytics' && <AdminAnalytics />}
            {activeTab === 'verify' && <CredentialVerify />}
            {activeTab === 'admin' && <AdminView />}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200 bg-white py-4 px-8 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <span>🎓 SkillPath Platform</span>
                <span>•</span>
                <span className="text-emerald-600">100% Deterministic (Zero LLM API)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Elo Psychometrics • IRT Engine • ECDSA P-256 Public Verification
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
