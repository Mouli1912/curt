# BUILD_PLAN.md — 5-Step Hackathon Build Plan

Each step has a clear deliverable so the team can parallelize once the shared data contracts (skill graph JSON shape, API routes) are fixed in Step 1.

---

## Step 1 — Foundation: Skill Graph + Project Scaffold
**Goal:** Turn pre-collected job postings into `data/skill_graph.json`, and scaffold the repo (server, client, ml-service folders with working "hello world" endpoints).

**Deliverables:**
- Repo structure matching `FILE_STRUCTURE.md`
- `skill_taxonomy.json` (curated list of ~40–60 Frontend Developer skills)
- `skill_extractor.py` + `graph_builder.py` producing `skill_graph.json` from `data/raw_job_postings/`
- Express server boots, MongoDB/Postgres connected, one working health-check route
- React app boots, fetches and renders the skill graph as a simple list/tree

**Owner suggestion:** whoever's strongest in Python for the extractor, backend dev sets up Express + DB in parallel.

---

## Step 2 — Adaptive Assessment Engine
**Goal:** A learner can take a working adaptive quiz and get a real-time Elo rating per skill node.

**Deliverables:**
- `elo_engine.py` / `eloService.js` (pick one language, keep it consistent with where it's called from)
- Seed question bank (~40–60 questions tagged with `skillNode` + `difficulty`)
- `/api/assessment/start` and `/api/assessment/answer` endpoints
- Frontend `Assessment.jsx` — question card, live rating update, "next question" flow

---

## Step 3 — Gap Report & Resource Routing
**Goal:** After the assessment, the learner sees exactly which skills they're missing for their target role, in prerequisite order, with resources to close each gap.

**Deliverables:**
- Gap report algorithm (topological walk over skill graph vs. learner's proven nodes)
- Curated `resources` field populated in `skill_graph.json` (1–2 free links per node)
- `/api/report/:userId` endpoint
- `GapReport.jsx` + `SkillGraphView.jsx` (visual graph, highlight missing nodes)

---

## Step 4 — Signed, Verifiable Credentials
**Goal:** A learner who passes a node-level check gets a cryptographically signed credential; anyone can verify it without trusting your server.

**Deliverables:**
- ECDSA key pair generation (setup script, `keys/`)
- `signingService.js` — issue + verify
- `/api/credential/issue` and `/api/credential/verify` endpoints
- `CredentialQR.jsx` (generate QR encoding credential/verify link) + `CredentialVerify.jsx` (public verify page)

---

## Step 5 — Integration, Demo Polish, and Storytelling
**Goal:** Everything wired end-to-end, one clean demo flow, and a pitch that leads with the 3 differentiators.

**Deliverables:**
- Full flow works: landing → assessment → gap report → study → recheck → credential → verify
- Seed 2–3 demo user accounts at different skill levels so the demo doesn't start from zero
- Landing page copy + short demo script highlighting: job-demand-driven graph, Elo-based measurement, signed verifiable credentials — and explicitly **no GPT/LLM API used**
- README finalized, architecture diagram exported as an image for the PPT
- Rehearsed 3–5 minute demo, timed

---

## Suggested Parallelization (mixed team)

| Role | Primary steps |
|---|---|
| ML/Python person | Step 1 (extractor/graph), Step 2 (Elo logic) |
| Backend dev | Step 1 (server scaffold), Step 2–4 (API routes) |
| Frontend dev | Step 1 (client scaffold), Step 2–4 (UI per step), Step 5 (polish) |
| Security-minded person (you) | Step 4 (signing service) end-to-end, security review of Step 2's rate limiting |

Steps 2, 3, and 4 can start in parallel once Step 1's data contracts (skill graph JSON shape, API route stubs) are locked — don't let one person block the whole team by doing everything sequentially.
