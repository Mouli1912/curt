# CONTEXT.md

This file exists so that any contributor — human or AI assistant — can get full context on SkillPath in one read, without needing to ask "why does this exist" mid-build. Read this before touching code.

## 1. What we are building

SkillPath is a **skill assessment and verification platform** for college students / job-seekers targeting technical roles (e.g., Frontend Developer, Backend Developer, Data Analyst). It is entered under the SDG 4 (Quality Education) track of a college/local hackathon.

It is **not**:
- A course-hosting platform (we don't create new video content)
- A chatbot tutor
- A GPT/LLM wrapper of any kind

It **is**:
- A skill graph derived from real job posting requirements
- An adaptive test that measures a learner's actual level on that graph
- A router to the best existing free resource per missing skill
- A cryptographic credentialing system that makes "I know X" verifiable

## 2. Why this framing, specifically

The hackathon judges will have seen 10+ "AI-powered learning platform" submissions that are a thin UI wrapper around the OpenAI/GPT API. Two problems with that path for us:
- It's not differentiated — judges are fatigued by it.
- GPT API rate limits are unreliable for a live demo (this has already bitten us before — **hard constraint: no GPT/LLM API calls anywhere in this project**, live demo or offline).

Our edge is combining three "boring but real" technical components that are individually simple but rarely stacked together:
1. NLP-based skill extraction (classical, e.g. TF-IDF/spaCy NER — not an LLM)
2. Elo-rating-based adaptive testing (same math as chess rating systems)
3. Public-key credential signing (same primitive as SSL certs / SSH — nothing exotic)

## 3. Target user

- College students and early-career job-seekers preparing for a specific technical role
- They already know *some* skills, but don't know precisely which ones are missing for a target job, and have no way to prove what they already know to a recruiter

## 4. Non-goals (explicitly out of scope for the hackathon MVP)

- Live web-scraping of job boards during the demo (data must be pre-collected)
- Building a full Neo4j graph database (a JSON adjacency structure is enough for MVP)
- Multi-role support beyond one target role (e.g., just "Frontend Developer" for the demo)
- Blockchain / on-chain credential storage (plain digital signatures are sufficient and simpler to explain to judges)
- Any GPT/LLM API integration, including for "polish" features like chatbots or auto-generated explanations

## 5. Key terms (glossary)

| Term | Meaning in this project |
|---|---|
| **Skill graph** | A directed graph where nodes are skills and edges represent prerequisites, culminating in a target job role node |
| **Skill node** | A single skill (e.g., "React", "REST APIs") extracted from job posting text |
| **Adaptive assessment** | A quiz where the next question's difficulty depends on the learner's answers so far |
| **Elo rating** | A rating system (borrowed from chess) used here to estimate learner skill level from question difficulty and correctness, updated after each answer |
| **Gap report** | The set of skill nodes on the path to the target role that the learner has not yet demonstrated |
| **Signed credential** | A JSON payload (student ID + skill + score + timestamp) signed with the platform's private key; verifiable by anyone using the public key, without contacting our server |

## 6. High-level data flow

```
Job postings (pre-collected) 
   → NLP skill extraction 
   → Skill graph (JSON, nodes + prerequisite edges) 
   → Learner takes adaptive test 
   → Elo score places learner on graph 
   → Gap report generated (missing nodes on path to target role) 
   → Learner studies routed resources, retakes node-level check 
   → On passing, signed credential issued 
   → Credential publicly verifiable via QR / endpoint
```

## 7. Decisions already made (don't relitigate mid-hackathon)

- Target role for MVP demo: **Frontend Developer** (small, well-understood skill set: HTML/CSS/JS → React → state management → APIs)
- Data source: ~30–50 pre-collected job postings, manually or semi-automatically parsed before the event
- Scoring: Elo-based, not full IRT (IRT is the "if time permits" upgrade)
- Signing: ECDSA key pair generated at setup, private key never leaves the backend

## 8. Where to look next

- Architecture and data models → `docs/DOCUMENTATION.md`
- Folder layout → `docs/FILE_STRUCTURE.md`
- What to build in what order → `docs/BUILD_PLAN.md`
- The exact prompt to start Step 1 → `docs/STEP_1_MASTER_PROMPT.md`
