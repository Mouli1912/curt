/**
 * SkillPath Cryptographic ECDSA Key Generator
 * 
 * IMPORTANT: This script is run ONCE at project setup to generate the platform's
 * ECDSA P-256 (secp256r1) key pair used for signing credentials.
 * 
 * - /keys/private.pem : Secret key used exclusively by the server to sign credentials (GITIGNORED).
 * - /keys/public.pem  : Public key used by third parties & recruiters to verify credentials offline.
 * 
 * WARNING: Re-running this script will invalidate all previously issued credentials!
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

  console.log('[GenerateKeys] Generating ECDSA P-256 key pair...');

  const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
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

  fs.writeFileSync(privateKeyPath, privateKey, { mode: 0o600 });
  fs.writeFileSync(publicKeyPath, publicKey);

  console.log(`[GenerateKeys] Successfully written private key to: ${privateKeyPath}`);
  console.log(`[GenerateKeys] Successfully written public key to: ${publicKeyPath}`);
}

if (require.main === module) {
  generateKeys();
}

module.exports = { generateKeys };
