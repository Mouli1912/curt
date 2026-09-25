# SkillPath — SDG 4 Quality Education Track

**Stop measuring courses completed. Start measuring skills proven.**

SkillPath is a job-demand-driven skill assessment and credentialing platform. It maps real hiring requirements into a skill graph, places learners adaptively using an Elo-rating algorithm, routes them to curated free learning resources for missing skills, and issues cryptographically signed credentials verifiable by recruiters in 5 seconds — **with 0% LLM/GPT API calls in the entire pipeline**.

---

## Core Pitch Differentiators

1. **"Built from real job postings, not a curriculum someone invented"** — Extracted via classical NLP term frequency analysis from active hiring postings into a prerequisite-respecting skill taxonomy graph.
2. **"An adaptive test that actually measures what you know (Elo-based, like chess ratings)"** — Dynamically adjusts item difficulty based on real-time learner accuracy ($K=32$) with breadth-first prerequisite coverage.
3. **"Cryptographically signed credentials a recruiter can verify in 5 seconds — no GPT, no guesswork"** — Uses standard ECDSA P-256 (SHA-256) asymmetric signatures, allowing third parties to verify authenticity offline without database lookups.

---

## Pre-Seeded Demo Accounts for Judges

The Express backend automatically pre-seeds 3 demo profiles on startup (or via `npm run seed`):

| Demo Account ID | Stage | Description | Key Feature to Demo |
|---|---|---|---|
| `fresh-user` | 🟢 Fresh Start | 0 questions answered, 0% readiness | Showing initial quiz start & baseline selection |
| `mid-user` | 🟡 Mid-Progress | 4 proven skills (HTML, CSS, JS, Git) | Showing Topological Gap Report & SVG Skill Graph |
| `pro-user` | ⭐ Near-Complete | 10+ proven skills, 2 pre-issued credentials | Showing ECDSA Credential QR & Live Tamper Verification |

*Note: Use the "Demo Account Switcher" dropdown in the top navbar to instantly toggle between user profiles.*

---

## Quick Start Guide

### 1. Cryptographic Key Setup (One-Time)

Generate the ECDSA P-256 key pair (writes `/keys/private.pem` and `/keys/public.pem`):

```bash
cd server
node scripts/generateKeys.js
```

### 2. Run Test Suites

Execute full unit and integration test suite (21 passing tests):

```bash
cd server
npm test
```

### 3. Start Express Server (Backend)

```bash
cd server
npm install
npm run dev
# Server running on http://localhost:5000
```

### 4. Start React Frontend Client

```bash
cd client
npm install
npm run dev
# Client running on http://localhost:5173
```

---

## Known Limitations & Future Stretch Goals

- **Single Target Role Focus**: Currently pre-populated for the *Frontend Developer* role taxonomy (34 skill nodes). Multi-role switching (e.g. Backend, Data Engineering) is supported via the underlying graph engine.
- **Pre-Collected Hiring Corpus**: Graph extraction operates on a pre-collected 18-posting dataset rather than a continuous live Web scraper pipeline.
- **Elo vs Full Item Response Theory (IRT)**: Implements standard 1-parameter Elo rating updates ($K=32$). 3-parameter IRT (accounting for item discrimination and guessing pseudo-chance) is a natural production extension.

---

## Project Documentation

- [`/docs/DEMO_SCRIPT.md`](./docs/DEMO_SCRIPT.md) — 3-5 minute timed judges presentation script
- [`/docs/architecture-diagram.md`](./docs/architecture-diagram.md) — Mermaid visual system architecture flowchart
- [`DOCUMENTATION.md`](./DOCUMENTATION.md) — System architecture, data models & algorithms

---

## License

MIT
