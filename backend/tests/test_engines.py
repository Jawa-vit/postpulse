import pytest
from app.engines.nlp_metrics import NLPMetrics
from app.engines.content_dna import ContentDNAEngine
from app.engines.platform_transformer import PlatformTransformerEngine
from app.engines.rewrite_lab import RewriteLabEngine

SAMPLE_POST = (
    "Today I would like to share my experience of working on an interesting machine learning project. "
    "I am happy to announce that I have successfully completed building a prediction model using Python. "
    "It took me around two months to train three different models. "
    "Random Forest gave the highest accuracy of 91%. "
    "Check out the repository and let me know your thoughts."
)

def test_readability_calculation():
    words = SAMPLE_POST.split()
    sentences = [s.strip() for s in SAMPLE_POST.split(".") if s.strip()]
    flesch, grade = NLPMetrics.calculate_readability(SAMPLE_POST, words, sentences)
    
    assert 0 <= flesch <= 100
    assert 1.0 <= grade <= 18.0

def test_hook_analysis_detects_fluff():
    first_sentence = "Today I would like to share my experience of working on an interesting machine learning project."
    hook_result = NLPMetrics.analyze_hook(first_sentence, SAMPLE_POST)
    
    assert hook_result["has_fluff_starter"] is True
    assert hook_result["scroll_risk"] in ["High", "Medium"]
    assert "suggested_better_hook" in hook_result
    assert len(hook_result["suggested_better_hook"]) > 10

def test_cta_analysis():
    last_sentence = "Check out the repository and let me know your thoughts."
    cta_result = NLPMetrics.analyze_cta(SAMPLE_POST, last_sentence)
    
    assert cta_result["cta_score"] >= 40
    assert "assessment" in cta_result

def test_content_dna_profiler():
    profile = ContentDNAEngine.profile(SAMPLE_POST)
    
    assert "content_dna" in profile
    dna = profile["content_dna"]
    assert 0 <= dna["hook_strength"] <= 100
    assert 0 <= dna["clarity"] <= 100
    assert 0 <= dna["readability"] <= 100
    assert "meta" in dna
    assert dna["meta"]["tone"] != ""
    assert dna["meta"]["audience"] != ""

    assert "scorecard" in profile
    assert profile["scorecard"]["engagement_potential"] > 0

    assert "simulation" in profile
    assert "improved" in profile["simulation"]
    assert "deltas" in profile["simulation"]

def test_platform_transformer():
    transforms = PlatformTransformerEngine.transform_all(SAMPLE_POST)
    
    assert "linkedin" in transforms
    assert "instagram" in transforms
    assert "twitter" in transforms
    assert "threads" in transforms
    assert len(transforms["linkedin"]["content"]) > 0
    assert len(transforms["instagram"]["content"]) > 0
    assert len(transforms["twitter"]["content"]) > 0
    assert len(transforms["threads"]["content"]) > 0

def test_rewrite_lab_all_strategies():
    rewrites = RewriteLabEngine.generate_all_strategies(SAMPLE_POST)
    
    assert "safe" in rewrites
    assert "viral" in rewrites
    assert "expert" in rewrites
    assert "human" in rewrites

    assert rewrites["safe"]["predicted_score"] >= 70
    assert rewrites["viral"]["predicted_score"] >= 80
    assert len(rewrites["viral"]["improvements"]) >= 2
