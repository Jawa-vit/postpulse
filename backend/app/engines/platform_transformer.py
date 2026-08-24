import re
from typing import Dict, Any, List
from app.engines.nlp_metrics import SENTENCE_SPLIT_PATTERN

class PlatformTransformerEngine:
    """
    Transforms any raw post or extracted draft into platform-tailored formats:
    LinkedIn, Instagram, X (Twitter), and Threads.
    """

    @classmethod
    def transform_all(cls, text: str) -> Dict[str, Any]:
        clean_text = text.strip()
        if not clean_text:
            return {"linkedin": "", "instagram": "", "twitter": "", "threads": ""}

        sentences = [s.strip() for s in SENTENCE_SPLIT_PATTERN.split(clean_text) if s.strip()]
        core_body = sentences[1:] if len(sentences) > 1 else sentences
        
        linkedin_version = cls._generate_linkedin(clean_text, sentences, core_body)
        instagram_version = cls._generate_instagram(clean_text, sentences, core_body)
        twitter_version = cls._generate_twitter(clean_text, sentences, core_body)
        threads_version = cls._generate_threads(clean_text, sentences, core_body)

        return {
            "linkedin": {
                "platform": "LinkedIn",
                "content": linkedin_version,
                "character_count": len(linkedin_version),
                "tips": "Double spacing and bulleted observations maximize mobile dwell time."
            },
            "instagram": {
                "platform": "Instagram",
                "content": instagram_version,
                "character_count": len(instagram_version),
                "tips": "Action-oriented takeaways paired with clear bookmark reminders drive explore distribution."
            },
            "twitter": {
                "platform": "X / Twitter",
                "content": twitter_version["tweet"],
                "thread": twitter_version["thread"],
                "character_count": len(twitter_version["tweet"]),
                "tips": "Crisp single-line insights under 280 characters earn significantly higher bookmark ratios."
            },
            "threads": {
                "platform": "Threads",
                "content": threads_version,
                "character_count": len(threads_version),
                "tips": "Conversational, unpolished tone drives higher reply rates."
            }
        }

    @staticmethod
    def _extract_insights(sentences: List[str]) -> List[str]:
        """Extract clean core insight phrases for bullet points."""
        insights = []
        for s in sentences:
            s_clean = s.strip().rstrip(".")
            if len(s_clean.split()) >= 4:
                s_clean = re.sub(r'^(i wanted to|we decided to|it is important to|firstly|secondly|also|i am happy to|today i would like to)\s*', '', s_clean, flags=re.IGNORECASE)
                if s_clean:
                    insights.append(s_clean[0].upper() + s_clean[1:])
            if len(insights) >= 3:
                break
        
        if not insights:
            insights = [
                "Clarity of execution matters far more than complexity",
                "80% of output quality comes from disciplined fundamentals",
                "Small, rapid iterations compound faster than big masterplans"
            ]
        return insights

    @classmethod
    def _generate_linkedin(cls, full_text: str, sentences: List[str], core_body: List[str]) -> str:
        insights = cls._extract_insights(core_body)
        
        first = sentences[0] if sentences else "Here is what I learned from this build."
        hook = re.sub(r'^(i am happy to share that|i am excited to announce|today i want to share|today i would like to share my experience of working on an?)\s*', '', first, flags=re.IGNORECASE).strip()
        hook = hook[0].upper() + hook[1:] if hook else "Key takeaways from our recent technical build:"

        bullets = "\n".join([f"→ {insight}" for insight in insights])

        post = (
            f"{hook}\n\n"
            f"When tackling complex projects, it's easy to get lost in details.\n"
            f"Here are the 3 principles that kept the team grounded:\n\n"
            f"{bullets}\n\n"
            f"The biggest takeaway?\n"
            f"Momentum comes from shipping early and learning from real feedback rather than perfecting in isolation.\n\n"
            f"What has been your experience with this? What's your top priority when kicking off a new build?"
        )
        return post

    @classmethod
    def _generate_instagram(cls, full_text: str, sentences: List[str], core_body: List[str]) -> str:
        insights = cls._extract_insights(core_body)
        bullets = "\n".join([f"• {insight}" for insight in insights])

        first = sentences[0] if sentences else "The practical breakdown you need to see."
        hook = re.sub(r'^(i am happy to share that|today i want to share|today i would like to share my experience of working on an?)\s*', '', first, flags=re.IGNORECASE).strip()
        hook = hook[0].upper() + hook[1:] if hook else "The lessons that changed how I build:"

        post = (
            f"{hook}\n\n"
            f"A quick breakdown of what actually moved the needle:\n\n"
            f"{bullets}\n\n"
            f"📌 Save this post for your next project planning session.\n\n"
            f"#softwareengineering #programming #buildinpublic #learning #productivity #developer"
        )
        return post

    @classmethod
    def _generate_twitter(cls, full_text: str, sentences: List[str], core_body: List[str]) -> Dict[str, Any]:
        insights = cls._extract_insights(core_body)
        
        t_bullets = "\n".join([f"• {insight[:45]}..." if len(insight) > 48 else f"• {insight}" for insight in insights[:3]])
        
        single_tweet = (
            f"What I learned building this:\n\n"
            f"{t_bullets}\n\n"
            f"Simple fundamentals win every time."
        )

        thread = [
            f"1/3 Most people overcomplicate project execution.\n\nHere is a 3-step breakdown of what actually worked:",
            f"2/3 The core takeaways:\n\n" + "\n".join([f"→ {ins}" for ins in insights]),
            f"3/3 That's a wrap!\n\nIf you found these observations useful, leave a reply with what worked best for your workflow."
        ]

        return {
            "tweet": single_tweet,
            "thread": thread
        }

    @classmethod
    def _generate_threads(cls, full_text: str, sentences: List[str], core_body: List[str]) -> str:
        insights = cls._extract_insights(core_body)
        first_insight = insights[0] if insights else "Keep the core simple"
        
        post = (
            f"Honest observation: {first_insight.lower()}.\n\n"
            f"I used to think adding more features made things better. "
            f"In reality, stripping away unnecessary complexity made the biggest difference.\n\n"
            f"Anyone else had to learn this the hard way?"
        )
        return post
