# SkillPath

**Stop measuring courses completed. Start measuring skills proven.**

SkillPath is a job-demand-driven skill assessment and verification platform. Instead of another content-delivery LMS, it maps real hiring requirements into a skill graph, places learners on that graph using an adaptive (Elo/IRT-based) assessment, routes them to the best free existing resource for each missing skill, and issues a cryptographically signed, instantly-verifiable credential when a skill is proven — no GPT/LLM API involved anywhere in the pipeline.

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

## Tech Stack (proposed)

- **Frontend:** React + Tailwind
- **Backend:** Node.js / Express (API), Python (NLP + graph + Elo scoring services)
- **Database:** MongoDB or PostgreSQL (user/skill data), simple JSON/NetworkX graph for hackathon scope (Neo4j optional stretch goal)
- **Crypto:** Node `crypto` module — ECDSA/RSA key-pair signing for credentials
- **NLP:** spaCy / TF-IDF for skill extraction from job postings (offline, pre-processed — not live-scraped on stage)

## Project Docs

- [`CONTEXT.md`](./CONTEXT.md) — full project context, non-goals, glossary (read this first if you're an AI assistant or new contributor)
- [`docs/DOCUMENTATION.md`](./docs/DOCUMENTATION.md) — architecture, data models, algorithms, API design
- [`docs/FILE_STRUCTURE.md`](./docs/FILE_STRUCTURE.md) — full repository layout
- [`docs/BUILD_PLAN.md`](./docs/BUILD_PLAN.md) — 5-step build roadmap for the hackathon
- [`docs/STEP_1_MASTER_PROMPT.md`](./docs/STEP_1_MASTER_PROMPT.md) — ready-to-use prompt to scaffold Step 1

## Getting Started

```bash
git clone <repo-url>
cd skillpath
# see docs/BUILD_PLAN.md Step 1 for scaffolding instructions
```

## Team

Mixed-stack team — frontend, backend, and ML/crypto roles split per `docs/BUILD_PLAN.md`.

## License

TBD (MIT recommended for hackathon submissions).
