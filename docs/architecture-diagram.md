# SkillPath Architecture Diagram

Below is the clean visual Mermaid diagram representing the complete SkillPath platform architecture across data extraction, backend services, cryptographic credentialing, and frontend presentation.

```mermaid
flowchart TD
    subgraph Data Pipeline ["Offline Job Data Extraction (Zero LLM)"]
        A[Raw Job Postings JSON] -->|TF-IDF NLP Keyword Extractor| B[Skill Taxonomy & Frequency Matrix]
        B -->|Co-occurrence Graph Builder| C["/data/skill_graph.json (34 Skill Nodes)"]
    end

    subgraph Backend ["Express Node.js Server (Port 5000)"]
        C --> D[Express REST API]
        D --> E[Rate-Limiting Middleware]
        
        subgraph Services ["Pure Deterministic Algorithms"]
            F["Elo Rating Service\nK=32 Formula\n1 / (1 + 10^((Diff - Rating)/400))"]
            G["Topological Gap Service\nKahn's DAG Sorting\nProficiency Threshold >= 1100"]
            H["ECDSA Credential Service\nCurve P-256 / SHA-256 Signatures\n/keys/private.pem"]
        end

        E --> F
        E --> G
        E --> H
    end

    subgraph Storage ["Session & Key Storage"]
        I["Active In-Memory Sessions\n(fresh-user, mid-user, pro-user)"]
        J["/keys/private.pem (Gitignored)"]
        K["/keys/public.pem (Public)"]
    end

    Services <--> I
    H <--> J
    H <--> K

    subgraph Frontend ["React 18 Client (Vite)"]
        L["Landing Page\n(3 Pitch Differentiators)"]
        M["Adaptive Quiz Page\n(Live Elo Indicator & Feedback)"]
        N["Skill Gap Report Page\n(Interactive SVG Graph Canvas + Curated Links)"]
        O["Public Verifier Portal\n(Offline Signature Verification & QR Code)"]
    end

    D <-->|JSON API| Frontend
```

## System Component Breakdown

1. **Job Data Ingestion Pipeline**: Deterministic TF-IDF NLP keyword extraction parses raw hiring data into a skill DAG without LLM dependencies.
2. **Adaptive Assessment Engine**: Calculates Elo rating updates ($K=32$) per skill node in real-time.
3. **Topological Gap Service**: Sorts unproven skills using Kahn's DAG algorithm so prerequisites precede dependent nodes.
4. **ECDSA Cryptographic Credential Signer**: Generates secp256r1 (P-256) SHA-256 digital signatures over canonical JSON payloads. Verified using `/keys/public.pem`.
5. **React Frontend SPA**: Provides visual graph canvas rendering, live Elo movement feedback, and public offline credential verification.
