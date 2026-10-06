"""
================================================================================
SKILL PATH — MULTI-ROLE GRAPH BUILDER
================================================================================
Combines NLP-extracted skill demand scores and sample-size confidence ratings
with prerequisite dependency structures across multiple tech roles to produce
skill graph JSON payloads in data/.
================================================================================
"""

import os
import json
from skill_extractor import extract_skills_from_postings

# Pre-defined domain prerequisite dependency maps per role
ROLE_PREREQUISITES = {
    "frontend-developer": {
        "html": [],
        "css": ["html"],
        "javascript": ["html"],
        "dom": ["html", "javascript"],
        "responsive-design": ["html", "css"],
        "git": [],
        "react": ["javascript", "dom"],
        "typescript": ["javascript"],
        "state-management": ["react"],
        "rest-api": ["javascript"],
        "graphql": ["rest-api"],
        "nextjs": ["react", "typescript"],
        "vite": ["javascript"],
        "webpack": ["javascript"],
        "npm": ["javascript"],
        "tailwind": ["css", "responsive-design"],
        "bootstrap": ["css"],
        "sass": ["css"],
        "css-in-js": ["css", "react"],
        "jest": ["javascript", "react"],
        "a11y": ["html", "css"],
        "web-performance": ["javascript", "dom"],
        "web-security": ["javascript", "rest-api"],
        "pwa": ["javascript", "browser-storage"],
        "websockets": ["javascript", "rest-api"],
        "browser-storage": ["javascript"],
        "storybook": ["react"],
        "vue": ["javascript"],
        "d3": ["javascript", "dom"],
        "figma": [],
        "chrome-devtools": ["javascript", "dom"],
        "async-js": ["javascript"],
        "micro-frontends": ["react", "webpack"],
        "single-page-apps": ["react", "javascript"]
    },
    "backend-developer": {
        "nodejs": [],
        "express": ["nodejs"],
        "python": [],
        "django": ["python"],
        "fastapi": ["python"],
        "java": [],
        "spring-boot": ["java"],
        "sql": [],
        "postgresql": ["sql"],
        "mongodb": ["sql"],
        "redis": ["sql"],
        "orm": ["sql"],
        "docker": ["linux"],
        "kubernetes": ["docker"],
        "aws": ["docker"],
        "rest-api": ["nodejs"],
        "graphql": ["rest-api"],
        "grpc": ["rest-api"],
        "microservices": ["rest-api", "docker"],
        "system-design": ["microservices", "sql"],
        "ci-cd": ["git", "docker"],
        "git": [],
        "oauth": ["rest-api"],
        "unit-testing-backend": ["nodejs"],
        "message-queues": ["microservices"],
        "elasticsearch": ["sql"],
        "linux": [],
        "websockets": ["nodejs"],
        "typescript": ["nodejs"],
        "data-structures": []
    },
    "data-analyst": {
        "python": [],
        "pandas": ["python"],
        "numpy": ["python"],
        "sql": [],
        "postgresql": ["sql"],
        "excel": [],
        "tableau": ["excel"],
        "power-bi": ["excel"],
        "data-visualization": ["pandas"],
        "statistics": ["python"],
        "probability": ["statistics"],
        "ab-testing": ["statistics", "probability"],
        "eda": ["python", "pandas"],
        "scikit-learn": ["python", "numpy", "pandas"],
        "machine-learning-basics": ["scikit-learn", "statistics"],
        "git": [],
        "data-cleaning": ["python", "pandas"],
        "data-warehousing": ["sql"],
        "etl-pipelines": ["sql", "python"],
        "airflow": ["etl-pipelines", "python"],
        "r-programming": ["statistics"],
        "jupyter": ["python"],
        "business-intelligence": ["sql", "tableau"],
        "kpis": ["business-intelligence"],
        "cohort-analysis": ["kpis", "sql"],
        "google-analytics": ["kpis"]
    }
}

