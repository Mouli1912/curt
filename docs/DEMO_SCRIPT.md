# SkillPath — 3-5 Minute Live Demo Pitch Script

This script is structured for live presentation to hackathon judges (SDG 4 Quality Education Track). 

---

### ⏱️ SECTION 1: THE PROBLEM & OPPORTUNITY (20 seconds)

> **Spoken Script:**
> "Most online learning platforms sell content, not proof of actual skill. Traditional certificates are easy to forge, hard to verify, and disconnected from real hiring demand. SkillPath solves this by mapping job market requirements into a prerequisite graph, measuring skill with classical Elo psychometrics, and issuing tamper-proof ECDSA credentials."

---

### ⏱️ SECTION 2: SKILL GAP REPORT & TOPOLOGY GRAPH (60 seconds)

> **Action:** Select **`🟡 mid-user`** in the top navbar demo dropdown. Click **`🎯 Skill Gap Report`**.
>
> **Spoken Script:**
> "Here is our mid-progress learner, Alex. Their dashboard shows a 12% overall job readiness against 18 real frontend developer job postings. Notice how the recommended learning path is strictly ordered: SkillPath mandates learning HTML and JavaScript before React, respecting real prerequisite topology rather than arbitrary course playlists. Below, our interactive graph canvas highlights proven skills in green, weak gaps in amber, and untouched nodes in blue."

---

### ⏱️ SECTION 3: LIVE ADAPTIVE ASSESSMENT (60 seconds)

> **Action:** Click **`⚡ Adaptive Assessment`**. Answer 2-3 questions live. Point to the Live Elo Badge on the right.
>
> **Spoken Script:**
> "When Alex takes an assessment, our deterministic Elo algorithm adapts in real time, exactly like chess ratings. Notice how answering a harder question correctly on JavaScript boosts their Elo rating by +18 points on the live badge. Because the test targets unasked skills breadth-first, it measures true competency without wasting time on repetitive questions."

---

### ⏱️ SECTION 4: CRYPTOGRAPHIC CREDENTIAL & LIVE TAMPER DEMO (60 seconds)

> **Action 1:** Select **`⭐ pro-user`** in navbar dropdown. Go to **`🎯 Skill Gap Report`** and click **`🛡️ View Signed Credential`** on React.
> **Action 2:** Click **`🛡️ Open Public Verifier`**. Click **`Paste Valid Sample`** $\rightarrow$ **`Verify Signature`** (Shows Green Banner).
> **Action 3:** Click **`Paste Tampered Sample`** (Score altered $1350 \rightarrow 1600$) $\rightarrow$ **`Verify Signature`** (Shows Red Banner).
>
> **Spoken Script:**
> "When a learner proves proficiency on a skill, SkillPath issues a cryptographically signed ECDSA P-256 credential containing an SVG QR code. On our public verification portal, a recruiter can paste or scan this credential to verify its authenticity in under a second. Watch what happens when I tamper with the score field in the JSON—the cryptographic signature verification instantly fails, protecting employers from fraudulent resumes without needing server DB lookups."

---

### ⏱️ SECTION 5: RECRUITER TALENT SEARCH & BATCH VERIFICATION (45 seconds)

> **Action 1:** Select **`💼 recruiter-user`** in the top navbar demo dropdown. Click **`💼 Recruiter Search`**.
> **Action 2:** Type **`react`** into the skill search box $\rightarrow$ Click **`Search`**. Point to the candidate cards and click **`View Shareable Public Profile`**.
> **Action 3:** Click **`⚡ Bulk Verify`** tab $\rightarrow$ Click **`Load Demo Sample Callset`** $\rightarrow$ Click **`Run Bulk Verification`** (Shows Summary Table).
>
> **Spoken Script:**
> "SkillPath isn't just a learner tool — it's a complete two-sided marketplace. On the recruiter portal, hiring managers can search for candidates by proven skill competencies like 'React'. Notice that only candidates who have explicitly opted into public discoverability appear, and only proven competencies are exposed — protecting learner privacy. Recruiters can also bulk-verify an entire candidate callset in one pass, instantly filtering valid, revoked, or forged credentials."

---

### ⏱️ SECTION 6: CLOSING & FOUR DIFFERENTIATORS (30 seconds)

> **Spoken Script:**
> "To summarize, SkillPath is built on four core pillars:
> 1. Real Job Market Pipeline: Taxonomies built from raw job postings.
> 2. Classical 2PL IRT & Elo Psychometrics: Objective, adaptive skill measurement with standard errors.
> 3. ECDSA Cryptographic Credentials & Revocation: Tamper-proof verification.
> 4. Two-Sided Recruiter Talent Registry: Privacy-first candidate discovery and bulk verification.
> As a deliberate architectural choice for reliability and trust, there are zero GPT or LLM API calls anywhere in this system—just applied mathematics and cryptography for SDG 4 Quality Education."

---

### 🛠️ Quick Demo Checklist for Presenter

- [ ] Ensure server is running (`npm start` in `/server`).
- [ ] Verify dropdown picks work smoothly (`pro-user`, `mid-user`, `fresh-user`, `recruiter-user`).
- [ ] Practice the live tamper moment (`1350` $\rightarrow$ `1600`) and recruiter search (`react`).
