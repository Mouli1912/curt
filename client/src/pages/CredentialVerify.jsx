import React, { useState } from 'react';

export default function CredentialVerify() {
  const [activeSubTab, setActiveSubTab] = useState('qr');
  const [isVerified, setIsVerified] = useState(true); // Default to verified view matching screenshot 4 right panel

  return (
    <div className="container">
      {/* 2-Column Split matching Screenshot 4 (or Tab Toggle) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Left Card - Verification Input View */}
        <div className="card-white" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="header-title-group" style={{ marginBottom: '0.25rem' }}>
            <div className="header-icon-box" style={{ background: '#f3e8ff', color: '#8b5cf6' }}>
              🔮
            </div>
            <h1 className="page-title" style={{ fontSize: '1.5rem' }}>Verify Credential</h1>
          </div>
          <p className="page-subtitle" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Verify the authenticity of a SkillPath credential.
          </p>

          {/* Tabs Header */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setActiveSubTab('qr')}
              style={{
                padding: '0.6rem 1rem',
                border: 'none',
                background: 'transparent',
                fontWeight: 700,
                fontSize: '0.9rem',
                color: activeSubTab === 'qr' ? '#2563eb' : '#64748b',
                borderBottom: activeSubTab === 'qr' ? '2.5px solid #2563eb' : 'none',
                cursor: 'pointer',
                marginBottom: '-1px'
              }}
            >
              Verify by QR Code
            </button>
            <button
              onClick={() => setActiveSubTab('id')}
              style={{
                padding: '0.6rem 1rem',
                border: 'none',
                background: 'transparent',
                fontWeight: 700,
                fontSize: '0.9rem',
                color: activeSubTab === 'id' ? '#2563eb' : '#64748b',
                borderBottom: activeSubTab === 'id' ? '2.5px solid #2563eb' : 'none',
                cursor: 'pointer',
                marginBottom: '-1px'
              }}
            >
              Verify by ID
            </button>
          </div>

          {/* Dotted Upload Box */}
          <div style={{
            border: '2px dashed #cbd5e1',
            borderRadius: '16px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            background: '#f8fafc',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '0.75rem'
            }}>
              📷
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
              Scan a QR Code
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '280px', marginBottom: '1.5rem', lineHeight: 1.4 }}>
              Upload an image or use your camera to scan a credential QR code.
            </p>

            <button className="btn-primary" onClick={() => setIsVerified(true)} style={{ marginBottom: '0.75rem' }}>
              <span>📤</span> Upload Image
            </button>

            <span style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>
              or use camera
            </span>
          </div>
        </div>

        {/* Right Card - Verification Success View */}
        <div className="card-white" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              Credential Verified Successfully!
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              This credential is authentic and was issued by SkillPath.
            </p>
          </div>

          {/* Verified Card */}
          <div style={{
            border: '1px solid #a7f3d0',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {/* Top Green Banner */}
            <div style={{
              background: '#ecfdf5',
              padding: '0.75rem 1.25rem',
              color: '#065f46',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderBottom: '1px solid #a7f3d0'
            }}>
              <span style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#10b981',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem'
              }}>✓</span>
              Verified Credential
            </div>

            {/* Content Details */}
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Field 1: Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.2rem', color: '#64748b' }}>👤</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Name</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Suraj Bhan Kumar</div>
                  </div>
                </div>

                {/* Field 2: Skill Track */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.2rem', color: '#64748b' }}>🎓</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Skill Track</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155' }}>SDG 4 - Quality Education</div>
                  </div>
                </div>

                {/* Field 3: Assessment Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.2rem', color: '#64748b' }}>📅</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Assessment Date</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>Jun 15, 2024</div>
                  </div>
                </div>

                {/* Field 4: Credential ID */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.2rem', color: '#64748b' }}>🔑</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Credential ID</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>SP-SDG4-2024-001234</div>
                  </div>
                </div>
              </div>

              {/* Right Side QR Code Graphic */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '90px',
                  height: '90px',
                  background: '#0f172a',
                  borderRadius: '12px',
                  margin: '0 auto 0.75rem auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '2.5rem'
                }}>
                  📷
                </div>
                <a href="#verify" style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
                  View on Cryptographic Ledger →
                </a>
              </div>
            </div>

            {/* Bottom Footer Action Buttons */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
              background: '#f8fafc'
            }}>
              <button className="btn-secondary" style={{ width: '50%', justifyContent: 'center' }}>
                <span>📥</span> Download Certificate
              </button>
              <button className="btn-primary" style={{ width: '50%', justifyContent: 'center' }}>
                <span>🚀</span> Share Credential
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
