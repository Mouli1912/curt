# SkillPath

**Stop measuring courses completed. Start measuring skills proven.**

SkillPath is a job-demand-driven skill assessment and verification platform. Instead of another content-delivery LMS, it maps real hiring requirements into a skill graph, places learners on that graph using an adaptive (Elo/IRT-based) assessment, routes them to the best free existing resource for each missing skill, and issues a cryptographically signed, instantly-verifiable credential when a skill is proven — **no GPT/LLM API involved anywhere in the pipeline**.

---

## The Problem

- Online course platforms (Coursera, Udemy, LinkedIn Learning) sell **content**, not **proof of skill**.
- "Personalization" on most platforms is a recommendation carousel, not an actual measurement of what a learner knows.
- Certificates are unverifiable — recruiters have no way to trust a PDF.
- Learners don't know which skills actually matter for the job they want; they guess from a course catalog.

## The Solution

| Problem | SkillPath's Answer |
|---|---|
| No real personalization | Adaptive placement test (Elo-rating based) estimates true skill level in ~15–20 questions |
| No link between learning and hiring | Skill graph built from real job posting data, not a curriculum an instructor invented |
| Unverifiable certificates | Cryptographically signed credentials, verifiable via a public endpoint / QR code |
| Reinventing content that already exists | SkillPath routes to the best existing free resource per skill gap instead of hosting new courses |

## Core Differentiators

1. **Job-demand skill graph** — built from parsed job postings (NLP-extracted skills + prerequisite structure), not a hand-authored syllabus.
2. **Elo/IRT-based adaptive assessment** — classical psychometric ML, no LLM calls, defensible and explainable.
3. **Signed, verifiable credentials** — public/private key signing over (student ID + skill + score + timestamp), verifiable instantly without trusting a PDF.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js / Express (API)
- **ML / Extraction:** Python (`scikit-learn` TF-IDF, deterministic taxonomy matching)
- **Database:** MongoDB (User / Assessment data) with static JSON fallback for skill graph
- **Crypto:** Node `crypto` module — ECDSA key-pair signing for credentials

## Project Docs

- [`CONTEXT.md`](./CONTEXT.md) — full project context, non-goals, glossary
- [`DOCUMENTATION.md`](./DOCUMENTATION.md) — architecture, data models, algorithms, API design
- [`FILE_STRUCTURE.md`](./FILE_STRUCTURE.md) — full repository layout
- [`BUILD_PLAN.md`](./BUILD_PLAN.md) — 5-step build roadmap for the hackathon

---

## Getting Started

### 1. Extract & Build Skill Graph (Python)

Install Python dependencies and run the extractor to generate `data/skill_graph.json`:

```bash
# Set up virtual environment (optional)
python -m venv venv
# On Windows: venv\Scripts\activate
# On Unix: source venv/bin/activate

pip install -r ml-service/requirements.txt
python ml-service/extractor/graph_builder.py
```

To run the Pytest test suite:
```bash
python -m pytest ml-service/tests/
```

### 2. Run Backend API Server (Node/Express)

```bash
cd server
npm install
npm run dev
# Express server running on http://localhost:5000
```

Check Health: `GET http://localhost:5000/api/health`
Check Graph: `GET http://localhost:5000/api/graph/frontend-developer`

### 3. Run Frontend Client (Vite + React)

```bash
cd client
npm install
npm run dev
# React app running on http://localhost:5173
```

---

## License

MIT
