"""
================================================================================
SKILL PATH — EXTRACTION QUALITY VALIDATION PIPELINE
================================================================================
Evaluates NLP skill extraction accuracy (Precision, Recall, F1 Score) against
hand-annotated ground truth job postings across all target engineering roles.
================================================================================
"""

import os
import json
import re
from typing import Dict, Any, List, Tuple
from skill_extractor import extract_skills_from_postings

def extract_skills_for_single_posting(posting: Dict[str, Any], taxonomy: List[Dict[str, Any]]) -> List[str]:
    """Extract skill IDs present in a single posting using taxonomy alias rules."""
    text = f"{posting.get('title', '')} {posting.get('description', '')}".lower()
    extracted_ids = []
    
    for skill in taxonomy:
        skill_id = skill["id"]
        aliases = [a.lower() for a in skill.get("aliases", [skill["name"].lower()])]
        
        for alias in aliases:
            pattern = r'(?<![a-zA-Z0-9\.])' + re.escape(alias) + r'(?![a-zA-Z0-9])'
            if re.search(pattern, text):
                extracted_ids.append(skill_id)
                break
                
    return extracted_ids


def evaluate_extraction_accuracy(ground_truth_path: str, taxonomy_path: str) -> Dict[str, Any]:
    """
    Computes precision, recall, and F1 score against ground truth hand labels.
    """
    with open(ground_truth_path, "r", encoding="utf-8") as f:
        ground_truth = json.load(f)
        
    with open(taxonomy_path, "r", encoding="utf-8") as f:
        taxonomy_data = json.load(f)

    role_results = {}
    total_tp = 0
    total_fp = 0
    total_fn = 0

    print("================================================================================")
    print("SKILLPATH NLP EXTRACTION QUALITY VALIDATION BENCHMARK")
    print("================================================================================")

    for role, postings in ground_truth.items():
        role_taxonomy = taxonomy_data[role] if isinstance(taxonomy_data, dict) and role in taxonomy_data else taxonomy_data
        
        role_tp = 0
        role_fp = 0
        role_fn = 0

        for posting in postings:
            posting_id = posting.get("posting_id", "unknown")
            expected = set(posting.get("expected_skills", []))
            extracted = set(extract_skills_for_single_posting(posting, role_taxonomy))

            tp = len(extracted.intersection(expected))
            fp = len(extracted - expected)
            fn = len(expected - extracted)

            role_tp += tp
            role_fp += fp
            role_fn += fn

        total_tp += role_tp
        total_fp += role_fp
        total_fn += role_fn

        precision = round(role_tp / (role_tp + role_fp), 4) if (role_tp + role_fp) > 0 else 0.0
        recall = round(role_tp / (role_tp + role_fn), 4) if (role_tp + role_fn) > 0 else 0.0
        f1 = round((2 * precision * recall) / (precision + recall), 4) if (precision + recall) > 0 else 0.0

        role_results[role] = {
            "postings_evaluated": len(postings),
            "true_positives": role_tp,
            "false_positives": role_fp,
            "false_negatives": role_fn,
            "precision": precision,
            "recall": recall,
            "f1_score": f1
        }

        print(f"Role: [{role.upper()}] (Postings: {len(postings)})")
        print(f"  • Precision: {precision * 100:.2f}%")
        print(f"  • Recall:    {recall * 100:.2f}%")
        print(f"  • F1 Score:  {f1 * 100:.2f}%\n")

    overall_precision = round(total_tp / (total_tp + total_fp), 4) if (total_tp + total_fp) > 0 else 0.0
    overall_recall = round(total_tp / (total_tp + total_fn), 4) if (total_tp + total_fn) > 0 else 0.0
    overall_f1 = round((2 * overall_precision * overall_recall) / (overall_precision + overall_recall), 4) if (overall_precision + overall_recall) > 0 else 0.0

    summary = {
        "overall": {
            "total_postings": sum(len(p) for p in ground_truth.values()),
            "true_positives": total_tp,
            "false_positives": total_fp,
            "false_negatives": total_fn,
            "precision": overall_precision,
            "recall": overall_recall,
            "f1_score": overall_f1
        },
        "by_role": role_results
    }

    print("--------------------------------------------------------------------------------")
    print("OVERALL EXTRACTOR ACCURACY BENCHMARK SUMMARY:")
    print(f"  • Total Evaluated Postings: {summary['overall']['total_postings']}")
    print(f"  • Micro Precision:         {overall_precision * 100:.2f}%")
    print(f"  • Micro Recall:            {overall_recall * 100:.2f}%")
    print(f"  • Micro F1 Score:          {overall_f1 * 100:.2f}%")
    print("================================================================================\n")

    return summary

if __name__ == "__main__":
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    gt_file = os.path.join(base_dir, "data", "ground_truth_labels.json")
    tax_file = os.path.join(base_dir, "data", "skill_taxonomy.json")
    
    metrics = evaluate_extraction_accuracy(gt_file, tax_file)
    
    # Save report output
    report_file = os.path.join(base_dir, "data", "extraction_validation_report.json")
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
    print(f"[Validation] Benchmark metrics saved to {report_file}")
