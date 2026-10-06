import React, { useState, useEffect } from 'react';
import CredentialQR from '../components/CredentialQR';

export default function CredentialVerify() {
  const [inputJson, setInputJson] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [publicKey, setPublicKey] = useState('');

  // Fetch public key on mount for verification badge display
  useEffect(() => {
    fetch('/api/credential/public-key')
      .then(res => res.json())
      .then(data => {
        if (data.publicKey) setPublicKey(data.publicKey);
      })
      .catch(err => console.error('Failed to fetch public key:', err));
  }, []);

  // Pre-load demo credential helper
  const handleLoadSample = async (persona = 'pro-user', tampered = false) => {
    try {
      setLoading(true);
      const res = await fetch('/api/credential/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: persona, skillNode: 'react' })
      });
      const cred = await res.json();

      if (tampered) {
        cred.score = 1850; // Tamper score value to fail signature verification!
      }

      const formatted = JSON.stringify(cred, null, 2);
      setInputJson(formatted);
      setResult(null);
      setLoading(false);
    } catch (err) {
      console.error('Failed sample load:', err);
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!inputJson.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const parsed = JSON.parse(inputJson);
      const res = await fetch('/api/credential/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        valid: false,
        error: 'JSON Syntax Error: Unparseable JSON input object.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-50 dark:bg-success-950/80 text-success-600 dark:text-success-400 flex items-center justify-center text-xl font-extrabold border border-success-200 dark:border-success-800">
              🛡️
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Public Credential Verifier
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Recruiter verification portal for ECDSA P-256 digital skill signatures.
          </p>
        </div>
      </div>

      {/* Main Form & Preset Quick Triggers */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-sm font-extrabold text-neutral-900 dark:text-white">
            Paste Signed Credential JSON:
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleLoadSample('pro-user', false)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              Paste Pro Sample
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('mid-user', false)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              Paste Mid Sample
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('pro-user', true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-danger-50 dark:bg-danger-950 text-danger-700 dark:text-danger-300 border border-danger-200 dark:border-danger-800 hover:bg-danger-100 transition-colors"
            >
              Paste Tampered Sample
            </button>
          </div>
        </div>

        <textarea
          rows={7}
          value={inputJson}
          onChange={(e) => setInputJson(e.target.value)}
          placeholder='Paste JSON object containing { credentialId, studentId, studentName, skillNode, score, signature }...'
          className="w-full p-4 rounded-xl border border-neutral-300 dark:border-neutral-700 font-mono text-xs bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-y"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            🔒 Offline-ready cryptographic validation using public key matching.
          </div>

          <button
            onClick={handleVerify}
            disabled={!inputJson.trim() || loading}
            className={`px-6 py-3 rounded-xl font-extrabold text-sm text-white shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              !inputJson.trim() || loading
                ? 'bg-neutral-400 dark:bg-neutral-700 cursor-not-allowed opacity-60'
                : 'bg-primary-600 hover:bg-primary-500 shadow-primary-600/25'
            }`}
          >
            {loading ? 'Verifying Signature...' : 'Verify Signature →'}
          </button>
        </div>
      </div>

      {/* Verification Result Display */}
      {result && (
        <div className={`bg-white dark:bg-neutral-900 border-2 rounded-3xl p-6 sm:p-8 shadow-md transition-all animate-pop-in ${
          result.valid
            ? 'border-success-500 dark:border-success-600 bg-success-50/40 dark:bg-success-950/20'
            : 'border-danger-500 dark:border-danger-600 bg-danger-50/40 dark:bg-danger-950/20'
        }`}>
          {result.valid ? (
            <div className="space-y-6">
              {/* Valid Banner Header */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-success-600 text-white flex items-center justify-center text-3xl font-black shrink-0 shadow-md">
                  ✓
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-success-900 dark:text-success-100">
                    AUTHENTIC CRYPTOGRAPHIC CREDENTIAL
                  </h2>
                  <p className="text-xs sm:text-sm text-success-700 dark:text-success-300 font-medium">
                    ECDSA P-256 signature verified against platform public key. Zero tampering detected.
                  </p>
                </div>
              </div>

              {/* Decoded Credential Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-success-200 dark:border-success-800/60 shadow-sm">
                
                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <div className="font-bold text-neutral-400 dark:text-neutral-500 uppercase text-[11px]">Learner Name</div>
                    <div className="font-black text-neutral-900 dark:text-white text-lg mt-0.5">{result.payload?.studentName}</div>
                  </div>

                  <div>
                    <div className="font-bold text-neutral-400 dark:text-neutral-500 uppercase text-[11px]">Verified Skill</div>
                    <div className="font-black text-primary-600 dark:text-primary-400 text-lg uppercase mt-0.5">{result.payload?.skillNode}</div>
                  </div>

                  <div>
                    <div className="font-bold text-neutral-400 dark:text-neutral-500 uppercase text-[11px]">Elo Score</div>
                    <div className="font-black text-success-600 dark:text-success-400 text-lg mt-0.5">{result.payload?.score} Elo</div>
                  </div>

                  <div>
                    <div className="font-bold text-neutral-400 dark:text-neutral-500 uppercase text-[11px]">Target Role</div>
                    <div className="font-bold text-neutral-900 dark:text-white mt-0.5">{result.payload?.targetRole}</div>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="font-bold text-neutral-400 dark:text-neutral-500 uppercase text-[11px]">Credential ID</div>
                    <div className="font-mono text-xs text-neutral-700 dark:text-neutral-300 mt-0.5">{result.payload?.credentialId}</div>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="font-bold text-neutral-400 dark:text-neutral-500 uppercase text-[11px]">Issued Timestamp</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">{new Date(result.payload?.issuedAt).toLocaleString()}</div>
                  </div>
                </div>

                {/* QR Code preview */}
                <div className="md:col-span-4 flex items-center justify-center text-center">
                  <CredentialQR credential={result.payload} size={150} />
                </div>

              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Invalid Banner Header */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-danger-600 text-white flex items-center justify-center text-3xl font-black shrink-0 shadow-md">
                  ✕
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-danger-900 dark:text-danger-100">
                    INVALID OR TAMPERED CREDENTIAL
                  </h2>
                  <p className="text-xs sm:text-sm text-danger-700 dark:text-danger-300 font-medium">
                    {result.error || 'Cryptographic signature verification failed.'}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-danger-800 dark:text-danger-200 leading-relaxed bg-danger-100/50 dark:bg-danger-950/60 p-4 rounded-xl border border-danger-200 dark:border-danger-900">
                This credential payload could not be verified against the platform public key. Either payload attributes (e.g. score or name) were altered after signing, or it was signed with an untrusted private key.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Public Key Inspector Drawer */}
      {publicKey && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 space-y-3">
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>🔑</span> Platform Public Key (ECDSA P-256)
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Recruiters and external platforms use this public key to verify student credentials offline without database access.
          </p>
          <pre className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 overflow-x-auto">
            {publicKey}
          </pre>
        </div>
      )}
    </div>
  );
}
