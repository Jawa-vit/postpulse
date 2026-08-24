import re
from typing import Dict, Any, List, Tuple

# Pre-compiled regex patterns for performance
URL_PATTERN = re.compile(r'https?://\S+|www\.\S+')
HASHTAG_PATTERN = re.compile(r'#(\w+)')
MENTION_PATTERN = re.compile(r'@(\w+)')
EMOJI_PATTERN = re.compile(r'[\U00010000-\U0010ffff]', flags=re.UNICODE)
SENTENCE_SPLIT_PATTERN = re.compile(r'(?<=[.!?])\s+|\n+')

# Comprehensive lexicons
CTA_KEYWORDS = {
    "high_intent": [
        "link in bio", "comment below", "dm me", "save this", "share this",
        "drop a comment", "sign up", "download", "register now", "click the link",
        "tag someone", "follow me", "check out the link", "reply with", "book a call",
        "grab your", "get your free", "apply now"
    ],
    "medium_intent": [
        "let me know", "what do you think", "what's your take", "thoughts?",
        "agree or disagree", "share your", "tell me", "how do you", "have you ever",
        "vote below", "swipe left", "swipe to", "double tap"
    ]
}

HOOK_FLUFF_STARTERS = [
    "i am happy to share", "today i would like to", "i am thrilled to announce",
    "excited to share that", "in today's world", "as an engineer", "as a developer",
    "i wanted to take a moment", "hello everyone", "hope you are all doing well",
    "recently i have been", "i am excited to present"
]

HIGH_HOOK_TRIGGERS = [
    "how to", "why most", "stop doing", "the secret to", "here is how",
    "i spent", "years of", "vs", "never", "always", "mistake", "truth about",
    "framework", "unpopular opinion", "here's what", "cheat sheet", "rules for"
]

EMOTION_LEXICON = {
    "curiosity": [
        "secret", "revealed", "discover", "uncovered", "hidden", "why", "mystery",
        "hack", "trick", "behind the scenes", "surprising", "strange", "fascinating",
        "unexpected", "curious", "unusual", "little-known", "truth"
    ],
    "trust": [
        "proven", "tested", "data", "results", "case study", "framework", "research",
        "transparent", "honest", "guaranteed", "verified", "experience", "authentic",
        "evidence", "metrics", "benchmark", "lessons"
    ],
    "urgency": [
        "now", "today", "limited", "fast", "quick", "instant", "deadline", "urgent",
        "don't wait", "before it's too late", "last chance", "act now", "critical",
        "warning", "stop"
    ],
    "inspiration": [
        "transform", "growth", "breakthrough", "achieve", "success", "master",
        "unstoppable", "empower", "thrive", "revolutionize", "dream", "scale",
        "journey", "passion", "overcome", "built"
    ]
}

SPAM_TRIGGERS = [
    "100% free", "make money fast", "crypto giveaway", "dm for promo",
    "guaranteed cash", "no risk", "earn $$", "passive income secret",
    "click here immediately", "buy now cheap"
]


