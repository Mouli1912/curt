# SkillPath 🎓 (SDG 4 — Quality Education)

> **Job-Demand-Driven Skill Assessment & Cryptographic Credentialing Platform**

SkillPath bridges the gap between higher education and industry hiring demand. Instead of another content-delivery LMS, it extracts skill requirements from real job postings, places learners on a prerequisite skill graph using an adaptive Elo psychometric test, routes them to curated free resources for missing skills, and issues cryptographically signed ECDSA credentials when proficiency is proven.

---

### 🌟 Four Core Differentiators

1. **Built from Real Job Market Pipelines**: Skill graphs and taxonomies are derived from raw industry job data, not an arbitrary curriculum.
2. **Classical 2PL IRT & Elo Psychometric Measurement**: Objective psychometric scoring with item discrimination ($a \in [0.8, 2.2]$) and Fisher Information Standard Error confidence bounds.
3. **Cryptographically Signed Credentials & Revocation**: ECDSA P-256 digital signatures with an active revocation registry—tamper-proof, trustless, and revocable.
4. **Two-Sided Recruiter Talent Registry**: Privacy-first candidate discovery by proven skill competency and bulk credential verification.

> ⚡ **Deterministic & LLM-Free:** Built with zero GPT or LLM API calls for 100% explainable math, fast execution, and zero rate-limit failures during live demos.

---

### 🚀 Getting Started

#### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: 3.10+ (for ML pipeline)

#### Quickstart Setup

1. **Clone the Repository & Install Dependencies**:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

2. **Generate Cryptographic Key Pair (One-Time Setup)**:
   ```bash
   cd ../server
   node scripts/generateKeys.js
   ```
   *Generates `/keys/private.pem` (gitignored) and `/keys/public.pem`.*

3. **Seed Demo User Accounts**:
   ```bash
   node scripts/seedDemo.js
   ```

4. **Run Server & Client**:
   ```bash
   # Start backend API (Port 5000)
   npm start

   # In a separate terminal, start React dev server (Port 5173)
   cd ../client
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### 👥 Seeded Demo Accounts

Use the **DEMO ACCOUNT** picker in the top navbar to switch between accounts instantly:

| Demo Account | Status Stage | Role | Readiness | Proven Skills | Feature Focus |
|---|---|---|---|---|---|
| 🟢 `fresh-user` | Fresh Start | Learner | 0% | 0 skills | Inviting onboarding slate |
| 🟡 `mid-user` | Mid-Progress | Learner | ~35% | 4 skills | Prerequisite topological path |
| ⭐ `pro-user` | Near-Complete | Learner | ~75% | 10 skills | ECDSA Signed Credential & Public Profile |
| 💼 `recruiter-user` | Recruiter | Recruiter | N/A | N/A | Talent Discovery & Bulk Verification |

---

### 🛡️ Cryptographic Credential Verification & Revocation

Credentials are signed using **ECDSA P-256 (secp256r1)** with SHA-256 hashes.

To verify a credential:
1. Open the **Verify Credential** tab in the app.
2. Click **Paste Valid Sample** or paste any issued credential JSON.
3. Click **Verify Signature**.
4. To test tamper detection, click **Paste Tampered Sample** (score modified from $1350 \rightarrow 1600$). The verifier will flag the signature as invalid and omit payload data.
5. To test revocation, revoke a credential in the backend/test suite and verify that `/verify` flags it as `REVOKED`.

---

### 🎯 API Endpoints Summary

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | System health check |
| `GET` | `/api/graph/:role` | Retrieves skill graph topology & demand scores |
| `POST` | `/api/assessment/start` | Begins adaptive assessment session |
| `POST` | `/api/assessment/answer` | Submits answer with timing & tab-switch telemetry |
| `GET` | `/api/report/:userId` | Generates topological skill gap report with SE bounds |
| `POST` | `/api/credential/issue` | Mints and signs an ECDSA P-256 credential |
| `POST` | `/api/credential/verify` | Verifies credential signature & revocation status |
| `POST` | `/api/credential/revoke/:id` | Revokes an issued credential |
| `GET` | `/api/credential/audit` | Returns append-only security audit logs |
| `GET` | `/api/recruiters/search` | Searches discoverable learners by proven skill/role |
| `POST` | `/api/recruiters/bulk-verify` | Batch verifies candidate credential IDs |
| `GET` | `/api/profile/:username` | Returns shareable public profile for discoverable learners |
| `GET` | `/api/admin/analytics` | Returns aggregate market demand trends & readiness tiers |

---

### 📐 Known Limitations & Future Roadmap

* **Single Target Role Scope**: Currently seeded for the *Frontend Developer* role (34 skill nodes). Multi-role expansion (Backend, Data Engineer) is planned for production.
* **Offline Job Dataset**: Skill graph is built from pre-collected job posting datasets rather than real-time web scraping.
* **Classical Elo vs. 2-PL IRT**: Uses standard Elo psychometrics ($K=32$) for fast execution; upgrading to a full 2-Parameter Item Response Theory (IRT) model is a future enhancement.

---

### 📄 License

MIT License — Built for College Hackathon (SDG 4 Track).
