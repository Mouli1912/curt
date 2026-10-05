# SkillPath 🎓 (SDG 4 — Quality Education)

> **Job-Demand-Driven Skill Assessment & Cryptographic Credentialing Platform**

SkillPath bridges the gap between higher education and industry hiring demand. Instead of another content-delivery LMS, it extracts skill requirements from real job postings, places learners on a prerequisite skill graph using an adaptive Elo psychometric test, routes them to curated free resources for missing skills, and issues cryptographically signed ECDSA credentials when proficiency is proven.

---

### 🌟 Three Core Differentiators

1. **Built from Real Job Postings**: Skill graphs are derived from real industry job data, not an invented curriculum.
2. **Adaptive Elo Skill Measurement**: Objective psychometric scoring ($K=32$) measuring skill level like chess ratings.
3. **Cryptographically Signed Credentials**: ECDSA P-256 digital signatures that recruiters can verify offline in under 5 seconds—tamper-proof and trustless.

> ⚡ **Deterministic & LLM-Free:** Built with zero GPT or LLM API calls for 100% explainable math, fast execution, and zero rate-limit failures during live demos.

---

### 🚀 Getting Started

#### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

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

| Demo Account | Status Stage | Readiness | Proven Skills | ECDSA Credentials |
|---|---|---|---|---|
| 🟢 `fresh-user` | Fresh Start | 0% | 0 skills | None (ready for live start) |
| 🟡 `mid-user` | Mid-Progress | ~35% | 4 skills (`html`, `css`, `js`, `git`) | 0 (ready for gap report demo) |
| ⭐ `pro-user` | Near-Complete | ~75% | 10 skills | Signed ECDSA Credential ready |

---

### 🛡️ Cryptographic Credential Verification

Credentials are signed using **ECDSA P-256 (secp256r1)** with SHA-256 hashes.

To verify a credential:
1. Open the **Verify Credential** tab in the app.
2. Click **Paste Valid Sample** or paste any issued credential JSON.
3. Click **Verify Signature**.
4. To test tamper detection, click **Paste Tampered Sample** (score modified from $1350 \rightarrow 1600$). The verifier will flag the signature as invalid and omit payload data.

---

### 🎯 API Endpoints Summary

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | System health check |
| `GET` | `/api/graph/:role` | Retrieves skill graph topology & demand scores |
| `POST` | `/api/assessment/start` | Begins adaptive assessment session |
| `POST` | `/api/assessment/answer` | Submits answer, returns Elo delta & next question |
| `GET` | `/api/report/:userId` | Generates topological skill gap report & readiness % |
| `POST` | `/api/credential/issue` | Mints and signs an ECDSA P-256 credential |
| `POST` | `/api/credential/verify` | Verifies credential signature authenticity |
| `GET` | `/api/credential/public-key` | Serves PEM public key for offline verifiers |

---

### 📐 Known Limitations & Future Roadmap

* **Single Target Role Scope**: Currently seeded for the *Frontend Developer* role (34 skill nodes). Multi-role expansion (Backend, Data Engineer) is planned for production.
* **Offline Job Dataset**: Skill graph is built from pre-collected job posting datasets rather than real-time web scraping.
* **Classical Elo vs. 2-PL IRT**: Uses standard Elo psychometrics ($K=32$) for fast execution; upgrading to a full 2-Parameter Item Response Theory (IRT) model is a future enhancement.

---

### 📄 License

MIT License — Built for College Hackathon (SDG 4 Track).
