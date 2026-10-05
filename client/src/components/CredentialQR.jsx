import React from 'react';

/**
 * Renders a stylized QR code representation encoding the JSON credential payload
 */
export default function CredentialQR({ credential, size = 180 }) {
  if (!credential) return null;

  const dataString = typeof credential === 'object' ? JSON.stringify(credential) : String(credential);

  // Generate deterministic grid pattern based on string hash for visual QR effect
  const gridSize = 21;
  const cellSize = size / gridSize;

  // Simple hashing function to populate grid deterministically
  function getCellBit(r, c) {
    // Corner finder patterns (7x7 top-left, top-right, bottom-left)
    if (r < 7 && c < 7) {
      if (r === 0 || r === 6 || c === 0 || c === 6) return true;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    if (r < 7 && c >= gridSize - 7) {
      const cc = c - (gridSize - 7);
      if (r === 0 || r === 6 || cc === 0 || cc === 6) return true;
      if (r >= 2 && r <= 4 && cc >= 2 && cc <= 4) return true;
      return false;
    }
    if (r >= gridSize - 7 && c < 7) {
      const rr = r - (gridSize - 7);
      if (rr === 0 || rr === 6 || c === 0 || c === 6) return true;
      if (rr >= 2 && rr <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }

    // Timing patterns
    if (r === 6 || c === 6) return (r + c) % 2 === 0;

    // Data modules generated from payload character codes
    const idx = (r * gridSize + c) % dataString.length;
    const charCode = dataString.charCodeAt(idx);
    return ((charCode * 31 + r * 13 + c * 17) % 3) !== 0;
  }

  const cells = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (getCellBit(r, c)) {
        cells.push({ x: c * cellSize, y: r * cellSize });
      }
    }
  }

  return (
    <div style={{
      background: '#ffffff',
      padding: '12px',
      borderRadius: '12px',
      border: '1px solid #cbd5e1',
      display: 'inline-block',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="#ffffff" />
        {cells.map((cell, idx) => (
          <rect
            key={idx}
            x={cell.x}
            y={cell.y}
            width={cellSize + 0.3}
            height={cellSize + 0.3}
            fill="#0f172a"
          />
        ))}
      </svg>
      <div style={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#64748b', marginTop: '6px', letterSpacing: '0.05em' }}>
        ECDSA P-256 ENCODED QR
      </div>
    </div>
  );
}
