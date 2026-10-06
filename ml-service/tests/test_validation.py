"""
Unit tests for SkillPath extraction validation pipeline
"""

import os
import pytest
from extractor.validate_extraction import evaluate_extraction_accuracy, extract_skills_for_single_posting

def test_extract_skills_for_single_posting():
    posting = {
        "title": "Backend Python Developer",
        "description": "Requires Python, PostgreSQL, REST API, and Docker experience."
    }
    taxonomy = [
        { "id": "python", "name": "Python", "aliases": ["python"] },
        { "id": "postgresql", "name": "PostgreSQL", "aliases": ["postgresql", "postgres"] },
        { "id": "rest-api", "name": "REST API", "aliases": ["rest api"] },
        { "id": "react", "name": "React", "aliases": ["react"] }
    ]
    extracted = extract_skills_for_single_posting(posting, taxonomy)
    assert "python" in extracted
    assert "postgresql" in extracted
    assert "rest-api" in extracted
    assert "react" not in extracted

def test_evaluate_extraction_accuracy():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    gt_file = os.path.join(base_dir, "data", "ground_truth_labels.json")
    tax_file = os.path.join(base_dir, "data", "skill_taxonomy.json")

    metrics = evaluate_extraction_accuracy(gt_file, tax_file)
    assert "overall" in metrics
    assert "by_role" in metrics
    assert metrics["overall"]["precision"] >= 0.90
    assert metrics["overall"]["recall"] >= 0.90
    assert metrics["overall"]["f1_score"] >= 0.90
    assert "frontend-developer" in metrics["by_role"]
    assert "backend-developer" in metrics["by_role"]
    assert "data-analyst" in metrics["by_role"]
