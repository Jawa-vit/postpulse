import re
from typing import Dict, Any, List
from app.engines.nlp_metrics import SENTENCE_SPLIT_PATTERN
from app.engines.platform_transformer import PlatformTransformerEngine

class RewriteLabEngine:
    """
    Context-aware revision engine offering 4 targeted editorial strategies:
    Clean Polish, High Engagement, Authority & Case Study, Authentic Story.
    """

    @classmethod
    def generate_all_strategies(cls, text: str) -> Dict[str, Any]:
        clean_text = PlatformTransformerEngine.clean_ocr_noise(text.strip())
        if not clean_text:
            return {}

        intent = PlatformTransformerEngine.detect_intent(clean_text)
        sentences = [s.strip() for s in SENTENCE_SPLIT_PATTERN.split(clean_text) if len(s.strip()) > 3]

        if intent == 'career_milestone':
            return cls._generate_career_strategies(clean_text)
        else:
            return cls._generate_standard_strategies(clean_text, sentences)

    @classmethod
    def _generate_career_strategies(cls, text: str) -> Dict[str, Any]:
        role, company = PlatformTransformerEngine._extract_role_and_company(text)

        safe = (
            f"I am pleased to share that I have started a new position as {role} at {company}.\n\n"
            f"I want to thank my mentors, colleagues, and friends who supported me during this transition. "
            f"I look forward to contributing to the team and taking on new challenges.\n\n"
            f"#CareerUpdate #NewPosition #{company.replace(' ', '')}"
        )

        viral = (
            f"🚀 Next chapter officially begins: I’m joining {company} as {role}!\n\n"
            f"From late-night problem solving to countless preparation hours, this journey taught me that persistence always pays off.\n\n"
            f"Immense gratitude to everyone in my corner. Excited to build, learn, and grow with the incredible team at {company}.\n\n"
            f"Here’s to what’s ahead! 🥂"
        )

        expert = (
            f"Professional Milestone: Transitioning to {role} at {company}.\n\n"
            f"Looking forward to applying scalable engineering practices, collaborating on core initiatives, and driving technical excellence with the team.\n\n"
            f"Grateful for the journey so far and excited for the road ahead.\n\n"
            f"#SoftwareEngineering #TechLeadership #CareerGrowth"
        )

        human = (
            f"Still feels surreal typing this out, but I've officially started as {role} at {company}!\n\n"
            f"The journey here had its fair share of doubts, rejections, and grind. To anyone currently in the middle of their job search: keep going, the right opportunity will come.\n\n"
            f"Thank you to everyone who believed in me along the way! ❤️"
        )

        return {
            "safe": {
                "strategy": "Safe",
                "name": "Clean Polish",
                "tagline": "Polished, professional announcement with clean grammar.",
                "content": safe,
                "predicted_score": 84,
                "improvements": ["Polished professional grammar", "Clean structure", "Direct gratitude note"]
            },
            "viral": {
                "strategy": "Viral",
                "name": "High Engagement",
                "tagline": "Dynamic storytelling hook celebrating the milestone with high emotional resonance.",
                "content": viral,
                "predicted_score": 93,
                "improvements": ["Strong celebratory opening", "Inspiring personal message", "High-retention mobile spacing"]
            },
            "expert": {
                "strategy": "Expert",
                "name": "Authority & Case Study",
                "tagline": "Executive summary highlighting domain focus and technical contribution.",
                "content": expert,
                "predicted_score": 89,
                "improvements": ["Executive industry framing", "Focus on technical impact", "Clean professional tags"]
            },
            "human": {
                "strategy": "Human",
                "name": "Authentic Story",
                "tagline": "Honest, inspiring, and encouraging reflection on the journey.",
                "content": human,
                "predicted_score": 91,
                "improvements": ["Heartfelt authentic gratitude", "Encouraging message to peers", "High organic comment potential"]
            }
        }

    @classmethod
    def _generate_standard_strategies(cls, text: str, sentences: List[str]) -> Dict[str, Any]:
        first = sentences[0] if sentences else "Here is a project update."
        body = "\n\n".join(sentences[1:]) if len(sentences) > 1 else text

        hook = re.sub(r'^(today i want to share|i am happy to share that|today i would like to share)\s*', '', first, flags=re.IGNORECASE).strip()
        hook = hook[0].upper() + hook[1:] if hook else first

        safe = (
            f"{hook}\n\n"
            f"{body}\n\n"
            f"Key takeaway: Consistent execution and clear fundamentals lead to repeatable results.\n\n"
            f"How do you approach this in your current workflow? Would love to hear your thoughts."
        )

        viral = (
            f"🚀 Most people overcomplicate this process.\n\n"
            f"{hook}\n\n"
            f"{body}\n\n"
            f"The biggest lesson? Speed of iteration beats perfectionism every single time.\n\n"
            f"If you're working on something similar, what's been your biggest bottleneck?"
        )

        expert = (
            f"Technical Retrospective: {hook}\n\n"
            f"{body}\n\n"
            f"Key engineering observations:\n"
            f"1. Decoupled architectural boundaries reduce cognitive overhead.\n"
            f"2. Early benchmarking prevents premature optimization bottlenecks.\n\n"
            f"What design trade-offs do you prioritize when shipping new systems?"
        )

        human = (
            f"I wanted to be candid about something: {hook.lower() if hook.startswith(('A ', 'An ', 'Building')) else hook}.\n\n"
            f"{body}\n\n"
            f"If you're currently in the middle of a difficult build, keep pushing. It always feels chaotic right before it clicks.\n\n"
            f"Anyone else navigating this right now?"
        )

        return {
            "safe": {
                "strategy": "Safe",
                "name": "Clean Polish",
                "tagline": "Polished phrasing and clear closing while preserving your voice.",
                "content": safe,
                "predicted_score": 83,
                "improvements": ["Cleaned filler words", "Balanced sentence pacing", "Natural closing question"]
            },
            "viral": {
                "strategy": "Viral",
                "name": "High Engagement",
                "tagline": "Direct curiosity hook, scannable structure & high-intent closing.",
                "content": viral,
                "predicted_score": 92,
                "improvements": ["High-curiosity hook", "Mobile-optimized line breaks", "Actionable discussion prompt"]
            },
            "expert": {
                "strategy": "Expert",
                "name": "Authority & Case Study",
                "tagline": "Structured technical retrospective establishing domain credibility.",
                "content": expert,
                "predicted_score": 89,
                "improvements": ["Domain authority framing", "Structured takeaways", "Peer-level discussion prompt"]
            },
            "human": {
                "strategy": "Human",
                "name": "Authentic Story",
                "tagline": "Candid, relatable narrative that builds genuine connection.",
                "content": human,
                "predicted_score": 90,
                "improvements": ["Candid storytelling", "Vulnerability builds trust", "High empathy discussion"]
            }
        }
