import re
from typing import Dict, Any, List
from app.engines.nlp_metrics import (
    NLPMetrics, SENTENCE_SPLIT_PATTERN
)

class ContentDNAEngine:
    """
    Generates the comprehensive Content DNA Signature and Engagement Simulation.
    """

    @classmethod
    def profile(cls, text: str) -> Dict[str, Any]:
        clean_text = text.strip()
        if not clean_text:
            return cls._empty_profile()

        # Tokenization
        raw_words = re.findall(r'\b[\w\'-]+\b', clean_text)
        sentences = [s.strip() for s in SENTENCE_SPLIT_PATTERN.split(clean_text) if s.strip()]
        
        first_sentence = sentences[0] if sentences else clean_text
        last_sentence = sentences[-1] if sentences else clean_text

        # Sub-analyses
        readability_ease, grade_level = NLPMetrics.calculate_readability(clean_text, raw_words, sentences)
        hook_data = NLPMetrics.analyze_hook(first_sentence, clean_text)
        cta_data = NLPMetrics.analyze_cta(clean_text, last_sentence)
        psych_data = NLPMetrics.analyze_psychology_and_emotions(clean_text)
        health_data = NLPMetrics.analyze_content_health(clean_text, raw_words, sentences)

        # Dimension Calculations (0-100)
        hook_strength = hook_data["hook_score"]
        readability_score = int(readability_ease)
        cta_strength = cta_data["cta_score"]
        emotional_impact = int((psych_data["psychology_scores"]["emotion"] + psych_data["psychology_scores"]["curiosity"]) / 2)
        
        # Clarity is inversely proportional to complexity and excessive length
        clarity_score = int(min(98, max(20, (readability_ease * 0.6) + (health_data["health_score"] * 0.4))))
        
        # Originality: based on vocabulary richness, lack of fluff starter, specific metrics
        originality_score = int(min(96, max(30, health_data["vocabulary_richness"] * 0.8 + (15 if hook_data["has_numbers"] else 0))))

        # Composite Engagement Potential Score (Heuristic Heuristic AI Model)
        engagement_potential = int(
            (hook_strength * 0.30) +
            (clarity_score * 0.20) +
            (emotional_impact * 0.20) +
            (cta_strength * 0.15) +
            (readability_score * 0.15)
        )
        engagement_potential = max(20, min(98, engagement_potential))

        # Target Audience & Content Type heuristics
        text_lower = clean_text.lower()
        if any(w in text_lower for w in ["code", "developer", "system", "api", "ai", "model", "python", "software", "tech", "react", "build"]):
            audience = "Engineers / Tech Leaders"
            content_type = "Technical / Case Study"
        elif any(w in text_lower for w in ["startup", "mrr", "revenue", "founder", "growth", "scale", "sales", "business", "clients"]):
            audience = "Founders / Creators"
            content_type = "Growth Breakdown"
        elif any(w in text_lower for w in ["student", "learn", "course", "beginner", "journey", "started", "college"]):
            audience = "Students / Early Career"
            content_type = "Educational / Story"
        else:
            audience = "Industry Professionals"
            content_type = "Thought Leadership"

        # Executive Verdict
        if engagement_potential >= 80:
            verdict = "🔥 High Potential: Strong viral foundation — ready for high distribution."
        elif engagement_potential >= 65:
            verdict = "⚡ Solid Post: Good clarity, but sharpening the hook and CTA will double conversions."
        else:
            verdict = "⚠️ High Scroll Risk: Opening is slow and CTA is weak. Apply the AI Rewrite Lab."

        # Engagement Simulation Breakdown (Original vs Predicted Improved vs Aggressive Hook)
        simulation = {
            "original": {
                "overall": engagement_potential,
                "hook": hook_strength,
                "clarity": clarity_score,
                "cta": cta_strength,
                "emotion": emotional_impact,
                "readability": readability_score
            },
            "improved": {
                "overall": min(95, engagement_potential + 22),
                "hook": min(96, hook_strength + 28),
                "clarity": min(94, clarity_score + 14),
                "cta": min(92, cta_strength + 32),
                "emotion": min(90, emotional_impact + 18),
                "readability": min(96, readability_score + 12)
            },
            "aggressive_hook": {
                "overall": min(97, engagement_potential + 28),
                "hook": 98,
                "clarity": min(92, clarity_score + 10),
                "cta": min(94, cta_strength + 35),
                "emotion": min(95, emotional_impact + 26),
                "readability": min(94, readability_score + 10)
            },
            "deltas": {
                "hook": f"+{min(96, hook_strength + 28) - hook_strength}%",
                "clarity": f"+{min(94, clarity_score + 14) - clarity_score}%",
                "cta": f"+{min(92, cta_strength + 32) - cta_strength}%",
                "emotion": f"+{min(90, emotional_impact + 18) - emotional_impact}%",
                "readability": f"+{min(96, readability_score + 12) - readability_score}%",
                "overall": f"+{min(95, engagement_potential + 22) - engagement_potential}%"
            }
        }

        return {
            "content_dna": {
                "hook_strength": hook_strength,
                "clarity": clarity_score,
                "emotional_impact": emotional_impact,
                "readability": readability_score,
                "cta_strength": cta_strength,
                "originality": originality_score,
                "grade_level": grade_level,
                "meta": {
                    "tone": psych_data["tone"],
                    "primary_emotion": psych_data["primary_emotion"],
                    "audience": audience,
                    "content_type": content_type
                }
            },
            "scroll_risk": hook_data,
            "cta_analysis": cta_data,
            "psychology": psych_data["psychology_scores"],
            "content_health": health_data,
            "scorecard": {
                "engagement_potential": engagement_potential,
                "overall_health": health_data["health_score"],
                "verdict": verdict,
                "stats": {
                    "word_count": len(raw_words),
                    "character_count": len(clean_text),
                    "sentence_count": len(sentences),
                    "avg_sentence_len": health_data["avg_sentence_length"]
                }
            },
            "simulation": simulation
        }

    @classmethod
    def _empty_profile(cls) -> Dict[str, Any]:
        return {
            "content_dna": {
                "hook_strength": 0, "clarity": 0, "emotional_impact": 0,
                "readability": 0, "cta_strength": 0, "originality": 0, "grade_level": 0.0,
                "meta": {"tone": "N/A", "primary_emotion": "N/A", "audience": "N/A", "content_type": "N/A"}
            },
            "scroll_risk": {"hook_score": 0, "hook_sentence": "", "word_count": 0, "scroll_risk": "Low", "risk_reason": "No text provided.", "suggested_better_hook": ""},
            "cta_analysis": {"cta_score": 0, "has_high_intent_cta": False, "has_medium_intent_cta": False, "keywords_found": [], "assessment": ""},
            "psychology": {"curiosity": 0, "trust": 0, "urgency": 0, "emotion": 0},
            "content_health": {"health_score": 0, "checklist": [], "vocabulary_richness": 0, "avg_sentence_length": 0, "hashtag_count": 0, "is_spam_free": True},
            "scorecard": {"engagement_potential": 0, "overall_health": 0, "verdict": "Empty", "stats": {"word_count": 0, "character_count": 0, "sentence_count": 0, "avg_sentence_len": 0}},
            "simulation": {"original": {}, "improved": {}, "aggressive_hook": {}, "deltas": {}}
        }
