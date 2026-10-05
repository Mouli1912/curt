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
  const handleLoadSample = async (tampered = false) => {
    try {
      setLoading(true);
      const res = await fetch('/api/credential/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'pro-user', skillNode: 'react' })
      });
      const cred = await res.json();

      if (tampered) {
        cred.score = 1600; // Modify score to simulate tampering!
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
        error: 'JSON Parsing Error: Invalid JSON string format.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="header-title-group">
            <div className="header-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
              🛡️
            </div>
            <h1 className="page-title">Credential Verification Portal</h1>
          </div>
          <p className="page-subtitle">
            Cryptographically verify the authenticity of SkillPath credentials using ECDSA P-256 signatures.
          </p>
        </div>
      </div>

      {/* Main Form & Demo Triggers */}
      <div className="card-white" style={{ padding: '2rem', marginBottom: '2rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
            Paste Signed Credential JSON:
          </label>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              onClick={() => handleLoadSample(false)}
            >
              Paste Valid Sample
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', color: '#b91c1c', borderColor: '#fca5a5' }}
              onClick={() => handleLoadSample(true)}
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
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            background: '#f8fafc',
            marginBottom: '1.25rem',
            resize: 'vertical'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            🔒 Verification runs entirely offline via public key cryptography without DB lookup.
          </div>

          <button
            className="btn-primary"
            onClick={handleVerify}
            disabled={!inputJson.trim() || loading}
            style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
          >
            {loading ? 'Verifying Signature...' : 'Verify Signature →'}
          </button>
        </div>
      </div>

      {/* Verification Result Display */}
      {result && (
        <div className="card-white" style={{
          padding: '2.25rem',
          border: result.valid ? '2px solid #10b981' : '2px solid #ef4444',
          background: result.valid ? '#f0fdf4' : '#fef2f2',
          marginBottom: '2rem'
        }}>
          {result.valid ? (
            <div>
              {/* Valid Banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#10b981',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  fontWeight: 900
                }}>
                  ✓
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#065f46', margin: 0 }}>
                    AUTHENTIC CRYPTOGRAPHIC CREDENTIAL
                  </h2>
                  <p style={{ color: '#047857', fontSize: '0.9rem', margin: 0 }}>
                    ECDSA P-256 signature verified against public key. No tampering detected.
                  </p>
                </div>
              </div>

              {/* Decoded Credential Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '2rem', background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Learner Name</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{result.payload?.studentName}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Verified Skill</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>{result.payload?.skillNode}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Elo Score</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981' }}>{result.payload?.score} Elo</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Target Role</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{result.payload?.targetRole}</div>
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Credential ID</div>
                    <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#475569' }}>{result.payload?.credentialId}</div>
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Issued Timestamp</div>
                    <div style={{ fontSize: '0.85rem', color: '#475569' }}>{new Date(result.payload?.issuedAt).toLocaleString()}</div>
                  </div>
                </div>

                {/* QR Code preview */}
                <div style={{ textAlign: 'center' }}>
                  <CredentialQR credential={result.payload} size={150} />
                </div>

              </div>
            </div>
          ) : (
            <div>
              {/* Invalid Banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  fontWeight: 900
                }}>
                  ✕
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#991b1b', margin: 0 }}>
                    INVALID OR TAMPERED CREDENTIAL
                  </h2>
                  <p style={{ color: '#b91c1c', fontSize: '0.9rem', margin: 0 }}>
                    {result.error || 'Cryptographic signature verification failed.'}
                  </p>
                </div>
              </div>

              <p style={{ color: '#7f1d1d', fontSize: '0.85rem', lineHeight: 1.4 }}>
                This credential could not be verified against the platform public key. Either the payload data (e.g. score or name) was altered after signing, or it was signed with an untrusted private key.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Public Key Inspector Drawer */}
      {publicKey && (
        <div className="card-white" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            🔑 Platform Public Key (ECDSA P-256)
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>
            Recruiters and external systems use this public key to verify credentials completely offline.
          </p>
          <pre style={{
            background: '#f8fafc',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '0.75rem',
            color: '#334155',
            overflowX: 'auto'
          }}>
            {publicKey}
          </pre>
        </div>
      )}
    </div>
  );
}
