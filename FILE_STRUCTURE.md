# FILE_STRUCTURE.md

Proposed repository layout. Not every file exists on day one — this is the target shape to build toward across the 5 steps in `BUILD_PLAN.md`.

```
skillpath/
├── README.md
├── CONTEXT.md
├── .env.example
├── .gitignore
│
├── docs/
│   ├── DOCUMENTATION.md
│   ├── FILE_STRUCTURE.md
│   ├── BUILD_PLAN.md
│   └── STEP_1_MASTER_PROMPT.md
│
├── data/
│   ├── raw_job_postings/          # pre-collected .json/.csv postings
│   ├── skill_taxonomy.json        # curated list of skills for target role(s)
│   └── skill_graph.json           # output of the graph builder (Step 1)
│
├── ml-service/                    # Python services
│   ├── requirements.txt
│   ├── extractor/
│   │   ├── skill_extractor.py     # TF-IDF + spaCy NER extraction
│   │   └── graph_builder.py       # builds skill_graph.json from postings
│   ├── scoring/
│   │   └── elo_engine.py          # Elo rating update logic
│   └── tests/
│       ├── test_extractor.py
│       └── test_elo_engine.py
│
├── server/                        # Node/Express backend
│   ├── package.json
│   ├── src/
│   │   ├── index.js
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Question.js
│   │   │   └── Credential.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── graph.routes.js
│   │   │   ├── assessment.routes.js
│   │   │   ├── report.routes.js
│   │   │   └── credential.routes.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── assessmentController.js
│   │   │   ├── reportController.js
│   │   │   └── credentialController.js
│   │   ├── services/
│   │   │   ├── eloService.js
│   │   │   ├── graphService.js
│   │   │   └── signingService.js   # ECDSA sign/verify
│   │   └── middleware/
│   │       ├── auth.js
│   │       └── rateLimit.js
│   └── tests/
│
├── client/                        # React frontend
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Assessment.jsx
│   │   │   ├── GapReport.jsx
│   │   │   ├── SkillGraphView.jsx
│   │   │   └── CredentialVerify.jsx
│   │   ├── components/
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── SkillNode.jsx
│   │   │   ├── GraphCanvas.jsx
│   │   │   └── CredentialQR.jsx
│   │   ├── api/
│   │   │   └── client.js
│   │   └── styles/
│   └── public/
│
└── keys/
    ├── private.pem                # NEVER commit — in .gitignore
    └── public.pem
```

## Notes on this layout

- `ml-service/` is intentionally decoupled — it can run once offline to produce `data/skill_graph.json`, so the live demo doesn't depend on Python being up.
- `keys/private.pem` must be gitignored; only `public.pem` is safe to distribute (needed for third-party credential verification).
- `data/raw_job_postings/` is where you drop your ~30–50 pre-collected postings before Step 1.
