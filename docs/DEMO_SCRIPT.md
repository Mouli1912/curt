# SkillPath — 3-5 Minute Judges Demo Script (SDG 4 Track)

*Timing: Total ~3.5 minutes. Keep spoken sentences punchy and conversational.*

---

## 1. The Problem & Opportunity (0:00 - 0:20 | 20 seconds)

> **Spoken:**
> "Traditional learning platforms sell course content, not objective proof of skill. Certificates are easily forged, while generic quizzes don't match real industry demand. SkillPath solves this by mapping job-market skills, measuring proficiency adaptively, and minting cryptographically verifiable credentials."

---

## 2. Live Demo — Topological Gap Report & Skill Graph (0:20 - 1:20 | 60 seconds)

> **Screen Action:** Select `mid-user` from top bar $\rightarrow$ Navigate to **Skill Gap Report**.
> 
> **Spoken:**
> "Here is our mid-progress learner, 'mid-user'. Notice this readiness score—4 skills proven out of 34 extracted from real job postings. On the visual skill graph canvas, proven skills glow green, while remaining gaps are color-coded. Most importantly, this gap list is ordered topologically by prerequisite dependencies—you are taught JavaScript before React, derived from real hiring data."

---

## 3. Live Demo — Adaptive Assessment Engine (1:20 - 2:20 | 60 seconds)

> **Screen Action:** Navigate to **Adaptive Assessment** tab $\rightarrow$ Answer 2-3 questions live.
> 
> **Spoken:**
> "Let's take a live quiz. As I answer correctly, watch the live Elo rating badge in the top right tick up. Like chess ratings, our engine uses a deterministic Elo formula with $K=32$—correctly answering a hard question boosts your score significantly more than an easy one. The system automatically selects unasked prerequisite skills breadth-first until your rating stabilizes."

---

## 4. Live Demo — ECDSA Signed Credential & Live Tamper Test (2:20 - 3:20 | 60 seconds)

> **Screen Action:** Switch account to `pro-user` $\rightarrow$ Open **Skill Gap Report** $\rightarrow$ Show pre-issued JavaScript Credential $\rightarrow$ Copy JSON $\rightarrow$ Switch to **Verify Credential** tab $\rightarrow$ Paste and click Verify (Green ✅) $\rightarrow$ Change score from 1248 to 1600 $\rightarrow$ Click Verify (Red ❌).
> 
> **Spoken:**
> "When a learner proves a skill ($\ge 1100$ Elo), SkillPath mints an ECDSA P-256 digital credential. Anyone can copy this credential or scan the QR code and verify it on our public verifier portal. Notice it passes as Authentic. Now watch what happens if a student attempts to fake their score—changing 1248 to 1600 immediately causes cryptographic signature verification to fail. Recruiters can verify credentials offline in 5 seconds."

---

## 5. Closing & Key Takeaways (3:20 - 3:50 | 30 seconds)

> **Spoken:**
> "To summarize: SkillPath is built from real job postings, uses adaptive Elo math instead of static quizzes, and issues tamper-proof digital credentials. Most importantly, there are zero GPT or LLM API calls in this entire codebase—every calculation is 100% deterministic, transparent, and mathematically verifiable. Thank you!"

---

## Pre-Demo Presenter Checklist

- [x] Run `node scripts/seedDemo.js` or start backend server (auto-seeds `fresh-user`, `mid-user`, `pro-user`).
- [x] Verify `mid-user` shows 4 proven nodes on Gap Report.
- [x] Verify live Elo badge updates when answering quiz questions.
- [x] Practice copying `pro-user` credential JSON into **Verify Credential** tab and editing a single character to trigger live red failure seal.
