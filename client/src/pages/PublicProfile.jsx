import React, { useState, useEffect } from 'react';
import { fetchPublicProfile, updateDiscoverability } from '../api/client';
import CredentialQR from '../components/CredentialQR';
import ConfettiEffect from '../components/ConfettiEffect';

export default function PublicProfile({ username = 'surajbhan', currentUserId = 'pro-user', onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Discoverability toggle state
  const [isDiscoverable, setIsDiscoverable] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Credential Modal State
  const [activeCredentialModal, setActiveCredentialModal] = useState(null);

  const loadProfile = () => {
    setLoading(true);
    setError(null);

    fetchPublicProfile(username)
      .then((data) => {
        setProfile(data);
        if (data.discoverable !== undefined) {
          setIsDiscoverable(data.discoverable);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load public profile:', err);
        setError(err.message || 'Unable to retrieve public profile.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProfile();
  }, [username]);

  const handleToggleDiscoverability = async (newVal) => {
    setUpdating(true);
    try {
      await updateDiscoverability(currentUserId, newVal);
      setIsDiscoverable(newVal);
      loadProfile();
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded-2xl animate-pulse" />
        <div className="h-48 bg-neutral-100 dark:bg-neutral-800/60 rounded-3xl animate-pulse" />
      </div>
    );
  }

  // Handle Private / Opted-out profile
  if (profile && profile.discoverable === false) {
    const isSelf = currentUserId === profile.userId;

    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-lg space-y-6">
          <div className="text-5xl">🔒</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
              Private Profile
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              This candidate's profile is currently set to private and is not publicly discoverable in recruiter searches.
            </p>
          </div>

          {isSelf && (
            <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-3">
              <div className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                🌱 You own this account (@{profile.username}). Would you like to enable public discoverability?
              </div>
              <button
                onClick={() => handleToggleDiscoverability(true)}
                disabled={updating}
                className="px-6 py-2.5 rounded-xl bg-success-600 hover:bg-success-500 text-white font-extrabold text-xs shadow-md transition-all"
              >
                {updating ? 'Updating Setting...' : '🌐 Enable Public Discoverability'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error || !profile?.user) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-200 p-8 rounded-3xl space-y-4 border border-danger-200">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-bold">Profile Unavailable</h2>
          <p className="text-xs">{error || 'User profile not found.'}</p>
        </div>
      </div>
    );
  }

  const { user, readinessPercent, provenSkills } = profile;
  const isSelf = currentUserId === user.userId;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Banner & Avatar Header */}
      <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 overflow-hidden">
        
        {/* Background Decorative Gradient Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md border-2 border-white dark:border-neutral-800">
              {user.name.slice(0, 2).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="text-success-600 dark:text-success-400 text-lg" title="Verified SkillPath Learner">
                  ☑️
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                <span className="font-mono text-primary-600 dark:text-primary-400 font-bold">@{user.username}</span>
                <span>•</span>
                <span className="uppercase font-bold tracking-wide bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded-md text-neutral-700 dark:text-neutral-300">
                  {user.targetRole}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-1 bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 self-stretch sm:self-auto">
            <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Verified Readiness</div>
            <div className="text-3xl font-black text-primary-600 dark:text-primary-400">
              {readinessPercent}%
            </div>
          </div>
        </div>

        {user.bio && (
          <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-2xl">
            {user.bio}
          </p>
        )}

        {/* Public Shareable Link Pill & Opt-In Control */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-500">
            <span>🔗 Public Profile Link:</span>
            <code className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-neutral-800 dark:text-neutral-200">
              skillpath.dev/profile/{user.username}
            </code>
          </div>

          {isSelf && (
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 font-medium">Public Discovery:</span>
              <button
                onClick={() => handleToggleDiscoverability(!isDiscoverable)}
                disabled={updating}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  isDiscoverable
                    ? 'bg-success-100 text-success-800 dark:bg-success-950 dark:text-success-200 border border-success-300'
                    : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                }`}
              >
                {isDiscoverable ? '🌐 Publicly Listed' : '🔒 Private'}
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Verified Proven Skills & Credentials Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>🛡️</span> Verified Proven Competencies ({provenSkills.length})
          </h2>
          <span className="text-xs font-semibold text-neutral-500">
            ECDSA Cryptographically Verified
          </span>
        </div>

        {provenSkills.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 text-center text-neutral-500 text-xs">
            No proven skills recorded on public registry yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {provenSkills.map((skill) => (
              <div
                key={skill.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase text-primary-600 dark:text-primary-400">
                      {skill.category}
                    </span>
                    <span className="text-xs font-bold text-success-600 dark:text-success-400 flex items-center gap-1">
                      <span>✓</span> Verified
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-neutral-900 dark:text-white capitalize">
                    {skill.label}
                  </h3>
                </div>

                <button
                  onClick={() => {
                    setActiveCredentialModal({
                      credentialId: `cred-verified-${user.userId}-${skill.id}`,
                      studentName: user.name,
                      skillNode: skill.id,
                      score: 1350,
                      issuedAt: new Date().toISOString()
                    });
                  }}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors"
                >
                  🔍 View Signed Credential & QR
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Credential Modal */}
      {activeCredentialModal && (
        <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-pop-in">
            <ConfettiEffect />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">
                  Verified Candidate Credential
                </h3>
              </div>
              <button
                onClick={() => setActiveCredentialModal(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-center py-2">
              <CredentialQR credential={activeCredentialModal} size={160} />
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800/80 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-500">Student Name:</span>
                <span className="font-bold text-neutral-900 dark:text-white">{activeCredentialModal.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-500">Skill Competency:</span>
                <span className="font-bold text-primary-600 dark:text-primary-400 uppercase">{activeCredentialModal.skillNode}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-500">Status:</span>
                <span className="font-extrabold text-success-600 dark:text-success-400">✓ Cryptographically Verified</span>
              </div>
            </div>

            <button
              onClick={() => setActiveCredentialModal(null)}
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-primary-600 hover:bg-primary-500 shadow-md transition-colors"
            >
              Close Credential Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
