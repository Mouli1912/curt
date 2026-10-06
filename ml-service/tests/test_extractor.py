"""
Unit tests for SkillPath ML skill extractor service.
"""

import sys
import os
import unittest

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

class TestSkillExtractor(unittest.TestCase):

    def test_extract_known_skill_keywords(self):
        """Test 1: Verify known skill keywords are correctly identified in sample postings."""
        skills = extract_skills_from_postings(SAMPLE_POSTINGS, SAMPLE_TAXONOMY)
        
        self.assertIn("react", skills)
        self.assertEqual(skills["react"]["frequency"], 2)  # Appears in both postings
        
        self.assertIn("javascript", skills)
        self.assertEqual(skills["javascript"]["frequency"], 1)
        
        self.assertIn("typescript", skills)
        self.assertEqual(skills["typescript"]["frequency"], 1)

    def test_demand_scores_bounded_between_zero_and_one(self):
        """Test 2: Verify demandScores are bounded strictly between 0.0 and 1.0."""
        skills = extract_skills_from_postings(SAMPLE_POSTINGS, SAMPLE_TAXONOMY)
        
        for skill_id, skill_info in skills.items():
            score = skill_info["demandScore"]
            self.assertTrue(0.0 <= score <= 1.0, f"demandScore for {skill_id} is out of bounds: {score}")
        
        # The max frequency skill (React) should have demandScore equal to 1.0
        self.assertEqual(skills["react"]["demandScore"], 1.0)

    def test_no_llm_imports(self):
        """Test 3: Assert no GPT/LLM API libraries are imported in extractor module."""
        import skill_extractor
        file_content = open(skill_extractor.__file__, "r").read()
        forbidden_terms = ["openai", "gpt", "anthropic", "langchain", "llama", "huggingface"]
        for term in forbidden_terms:
            self.assertNotIn(term, file_content.lower(), f"Forbidden LLM term '{term}' found in skill_extractor.py")

if __name__ == "__main__":
    unittest.main()
