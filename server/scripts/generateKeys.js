/**
 * Script: generateKeys.js
 * 
 * IMPORTANT ARCHITECTURAL NOTE:
 * This script is executed ONCE during project setup to generate the ECDSA key pair (curve P-256 / prime256v1).
 * It writes:
 *   - /keys/private.pem  (NEVER COMMITTED TO GIT - used strictly server-side to sign credentials)
 *   - /keys/public.pem   (Publicly distributed - used by third-party verifiers to verify authenticity)
 * 
 * WARNING: Do NOT run this script on every server start! Regenerating the key pair will invalidate
 * all previously issued learner credentials because their ECDSA signatures were computed with the old private key.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function generateKeys() {
  const keysDir = path.join(__dirname, '../../keys');
  if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true });
  }

  const privateKeyPath = path.join(keysDir, 'private.pem');
  const publicKeyPath = path.join(keysDir, 'public.pem');

  // Skip generation if keys already exist to prevent accidental key rotation
  if (fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath)) {
    console.log('[Generate Keys] Keys already exist in /keys. Skipping generation to preserve validity of issued credentials.');
    return;
  }

  console.log('[Generate Keys] Generating new ECDSA P-256 (prime256v1) key pair...');

  const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'prime256v1', // P-256 / secp256r1
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  fs.writeFileSync(privateKeyPath, privateKey, 'utf8');
  fs.writeFileSync(publicKeyPath, publicKey, 'utf8');

  console.log('[Generate Keys] Key pair successfully generated!');
  console.log(`[Generate Keys] Private Key saved to: ${privateKeyPath} (GITIGNORED)`);
  console.log(`[Generate Keys] Public Key saved to:  ${publicKeyPath}`);
}

generateKeys();