class NLPMetrics:
    """
    Deterministic NLP & Heuristic Engine for Content Intelligence.
    Calculates readability, hook efficiency, CTA impact, emotional psychology,
    forensics health, and engagement potential.
    """

    @staticmethod
    def count_syllables(word: str) -> int:
        """Count approximate syllables in an English word."""
        word = word.lower().strip(".:;!?,-_()[]{}\"'")
        if not word:
            return 1
        if len(word) <= 3:
            return 1
        word = re.sub(r'(?:[^laeiouy]|ed|es|e)$', '', word)
        word = re.sub(r'^y', '', word)
        matches = re.findall(r'[aeiouy]{1,2}', word)
        return max(1, len(matches))

    @classmethod
    def calculate_readability(cls, text: str, words: List[str], sentences: List[str]) -> Tuple[float, float]:
        """
        Calculates Flesch Reading Ease (0-100) and Flesch-Kincaid Grade Level.
        """
        if not words or not sentences:
            return 70.0, 8.0
        
        num_words = len(words)
        num_sentences = max(1, len(sentences))
        total_syllables = sum(cls.count_syllables(w) for w in words)
        
        asl = num_words / num_sentences  # Average Sentence Length
        asw = total_syllables / num_words  # Average Syllables per Word
        
        # Flesch Reading Ease formula
        flesch_score = 206.835 - (1.015 * asl) - (84.6 * asw)
        flesch_score = max(10.0, min(100.0, flesch_score))
        
        # Flesch-Kincaid Grade Level formula
        grade_level = (0.39 * asl) + (11.8 * asw) - 15.59
        grade_level = max(1.0, min(18.0, grade_level))
        
        return round(flesch_score, 1), round(grade_level, 1)

    @classmethod
    def analyze_hook(cls, first_sentence: str, full_text: str) -> Dict[str, Any]:
        """
        Diagnoses the hook / opening sentence:
        - Word count of hook
        - Scroll risk level & exact diagnostic reason
        - Weak vs strong patterns
        - Suggested high-converting alternative
        """
        sentence_clean = first_sentence.strip()
        words = sentence_clean.split()
        word_count = len(words)
        sentence_lower = sentence_clean.lower()

        is_fluff = any(fluff in sentence_lower for fluff in HOOK_FLUFF_STARTERS)
        has_trigger = any(trig in sentence_lower for trig in HIGH_HOOK_TRIGGERS)
        has_question = "?" in sentence_clean
        has_numbers = bool(re.search(r'\b\d+\b', sentence_clean))
        has_emoji = bool(EMOJI_PATTERN.search(sentence_clean))

        # Base Hook Score
        score = 65
        if is_fluff:
            score -= 30
        if word_count > 25:
            score -= 20
        elif 6 <= word_count <= 16:
            score += 15
        if has_trigger:
            score += 15
        if has_numbers:
            score += 10
        if has_question:
            score += 10
        if has_emoji:
            score += 5

        score = max(15, min(98, score))

        # Determine Scroll Risk
        if score < 50 or is_fluff or word_count > 28:
            risk_level = "High"
            reason = f"Your first sentence takes {word_count} words and buries the core value proposition behind generic preamble."
        elif score < 75 or word_count > 20:
            risk_level = "Medium"
            reason = f"Opening is moderately clear ({word_count} words), but lacks high-curiosity or specific metric triggers."
        else:
            risk_level = "Low"
            reason = "Opening is crisp, punchy, and delivers an immediate curiosity or value proposition."

        # Rule-based clean, human-crafted hook alternative
        numbers = re.findall(r'\b\d+\b', full_text)
        sample_num = numbers[0] if numbers else "3"
        
        if is_fluff:
            better_hook = f"I tested 5 different approaches to building this system. Here are the {sample_num} critical lessons:"
        elif has_question:
            better_hook = "Most people get this completely backward — here is the exact framework to fix it:"
        else:
            better_hook = f"Here is the exact breakdown of how we achieved this in {sample_num} steps (without the fluff):"

        return {
            "hook_score": score,
            "hook_sentence": sentence_clean,
            "word_count": word_count,
            "scroll_risk": risk_level,
            "risk_reason": reason,
            "has_fluff_starter": is_fluff,
            "has_numbers": has_numbers,
            "has_question": has_question,
            "suggested_better_hook": better_hook
        }

    @classmethod
    def analyze_cta(cls, text: str, last_sentence: str) -> Dict[str, Any]:
        """
        Evaluates Call-To-Action presence and effectiveness.
        """
        text_lower = text.lower()

        found_high = [kw for kw in CTA_KEYWORDS["high_intent"] if kw in text_lower]
        found_medium = [kw for kw in CTA_KEYWORDS["medium_intent"] if kw in text_lower]

        has_question_cta = "?" in last_sentence
        has_link = bool(URL_PATTERN.search(text)) or "link" in text_lower

        score = 30  # Baseline
        if found_high:
            score += 45
        elif found_medium:
            score += 30
        
        if has_question_cta:
            score += 15
        if has_link:
            score += 10

        score = max(20, min(95, score))

        if score >= 75:
            assessment = "Strong & Direct CTA — clear action pathway for readers."
        elif score >= 50:
            assessment = "Moderate CTA — invites conversation but lacks explicit conversion prompt."
        else:
            assessment = "Weak / Missing CTA — the post ends without guiding the reader on what to do next."

        return {
            "cta_score": score,
            "has_high_intent_cta": bool(found_high),
            "has_medium_intent_cta": bool(found_medium),
            "keywords_found": found_high + found_medium,
            "assessment": assessment
        }

    @classmethod
    def analyze_psychology_and_emotions(cls, text: str) -> Dict[str, Any]:
        """
        Scores audience psychology levers (Curiosity, Trust, Urgency, Inspiration)
        and identifies dominant emotional tone.
        """
        words = [w.lower() for w in re.findall(r'\b\w+\b', text)]
        total_words = max(1, len(words))

        scores = {}
        for emotion, keywords in EMOTION_LEXICON.items():
            matches = sum(1 for w in words if w in keywords or any(kw in text.lower() for kw in keywords if " " in kw))
            # Normalized score from 30 to 95
            intensity = min(95, int(35 + (matches / total_words) * 350))
            scores[emotion] = intensity

        # Determine Primary Emotion & Tone
        sorted_emotions = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        primary_emotion = sorted_emotions[0][0].capitalize()

        # Tone derivation
        if scores["trust"] > 70 and scores["curiosity"] > 60:
            tone = "Authoritative • Insightful"
        elif scores["inspiration"] > 70:
            tone = "Motivational • Practical"
        elif scores["urgency"] > 70:
            tone = "Direct • Action-Oriented"
        else:
            tone = "Educational • Conversational"

        return {
            "psychology_scores": {
                "curiosity": scores["curiosity"],
                "trust": scores["trust"],
                "urgency": scores["urgency"],
                "emotion": scores["inspiration"]
            },
            "primary_emotion": primary_emotion,
            "tone": tone
        }

    @classmethod
    def analyze_content_health(cls, text: str, words: List[str], sentences: List[str]) -> Dict[str, Any]:
        """
        Forensics audit: checks repetition, sentence pacing, spam signals,
        information density, and structure hygiene.
        """
        num_words = max(1, len(words))
        unique_words = len(set(w.lower() for w in words))
        vocabulary_richness = round((unique_words / num_words) * 100, 1)

        # Repetition check
        word_freq = {}
        for w in words:
            wl = w.lower()
            if len(wl) > 3:
                word_freq[wl] = word_freq.get(wl, 0) + 1
        
        excessive_repetition = any(count > max(4, num_words * 0.08) for count in word_freq.values())

        # Sentence pacing
        sentence_lengths = [len(s.split()) for s in sentences if s.strip()]
        avg_sentence_len = sum(sentence_lengths) / max(1, len(sentence_lengths))
        good_pacing = 8 <= avg_sentence_len <= 18

        # Spam signals
        all_caps_words = sum(1 for w in words if w.isupper() and len(w) > 2)
        has_spam_triggers = any(trigger in text.lower() for trigger in SPAM_TRIGGERS)
        spam_flag = has_spam_triggers or (all_caps_words > 4)

        # Hashtags & Formatting
        hashtags = HASHTAG_PATTERN.findall(text)
        has_line_breaks = "\n" in text

        health_checklist = [
            {
                "label": "No excessive repetition",
                "passed": not excessive_repetition,
                "detail": f"Vocabulary richness: {vocabulary_richness}%"
            },
            {
                "label": "Good sentence length & pacing",
                "passed": good_pacing,
                "detail": f"Average sentence length: {round(avg_sentence_len, 1)} words"
            },
            {
                "label": "Clear Call-to-Action (CTA)",
                "passed": any(kw in text.lower() for kws in CTA_KEYWORDS.values() for kw in kws),
                "detail": "Action pathway presence"
            },
            {
                "label": "High information density",
                "passed": vocabulary_richness >= 55,
                "detail": f"{unique_words} unique concepts among {num_words} words"
            },
            {
                "label": "Clean promotional safety",
                "passed": not spam_flag,
                "detail": "Zero aggressive spam markers detected"
            },
            {
                "label": "Mobile-scannable structure",
                "passed": has_line_breaks and len(sentences) >= 2,
                "detail": "Whitespace formatting for mobile viewport"
            }
        ]

        passed_count = sum(1 for item in health_checklist if item["passed"])
        health_score = int((passed_count / len(health_checklist)) * 100)

        return {
            "health_score": health_score,
            "checklist": health_checklist,
            "vocabulary_richness": vocabulary_richness,
            "avg_sentence_length": round(avg_sentence_len, 1),
            "hashtag_count": len(hashtags),
            "is_spam_free": not spam_flag
        }
