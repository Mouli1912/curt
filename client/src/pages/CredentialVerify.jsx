import React, { useState, useEffect } from 'react';
import { verifyCredential, fetchPublicKey } from '../api/client';

export default function CredentialVerify() {
  const [credentialInput, setCredentialInput] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [publicKeyInfo, setPublicKeyInfo] = useState(null);

  useEffect(() => {
    fetchPublicKey()
      .then(data => setPublicKeyInfo(data))
      .catch(err => console.warn('Could not fetch public key:', err.message));
  }, []);

  const handleVerify = async () => {
    if (!credentialInput.trim()) return;

    setVerifying(true);
    setVerificationResult(null);

    try {
      let parsedObj;
      try {
        parsedObj = JSON.parse(credentialInput.trim());
      } catch (err) {
        setVerificationResult({
          valid: false,
          error: 'Invalid JSON format. Please paste a valid JSON credential object.'
        });
        setVerifying(false);
        return;
      }

      const result = await verifyCredential(parsedObj);
      setVerificationResult(result);
    } catch (err) {
      setVerificationResult({
        valid: false,
        error: err.message
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleLoadSample = (tamper = false) => {
    const sample = {
      credentialId: "c7b39a81-e291-49b0-8df9-42b7e199f123",
      studentId: "demo-user",
      studentName: "Alex Learner",
      skillNode: "javascript",
      score: tamper ? 1600 : 1150, // Tampered if true
      targetRole: "frontend-developer",
      issuedAt: new Date().toISOString(),
      // Sample valid signature placeholder - user can test live generated credentials
      signature: "MEYCIQDx9Z...sample_sig..."
    };
    setCredentialInput(JSON.stringify(sample, null, 2));
    setVerificationResult(null);
  };

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <span className="logo-badge">Public Verifier Portal — Step 4</span>
        <h1 style={{ fontSize: '2rem', margin: '0.25rem 0' }}>Independent Credential Verifier</h1>
        <p className="subtitle" style={{ fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto' }}>
          Verify the authenticity of any SkillPath credential offline using standard ECDSA P-256 digital signatures. No database lookup required.
        </p>
      </header>

      {/* Input Form Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', fontWeight: 600 }}>
          Paste Signed Credential JSON
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Paste the JSON object obtained from a learner's credential or QR code scan:
        </p>

        <textarea
          rows={8}
          value={credentialInput}
          onChange={(e) => setCredentialInput(e.target.value)}
          placeholder='{\n  "credentialId": "...",\n  "studentName": "...",\n  "skillNode": "javascript",\n  "score": 1150,\n  "signature": "..."\n}'
          style={{
            width: '100%',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            padding: '1rem',
            borderRadius: '8px',
            background: '#090d16',
            color: '#38bdf8',
            border: '1px solid #334155',
            marginBottom: '1.25rem',
            resize: 'vertical'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            onClick={handleVerify}
            disabled={verifying || !credentialInput.trim()}
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '8px',
              background: '#2563eb',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.95rem',
              border: 'none',
              cursor: verifying || !credentialInput.trim() ? 'default' : 'pointer',
              opacity: verifying || !credentialInput.trim() ? 0.6 : 1
            }}
          >
            {verifying ? 'Verifying Signature...' : '🛡️ Verify Credential Authenticity'}
          </button>
        </div>
      </div>

      {/* Verification Result Seal */}
      {verificationResult && (
        <div
          className="card"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            border: verificationResult.valid ? '2px solid #10b981' : '2px solid #ef4444',
            background: verificationResult.valid ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239, 68, 68, 0.06)',
            textAlign: 'center'
          }}
        >
          {verificationResult.valid ? (
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
              <h2 style={{ color: '#10b981', fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 800 }}>
                AUTHENTIC CREDENTIAL VERIFIED
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Cryptographic signature matches issuer's ECDSA P-256 public key. Payload has NOT been tampered with.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '1rem',
                  textAlign: 'left',
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Learner Name</span>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{verificationResult.payload?.studentName}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Proven Skill</span>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#38bdf8' }}>{verificationResult.payload?.skillNode?.toUpperCase()}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Elo Rating</span>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#34d399' }}>{verificationResult.payload?.score} Elo</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Target Role</span>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{verificationResult.payload?.targetRole}</div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Issuance Date</span>
                  <div style={{ fontWeight: 500, fontSize: '0.85rem', fontFamily: 'monospace' }}>{verificationResult.payload?.issuedAt}</div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>❌</div>
              <h2 style={{ color: '#ef4444', fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 800 }}>
                VERIFICATION FAILED
              </h2>
              <p style={{ color: '#fca5a5', fontSize: '0.95rem' }}>
                {verificationResult.error || 'Cryptographic signature mismatch. This credential is invalid or has been altered.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Public Key Inspector Info */}
      {publicKeyInfo && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
            🔑 Issuer ECDSA Public Key (P-256 / SHA-256)
          </h4>
          <pre
            style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              background: '#090d16',
              padding: '0.75rem',
              borderRadius: '6px',
              overflowX: 'auto',
              margin: 0
            }}
          >
            {publicKeyInfo.publicKey}
          </pre>
        </div>
      )}
    </div>
  );
}
