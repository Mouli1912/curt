"""
================================================================================
SKILL PATH — GRAPH BUILDER
================================================================================
Combines NLP-extracted skill demand scores with prerequisite dependency structures
to produce the final graph JSON payload stored in data/skill_graph.json.
================================================================================
"""

import os
import json
from skill_extractor import extract_skills_from_postings

# Pre-defined domain prerequisite dependency map for Frontend Developer role
PREREQUISITE_MAP = {
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
}

def build_skill_graph(raw_postings_path: str, taxonomy_path: str, output_path: str) -> dict:
    """Build skill_graph.json from raw job postings and taxonomy."""
    with open(raw_postings_path, "r", encoding="utf-8") as f:
        postings = json.load(f)
        
    with open(taxonomy_path, "r", encoding="utf-8") as f:
        taxonomy = json.load(f)

    extracted_skills = extract_skills_from_postings(postings, taxonomy)

    nodes = []
    for skill_id, skill_data in extracted_skills.items():
        # Only include skills that have non-zero demand or are foundational
        prereqs = PREREQUISITE_MAP.get(skill_id, [])
        node = {
            "id": skill_id,
            "label": skill_data["name"],
            "category": skill_data["category"],
            "prerequisites": prereqs,
            "demandScore": skill_data["demandScore"],
            "frequency": skill_data["frequency"],
            "resources": []  # Populated in Step 3
        }
        nodes.append(node)

    # Sort nodes by demand score descending for clean structure
    nodes.sort(key=lambda x: x["demandScore"], reverse=True)

    graph_payload = {
        "role": "frontend-developer",
        "title": "Frontend Developer Skill Graph",
        "totalPostingsAnalyzed": len(postings),
        "nodes": nodes
    }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(graph_payload, f, indent=2)

    print(f"[GraphBuilder] Successfully generated {output_path} with {len(nodes)} skill nodes.")
    return graph_payload

if __name__ == "__main__":
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    postings_file = os.path.join(base_dir, "data", "raw_job_postings", "job_postings.json")
    taxonomy_file = os.path.join(base_dir, "data", "skill_taxonomy.json")
    output_file = os.path.join(base_dir, "data", "skill_graph.json")

    build_skill_graph(postings_file, taxonomy_file, output_file)