RESOURCE_MAP = {
    "javascript": [
        { "title": "MDN JavaScript Guide", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", "type": "Documentation", "free": True },
        { "title": "javascript.info Tutorial", "url": "https://javascript.info/", "type": "Interactive Guide", "free": True }
    ],
    "python": [
        { "title": "Python Official Tutorial", "url": "https://docs.python.org/3/tutorial/", "type": "Documentation", "free": True },
        { "title": "Automate the Boring Stuff with Python", "url": "https://automatetheboringstuff.com/", "type": "Book", "free": True }
    ],
    "sql": [
        { "title": "Mode Analytics SQL Tutorial", "url": "https://mode.com/sql-tutorial/", "type": "Interactive Tutorial", "free": True },
        { "title": "PostgreSQL Official Documentation", "url": "https://www.postgresql.org/docs/", "type": "Documentation", "free": True }
    ],
    "react": [
        { "title": "Official React Documentation", "url": "https://react.dev/learn", "type": "Documentation", "free": True }
    ],
    "nodejs": [
        { "title": "Node.js Official Getting Started", "url": "https://nodejs.org/en/docs/guides/getting-started-guide/", "type": "Documentation", "free": True }
    ],
    "pandas": [
        { "title": "Pandas User Guide & Tutorials", "url": "https://pandas.pydata.org/docs/user_guide/index.html", "type": "Documentation", "free": True }
    ],
    "docker": [
        { "title": "Docker Language Guides", "url": "https://docs.docker.com/get-started/", "type": "Documentation", "free": True }
    ]
}

def build_skill_graph_for_role(role: str, raw_postings_path: str, taxonomy_path: str, output_path: str) -> dict:
    """Build skill_graph JSON payload for a target engineering role."""
    with open(raw_postings_path, "r", encoding="utf-8") as f:
        postings = json.load(f)
        
    with open(taxonomy_path, "r", encoding="utf-8") as f:
        taxonomy_full = json.load(f)

    taxonomy = taxonomy_full.get(role, taxonomy_full) if isinstance(taxonomy_full, dict) else taxonomy_full
    prerequisite_map = ROLE_PREREQUISITES.get(role, {})

    extracted_skills = extract_skills_from_postings(postings, taxonomy)

    nodes = []
    for skill_id, skill_data in extracted_skills.items():
        prereqs = prerequisite_map.get(skill_id, [])
        resources = RESOURCE_MAP.get(skill_id, [
            { "title": f"{skill_data['name']} Learning Guide", "url": f"https://developer.mozilla.org/en-US/search?q={skill_id}", "type": "Documentation", "free": True }
        ])
        
        node = {
            "id": skill_id,
            "label": skill_data["name"],
            "category": skill_data["category"],
            "prerequisites": prereqs,
            "demandScore": skill_data["demandScore"],
            "confidence": skill_data.get("confidence", 0.8),
            "frequency": skill_data["frequency"],
            "resources": resources
        }
        nodes.append(node)

    nodes.sort(key=lambda x: x["demandScore"], reverse=True)

    title_map = {
        "frontend-developer": "Frontend Developer Skill Graph",
        "backend-developer": "Backend Developer Skill Graph",
        "data-analyst": "Data Analyst Skill Graph"
    }

    graph_payload = {
        "role": role,
        "title": title_map.get(role, f"{role.replace('-', ' ').title()} Skill Graph"),
        "totalPostingsAnalyzed": len(postings),
        "nodes": nodes
    }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(graph_payload, f, indent=2)

    print(f"[GraphBuilder] Successfully generated {output_path} ({role}) with {len(nodes)} skill nodes.")
    return graph_payload


def build_skill_graph(raw_postings_path: str, taxonomy_path: str, output_path: str) -> dict:
    """Backwards compatible helper for single-role graph building."""
    return build_skill_graph_for_role("frontend-developer", raw_postings_path, taxonomy_path, output_path)


def build_all_role_graphs(base_data_dir: str):
    """Regenerate skill graphs for all supported roles."""
    roles = ["frontend-developer", "backend-developer", "data-analyst"]
    taxonomy_file = os.path.join(base_data_dir, "skill_taxonomy.json")

    for role in roles:
        postings_file = os.path.join(base_data_dir, "raw_job_postings", f"job_postings_{role}.json")
        if not os.path.exists(postings_file) and role == "frontend-developer":
            postings_file = os.path.join(base_data_dir, "raw_job_postings", "job_postings.json")

        out_file = os.path.join(base_data_dir, f"skill_graph_{role}.json")
        build_skill_graph_for_role(role, postings_file, taxonomy_file, out_file)
        
        # Keep default skill_graph.json updated with frontend graph for legacy fallback
        if role == "frontend-developer":
            legacy_file = os.path.join(base_data_dir, "skill_graph.json")
            build_skill_graph_for_role(role, postings_file, taxonomy_file, legacy_file)

if __name__ == "__main__":
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))
    build_all_role_graphs(base_dir)
