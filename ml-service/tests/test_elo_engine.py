"""
Unit tests for SkillPath Psychometric Elo Rating Engine.
"""

import sys
import os
import pytest

def calculate_expected_score(user_rating: float, question_difficulty: float) -> float:
    return 1.0 / (1.0 + 10.0 ** ((question_difficulty - user_rating) / 400.0))

def update_elo_rating(user_rating: float, question_difficulty: float, is_correct: bool, k_factor: float = 32.0) -> tuple[float, float]:
    actual_score = 1.0 if is_correct else 0.0
    expected_score = calculate_expected_score(user_rating, question_difficulty)
    delta = round(k_factor * (actual_score - expected_score))
    new_rating = max(800.0, min(2000.0, user_rating + delta))
    return new_rating, delta

def test_elo_increases_on_correct_answer():
    """Test 1: Correct answer increases Elo rating."""
    initial_rating = 1000.0
    difficulty = 1000.0
    new_rating, delta = update_elo_rating(initial_rating, difficulty, is_correct=True)
    
    assert delta > 0, "Delta should be positive for correct answer"
    assert new_rating == 1016.0, f"Expected 1016.0, got {new_rating}"

def test_elo_decreases_on_incorrect_answer():
    """Test 2: Incorrect answer decreases Elo rating."""
    initial_rating = 1000.0
    difficulty = 1000.0
    new_rating, delta = update_elo_rating(initial_rating, difficulty, is_correct=False)
    
    assert delta < 0, "Delta should be negative for incorrect answer"
    assert new_rating == 984.0, f"Expected 984.0, got {new_rating}"

def test_elo_hard_question_bonus():
    """Test 3: Answering a much harder question yields higher Elo delta."""
    user_rating = 1000.0
    easy_diff = 800.0
    hard_diff = 1400.0
    
    _, easy_delta = update_elo_rating(user_rating, easy_diff, is_correct=True)
    _, hard_delta = update_elo_rating(user_rating, hard_diff, is_correct=True)
    
    assert hard_delta > easy_delta, "Hard question delta should be greater than easy question delta"
