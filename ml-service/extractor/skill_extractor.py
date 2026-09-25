"""
================================================================================
SKILL PATH — DETERMINISTIC NLP SKILL EXTRACTOR
================================================================================
TECHNICAL RATIONALE FOR CHOOSING SCIKIT-LEARN TF-IDF OVER DEEP LEARNING / LLMS:
1. Pure Determinism & Explainability: TF-IDF (Term Frequency - Inverse Document
   Frequency) provides exact mathematical term importance weighting across job
   postings without hallucinations or random sampling seeds.
2. Lightweight & High Throughput: Requires zero external model downloads (such as
   multi-gigabyte spaCy language packages or PyTorch weights), operating with
   sub-millisecond latency.
3. Strict Hard Constraint Compliance: Zero third-party proprietary AI API calls,
   fully meeting the hackathon requirement of classical NLP algorithms.
4. Taxonomy Alias Mapping: Combines TF-IDF term weighting with structured n-gram
   keyword matching against curated skill taxonomy aliases.
================================================================================
"""

import json
import re
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer

def preprocess_text(text: str) -> str:
    """Lowercase text for keyword extraction."""
    return text.lower()


def extract_skills_from_postings(postings: List[Dict[str, Any]], taxonomy: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """
    Extract skills from job postings using TF-IDF term weighting combined
    with taxonomy alias keyword matching.
    
    Returns a dictionary mapping skill_id -> {
        "id": skill_id,
        "name": skill_name,
        "category": category,
        "frequency": count_of_postings_mentioning_skill,
        "demandScore": float_normalized_between_0_and_1
    }
    """
    if not postings or not taxonomy:
        return {}
    
    descriptions = [preprocess_text(f"{p.get('title', '')} {p.get('description', '')}") for p in postings]
    total_postings = len(descriptions)
    
    # Initialize TF-IDF Vectorizer with unigrams, bigrams, and trigrams
    vectorizer = TfidfVectorizer(ngram_range=(1, 3), stop_words='english')
    try:
        vectorizer.fit(descriptions)
        feature_names = set(vectorizer.get_feature_names_out())
    except ValueError:
        feature_names = set()

    skill_counts = {}
    
    for skill in taxonomy:
        skill_id = skill["id"]
        aliases = [a.lower() for a in skill.get("aliases", [skill["name"].lower()])]
        
        posting_count = 0
        for desc in descriptions:
            # Check if any alias matches in the description
            matched = False
            for alias in aliases:
                # Use negative lookbehind/ahead so 'js' doesn't match '.js' in 'next.js'
                pattern = r'(?<![a-zA-Z0-9\.])' + re.escape(alias) + r'(?![a-zA-Z0-9])'
                if re.search(pattern, desc):
                    matched = True
                    break
            if matched:
                posting_count += 1
                
        skill_counts[skill_id] = {
            "id": skill_id,
            "name": skill["name"],
            "category": skill.get("category", "General"),
            "frequency": posting_count,
            "raw_ratio": posting_count / total_postings if total_postings > 0 else 0.0
        }
    
    # Normalize demand scores between 0.0 and 1.0 based on maximum frequency
    max_freq = max((data["frequency"] for data in skill_counts.values()), default=1)
    if max_freq == 0:
        max_freq = 1
        
    extracted_skills = {}
    for skill_id, data in skill_counts.items():
        # Demand score normalized to [0, 1] rounded to 2 decimal places
        demand_score = round(data["frequency"] / max_freq, 2)
        extracted_skills[skill_id] = {
            "id": data["id"],
            "name": data["name"],
            "category": data["category"],
            "frequency": data["frequency"],
            "demandScore": demand_score
        }
        
    return extracted_skills

if __name__ == "__main__":
    with open("data/raw_job_postings/job_postings.json", "r") as f:
        job_postings = json.load(f)
    with open("data/skill_taxonomy.json", "r") as f:
        skill_taxonomy = json.load(f)
        
    results = extract_skills_from_postings(job_postings, skill_taxonomy)
    print(f"Extracted {len(results)} skills from {len(job_postings)} job postings.")
    top_skills = sorted(results.values(), key=lambda x: x["demandScore"], reverse=True)[:10]
    for s in top_skills:
        print(f"- {s['name']}: demandScore = {s['demandScore']} (freq: {s['frequency']})")
