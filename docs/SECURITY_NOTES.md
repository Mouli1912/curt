# SkillPath Security Architecture & Threat Model Notes

This document provides a technical security evaluation of **SkillPath** (`Mouli1912/curt`) — an adaptive skill measurement platform issuing cryptographically signed verifiable credentials.

---

## 1. Threat Model & Security Guarantees

### What SkillPath Explicitly Protects Against:

1. **Credential Payload Tampering**:
   - **Protection**: Every credential contains an ECDSA P-256 digital signature computed over a deterministically serialized payload (`serializePayload`).
   - **Mechanism**: Modifying any field (e.g., inflating `score` from `1050` to `1400` or altering `studentName`) breaks the SHA-256 digest and causes verification to fail immediately.

2. **Credential Signature Forgery**:
   - **Protection**: Signatures are generated using an asymmetric Elliptic Curve Digital Signature Algorithm (ECDSA) over the `prime256v1` curve.
   - **Mechanism**: Without access to the private key, creating a valid signature for an arbitrary payload is computationally infeasible ($>2^{128}$ security strength).

3. **Unauthorized / Premature Credential Issuance**:
   - **Protection**: Server-side threshold enforcement (`isNodeProvable`).
   - **Mechanism**: The backend verifies that the learner has attained a rating $\ge 1100$ Elo and completed a minimum of $\ge 2$ questions on the target node before signing.

4. **User Identity Spoofing**:
   - **Protection**: Binds `req.user.userId` to a cryptographically verified JWT access token.
   - **Mechanism**: Prevents clients from forging or manipulating the `userId` in API payloads.

5. **Post-Issuance Credential Revocation**:
   - **Protection**: Active Revocation Registry (`revocationRegistry`).
   - **Mechanism**: Signature verification queries the revocation registry alongside signature checks. A revoked credential returns `valid: false` with `revokedAt` timestamps.

---

## 2. Unhandled Risks & Stated Future Work

| Security Risk | Current Status in SkillPath | Stated Mitigation / Future Architecture |
|---|---|---|
| **Private Key File Compromise** | Keys stored as `/keys/private.pem` on server disk | **Production Target**: Key injection via secrets manager (`PRIVATE_KEY_PEM`) or Hardware Security Module (HSM) / AWS KMS / HashiCorp Vault. |
| **Offline Verification vs. Revocation Sync** | Verification with public key alone cannot check online revocation list | **Production Target**: Short-lived credentials with OCSP-style (Online Certificate Status Protocol) revocation status stapling. |
| **Sybil & Identity Verification** | Binds rating to account ID, does not perform bio-passport verification | **Production Target**: Integration with OAuth2 / OIDC identity providers or DID/Verifiable Credentials (VC) standards. |

---

## 3. Cryptographic Design Choices

### Why ECDSA P-256 (`prime256v1`)?
- **Efficiency**: Produces compact 64-byte Base64-encoded signatures (compared to 256/512 bytes for RSA-2048/4048).
- **Security Strength**: Provides 128-bit security level (equivalent to 3072-bit RSA), satisfying NIST recommendations for modern digital signatures.
- **Interoperability**: Supported natively across Node.js `crypto` and browser Web Crypto APIs.

### Deterministic JSON Serialization Strategy:
To guarantee 100% exact byte-for-byte matching between signing and verifying environments across different platforms:
```javascript
function serializePayload(obj) {
  const keys = Object.keys(obj)
    .filter(k => !['signature', 'revoked', 'revokedAt', 'revocationReason'].includes(k))
    .sort();
  const sortedObj = {};
  for (const key of keys) {
    sortedObj[key] = obj[key];
  }
  return JSON.stringify(sortedObj);
}
```
Keys are sorted alphabetically, ensuring signature verification never fails due to key ordering or whitespace differences.

---

## 4. Audit Telemetry & Revocation Rationale

### Why Revocation is Necessary Alongside Cryptographic Signatures:
> *Cryptographic ECDSA signatures guarantee authenticity and payload integrity at the exact moment of issuance. However, a signature alone cannot reflect post-issuance state changes — such as credentials issued in administrative error, academic dishonesty discovered post-facto, or key compromises. Therefore, public verification MUST consult an active revocation registry alongside signature validation to ensure end-to-end credential trust.*

### Append-Only Security Logging:
All credential operations (`ISSUE`, `VERIFY`, `REVOKE`, `VERIFY_FAILED`) emit structured audit entries:
- Logs capture `timestamp`, `credentialId`, `action`, `outcome`, and `clientIp`.
- **Privacy & Security Guarantee**: Logs NEVER store private key material, raw JWT secrets, or unparsed attacker payload dumps.
