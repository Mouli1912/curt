# DOCUMENTATION.md — Architecture & Technical Design

## 1. System Architecture (high level)

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   React     │◄────►│  Node/Express API │◄────►│  MongoDB/Postgres│
│  Frontend   │      │  (auth, routing,  │      │  (users, scores, │
└─────────────┘      │   credentials)    │      │   graph, jobs)   │
                      └─────────┬─────────┘
                                │
                      ┌─────────▼─────────┐
                      │  Python Services   │
                      │  - Skill extractor │
                      │  - Graph builder   │
                      │  - Elo scorer      │
                      └────────────────────┘
```

The Python services can run as a separate microservice (Flask/FastAPI) called by the Node API, or as CLI scripts invoked at build/setup time if you want to keep the live-demo surface area small — recommended for a hackathon: **pre-compute the skill graph offline, serve it as static JSON, keep only Elo scoring live.**

## 2. Modules

### 2.1 Skill Extraction & Graph Builder (offline, Python)
- Input: raw job posting text (pre-collected, stored as `.json`/`.csv`)
- Pipeline: tokenize → TF-IDF term scoring + spaCy NER for tech-term detection → match against a curated skill taxonomy (you define ~40–60 skills for the Frontend Developer role) → frequency-weighted edges
- Output: `skill_graph.json` — nodes with metadata, edges representing "is prerequisite for"

### 2.2 Adaptive Assessment Engine (Elo-based)
- Each question is tagged with a skill node and a difficulty rating (seeded manually, e.g. 800–1600 scale)
- Learner starts at a default rating (e.g. 1000)
- After each answer:
  ```
  expected_score = 1 / (1 + 10^((question_difficulty - learner_rating) / 400))
  learner_rating_new = learner_rating + K * (actual_score - expected_score)
  ```
  where `actual_score` is 1 (correct) or 0 (incorrect), and `K` is a tunable constant (e.g. 32)
- Next question selected to be near the learner's current rating (maximizes information gained)
- Stop after N questions (e.g. 15–20) or when rating stabilizes (change < threshold over last 3 questions)

### 2.3 Gap Report Generator
- Compare learner's per-skill-node rating against a threshold rating required for "proficient" at that node
- Walk the skill graph from the learner's current proven nodes to the target role node
- Output: ordered list of missing nodes (topologically sorted by prerequisite structure)

### 2.4 Resource Router
- Static curated mapping: `skill_node → [{title, url, type}]` (1–2 best free resources per node, manually curated for MVP — no live search API needed)

### 2.5 Credential Signing Service
- On passing a node-level check (rating ≥ threshold on that node's questions):
  ```
  payload = { studentId, skillNode, score, timestamp }
  signature = ECDSA_sign(privateKey, JSON.stringify(payload))
  credential = { ...payload, signature }
  ```
- Public verify endpoint: `POST /verify` takes a credential object, re-verifies signature against the stored public key, returns valid/invalid + payload
- QR code encodes a link to `/verify/:credentialId` or the raw credential JSON

## 3. Data Models

### User
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "targetRole": "frontend-developer",
  "ratings": { "html-css": 1120, "javascript": 980, "react": 850 },
  "credentials": ["credentialId1", "credentialId2"]
}
```

### Skill Node (in skill_graph.json)
```json
{
  "id": "react",
  "label": "React",
  "prerequisites": ["javascript", "html-css"],
  "demandScore": 0.82,
  "resources": [
    { "title": "React Official Docs — Quick Start", "url": "...", "type": "docs" }
  ]
}
```

### Question
```json
{
  "id": "q_204",
  "skillNode": "react",
  "difficulty": 1150,
  "prompt": "...",
  "options": ["...", "...", "...", "..."],
  "correctIndex": 2
}
```

### Credential
```json
{
  "credentialId": "uuid",
  "studentId": "userId",
  "skillNode": "react",
  "score": 1180,
  "timestamp": "ISO8601",
  "signature": "base64-ecdsa-signature"
}
```

## 4. API Design (Node/Express)

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/signup` / `/login` | Auth |
| GET | `/api/graph/:role` | Fetch skill graph for a target role |
| POST | `/api/assessment/start` | Begin adaptive test, returns first question |
| POST | `/api/assessment/answer` | Submit answer, get next question + updated rating |
| GET | `/api/report/:userId` | Get gap report (missing skill nodes, ordered) |
| POST | `/api/credential/issue` | Issue signed credential after node-level pass |
| POST | `/api/credential/verify` | Verify a credential's signature |
| GET | `/api/resources/:skillNode` | Get curated resources for a skill node |

## 5. Security Notes (leverage your existing security background)

- Private signing key stored server-side only (env var / secrets manager), never sent to client
- Rate-limit `/assessment/answer` to prevent rating manipulation via rapid-fire submission
- Validate all question/answer pairs server-side — never trust client-submitted "correct" flags
- Credential verification must not require hitting your server for basic signature validity (public key can be embedded/distributed) — this is what makes it "instantly verifiable"

## 6. Stretch Goals (only after MVP works end-to-end)

- Swap Elo for full 2-parameter IRT model
- Multi-role support (Backend, Data Analyst)
- Live job-posting ingestion pipeline instead of pre-collected batch
- Neo4j-backed graph with more complex prerequisite reasoning
