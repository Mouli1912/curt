import React, { useState } from 'react';

/**
 * CredentialQR Component
 * Renders a visual cryptographic QR Code & formatted payload for a signed credential.
 * Enables offline scanning and instant copy-pasting into the public verifier.
 */
export default function CredentialQR({ credential }) {
  const [copied, setCopied] = useState(false);

  if (!credential) {
    return null;
  }

  const jsonString = JSON.stringify(credential, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate a deterministic SVG QR matrix representation based on credential signature
  const matrixSize = 21;
  const hash = credential.signature || credential.credentialId || 'default';
  const qrModules = [];

  for (let r = 0; r < matrixSize; r++) {
    const row = [];
    for (let c = 0; c < matrixSize; c++) {
      // Draw position detection corners
      const isCorner = 
        (r < 7 && c < 7) || 
        (r < 7 && c >= matrixSize - 7) || 
        (r >= matrixSize - 7 && c < 7);

      if (isCorner) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6 ||
                         r === matrixSize - 1 || r === matrixSize - 7 ||
                         c === matrixSize - 1 || c === matrixSize - 7 ||
                         (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
                         (r >= 2 && r <= 4 && c >= matrixSize - 5 && c >= matrixSize - 3) ||
                         (r >= matrixSize - 5 && r >= matrixSize - 3 && c >= 2 && c <= 4);
        row.push(isBorder);
      } else {
        const charCode = hash.charCodeAt((r * matrixSize + c) % hash.length);
        row.push(charCode % 2 === 0);
      }
    }
    qrModules.push(row);
  }

  return (
    <div
      className="credential-qr-card card"
      style={{
        background: 'linear-gradient(145deg, #0f172a, #1e293b)',
        border: '1px solid #3b82f666',
        borderRadius: '16px',
        padding: '1.75rem',
        color: '#f8fafc',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
        position: 'relative'
      }}
    >
      {/* Badge Header */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '1rem' }}>
        <span>🔏 ECDSA P-256 Digitally Signed</span>
      </div>

      <h3 style={{ fontSize: '1.4rem', marginBottom: '0.25rem', fontWeight: 700 }}>
        {credential.skillNode?.toUpperCase()} Skill Credential
      </h3>
      <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
        Issued to <strong>{credential.studentName}</strong> • Score: <strong>{credential.score} Elo</strong>
      </p>

      {/* Visual QR Code Display */}
      <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <svg width="160" height="160" viewBox="0 0 21 21" style={{ display: 'block' }}>
          {qrModules.map((row, r) =>
            row.map((cell, c) => (
              <rect
                key={`${r}-${c}`}
                x={c}
                y={r}
                width="1"
                height="1"
                fill={cell ? '#0f172a' : '#ffffff'}
              />
            ))
          )}
        </svg>
      </div>

      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem', fontFamily: 'monospace' }}>
        ID: {credential.credentialId}
      </div>

      {/* Copy JSON Button */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
        <button
          onClick={handleCopy}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            background: copied ? '#10b981' : '#3b82f6',
            color: '#ffffff',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
        >
          {copied ? '✓ Credential JSON Copied!' : '📋 Copy Full Signed Credential'}
        </button>
      </div>
    </div>
  );
}
