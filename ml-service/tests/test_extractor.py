"""
Unit tests for SkillPath ML skill extractor service.
"""

import sys
import os
import pytest

# Add ml-service/extractor to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "extractor")))

from skill_extractor import extract_skills_from_postings
from graph_builder import build_skill_graph

SAMPLE_POSTINGS = [
    {
        "id": "test-1",
        "title": "React Frontend Engineer",
        "company": "Acme",
        "description": "We need a strong React and JavaScript developer with HTML, CSS, and Git skills."
    },
    {
        "id": "test-2",
        "title": "TypeScript Specialist",
        "company": "Beta Corp",
        "description": "Seeking TypeScript, Next.js, and REST API experience with React."
    }
]

SAMPLE_TAXONOMY = [
    { "id": "react", "name": "React", "category": "Frameworks", "aliases": ["react"] },
    { "id": "javascript", "name": "JavaScript", "category": "Languages", "aliases": ["javascript", "js"] },
    { "id": "typescript", "name": "TypeScript", "category": "Languages", "aliases": ["typescript", "ts"] },
    { "id": "html", "name": "HTML5", "category": "Fundamentals", "aliases": ["html"] }
]

def test_extract_known_skill_keywords():
    """Test 1: Verify known skill keywords are correctly identified in sample postings."""
    skills = extract_skills_from_postings(SAMPLE_POSTINGS, SAMPLE_TAXONOMY)
    
    assert "react" in skills
    assert skills["react"]["frequency"] == 2  # Appears in both postings
    
    assert "javascript" in skills
    assert skills["javascript"]["frequency"] == 1
    
    assert "typescript" in skills
    assert skills["typescript"]["frequency"] == 1

def test_demand_scores_bounded_between_zero_and_one():
    """Test 2: Verify demandScores are bounded strictly between 0.0 and 1.0."""
    skills = extract_skills_from_postings(SAMPLE_POSTINGS, SAMPLE_TAXONOMY)
    
    for skill_id, skill_info in skills.items():
        score = skill_info["demandScore"]
        assert 0.0 <= score <= 1.0, f"demandScore for {skill_id} is out of bounds: {score}"
    
    # The max frequency skill (React) should have demandScore equal to 1.0
    assert skills["react"]["demandScore"] == 1.0

def test_no_llm_imports():
    """Test 3: Assert no GPT/LLM API libraries are imported in extractor module."""
    import skill_extractor
    file_content = open(skill_extractor.__file__, "r").read()
    forbidden_terms = ["openai", "gpt", "anthropic", "langchain", "llama", "huggingface"]
    for term in forbidden_terms:
        assert term not in file_content.lower(), f"Forbidden LLM term '{term}' found in skill_extractor.py"
