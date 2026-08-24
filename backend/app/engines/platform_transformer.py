import re
from typing import Dict, Any, List
from app.engines.nlp_metrics import SENTENCE_SPLIT_PATTERN

class PlatformTransformerEngine:
    """
    Context-aware multi-channel content transformer for LinkedIn, Instagram, X, and Threads.
    Adapts intelligently to Career Updates, Technical Projects, Product Launches, and Educational posts.
    """

    @classmethod
    def clean_ocr_noise(cls, text: str) -> str:
        """Cleans common OCR artifacts and fragmented symbols."""
        cleaned = text
        cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', cleaned)
        cleaned = re.sub(r'[°•·»«§¶©®™]', '', cleaned)
        cleaned = re.sub(r'\b(?:rm|im)\s+happy\b', "I'm happy", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r'\b(?:positionas|position\s+as)\b', 'position as', cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r'\b(?:oftware|s\s+oftware)\b', 'Software', cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r'\s{2,}', ' ', cleaned).strip()
        return cleaned

    @classmethod
    def detect_intent(cls, text: str) -> str:
        """Classifies content intent: career_milestone, tech_project, product_launch, general."""
        t_lower = text.lower()
        if any(k in t_lower for k in [
            'starting a new position', 'starting a new role', 'new position as', 'new role as',
            'joined as', 'joining as', 'software engineer at', 'intern at', 'promoted to',
            'happy to share that i', 'excited to announce that i', 'started working at'
        ]):
            return 'career_milestone'
        elif any(k in t_lower for k in ['built', 'launched', 'developed', 'accuracy', 'model', 'dataset', 'repository', 'pipeline', 'requests/sec']):
            return 'tech_project'
        elif any(k in t_lower for k in ['saas', 'product', 'customer', 'mrr', 'pricing', 'sign up', 'waitlist']):
            return 'product_launch'
        return 'general'

    @classmethod
    def transform_all(cls, text: str) -> Dict[str, Any]:
        clean_text = cls.clean_ocr_noise(text.strip())
        if not clean_text:
            return {"linkedin": "", "instagram": "", "twitter": "", "threads": ""}

        intent = cls.detect_intent(clean_text)
        sentences = [s.strip() for s in SENTENCE_SPLIT_PATTERN.split(clean_text) if len(s.strip()) > 3]

        if intent == 'career_milestone':
            return cls._transform_career_milestone(clean_text, sentences)
        elif intent == 'tech_project':
            return cls._transform_tech_project(clean_text, sentences)
        elif intent == 'product_launch':
            return cls._transform_product_launch(clean_text, sentences)
        else:
            return cls._transform_general(clean_text, sentences)

    @classmethod
    def _extract_role_and_company(cls, text: str) -> tuple:
        """Extracts potential role and company from a job announcement."""
        role_match = re.search(r'(?:as|position\s+as)\s+([A-Za-z\s]+?)(?:\s+at|\s+with|\s+for|\s*!|\s*\.|\n)', text, flags=re.IGNORECASE)
        company_match = re.search(r'(?:at|with|for)\s+([A-Za-z0-9\s]+?)(?:\s*!|\s*\.|\n|$)', text, flags=re.IGNORECASE)
        
        role = role_match.group(1).strip() if role_match else "Software Engineer"
        company = company_match.group(1).strip() if company_match else "the team"
        return role, company

    @classmethod
    def _transform_career_milestone(cls, text: str, sentences: List[str]) -> Dict[str, Any]:
        role, company = cls._extract_role_and_company(text)

        linkedin = (
            f"🚀 Excited to share a new milestone: I’m starting a new position as {role} at {company}!\n\n"
            f"Grateful to everyone who supported, mentored, and encouraged me throughout this journey. "
            f"Really looking forward to collaborating with an exceptional team, solving impactful challenges, and continuing to grow.\n\n"
            f"Here’s to the next chapter!\n\n"
            f"#NewRole #CareerGrowth #Engineering #Opportunity #TechCareers"
        )

        instagram = (
            f"Next chapter unlocked! ✨ Thrilled to share that I'm joining {company} as {role}.\n\n"
            f"Huge thanks to everyone who believed in me along the way. Super excited for what’s ahead! 🚀\n\n"
            f"#newbeginnings #careerjourney #developer #techlife #growth"
        )

        twitter_single = f"Excited to share that I'm joining {company} as {role}! 🚀 Looking forward to building, learning, and growing with the team."
        twitter_thread = [
            f"1/2 Excited to share a personal update: I'm starting as {role} at {company}! 🚀",
            f"2/2 Huge thanks to everyone who supported me along the way. Really looking forward to this next phase of building and learning."
        ]

        threads = f"Big personal update today: officially starting as {role} at {company}! Grateful for the support and excited for this next chapter. 🚀"

        return {
            "linkedin": {"platform": "LinkedIn", "content": linkedin, "character_count": len(linkedin), "tips": "Professional milestone formatting with high-visibility network reach."},
            "instagram": {"platform": "Instagram", "content": instagram, "character_count": len(instagram), "tips": "Celebratory caption with clean hashtag grouping."},
            "twitter": {"platform": "X / Twitter", "content": twitter_single, "thread": twitter_thread, "character_count": len(twitter_single), "tips": "Punchy career announcement tailored for engagement."},
            "threads": {"platform": "Threads", "content": threads, "character_count": len(threads), "tips": "Authentic conversational update driving positive community replies."}
        }

    @classmethod
    def _transform_tech_project(cls, text: str, sentences: List[str]) -> Dict[str, Any]:
        first = sentences[0] if sentences else "Here is a project breakdown."
        hook = re.sub(r'^(today i want to share|i am happy to share that|today i would like to share)\s*', '', first, flags=re.IGNORECASE).strip()
        hook = hook[0].upper() + hook[1:] if hook else "Key insights from building this system:"

        insights = [s.strip() for s in sentences[1:4] if len(s.strip().split()) >= 4]
        if not insights:
            insights = [
                "Clean data preprocessing delivered an immediate accuracy boost",
                "Streamlined architecture reduced execution latency significantly",
                "Simpler baselines proved easier to maintain and deploy"
            ]

        bullets = "\n".join([f"• {ins}" for ins in insights])

        linkedin = (
            f"🚀 {hook}\n\n"
            f"Here is what actually made the difference during development:\n\n"
            f"{bullets}\n\n"
            f"The biggest takeaway? Disciplined fundamentals and fast feedback loops consistently beat over-engineering.\n\n"
            f"What design trade-offs do you prioritize when shipping new projects?\n\n"
            f"#SoftwareEngineering #MachineLearning #SystemDesign #TechInsights"
        )

        instagram = (
            f"💡 {hook}\n\n"
            f"Key lessons learned along the way:\n\n"
            f"{bullets}\n\n"
            f"📌 Save this post for your next project build!\n\n"
            f"#coding #developer #softwaredevelopment #techlife"
        )

        twitter_single = f"What I learned building this:\n\n{bullets[:180]}...\n\nKeep iterating."
        twitter_thread = [
            f"1/3 🧵 A breakdown of how this was built:\n\n{hook}",
            f"2/3 💡 Key takeaways:\n\n{bullets}",
            f"3/3 🎯 That's a wrap! If you found this useful, let me know your thoughts below."
        ]

        threads = f"Quick reflection from building this: simpler architecture almost always wins in production. What's your experience?"

        return {
            "linkedin": {"platform": "LinkedIn", "content": linkedin, "character_count": len(linkedin), "tips": "Insight-driven storytelling with clean spacing."},
            "instagram": {"platform": "Instagram", "content": instagram, "character_count": len(instagram), "tips": "Actionable takeaway format optimized for saves."},
            "twitter": {"platform": "X / Twitter", "content": twitter_single, "thread": twitter_thread, "character_count": len(twitter_single), "tips": "High-signal concise summary with thread option."},
            "threads": {"platform": "Threads", "content": threads, "character_count": len(threads), "tips": "Conversational question to spark authentic dialogue."}
        }

    @classmethod
    def _transform_product_launch(cls, text: str, sentences: List[str]) -> Dict[str, Any]:
        first = sentences[0] if sentences else "Introducing our new release."
        hook = re.sub(r'^(today we are happy to announce|hello everyone)\s*', '', first, flags=re.IGNORECASE).strip()
        hook = hook[0].upper() + hook[1:] if hook else "Introducing what we've been building:"

        body = "\n\n".join(sentences[1:3]) if len(sentences) > 1 else text

        linkedin = (
            f"✨ {hook}\n\n"
            f"{body}\n\n"
            f"Our goal is simple: eliminate manual friction so teams can focus on high-impact work.\n\n"
            f"Check out the link in the first comment and let us know your feedback!\n\n"
            f"#ProductLaunch #Innovation #SaaS #Productivity"
        )

        instagram = (
            f"🚀 {hook}\n\n"
            f"{body}\n\n"
            f"🔗 Full details & link in bio!\n\n"
            f"#launchday #saas #startuplife #technology"
        )

        twitter_single = f"🚀 {hook}\n\n{body[:160]}...\n\nLink in bio."
        twitter_thread = [
            f"1/2 🚀 {hook}",
            f"2/2 Built to solve manual workflow friction. Try it out and share your thoughts!"
        ]

        threads = f"We just went live with this! Excited to get your feedback and thoughts."

        return {
            "linkedin": {"platform": "LinkedIn", "content": linkedin, "character_count": len(linkedin), "tips": "Product launch format with first-comment link guide."},
            "instagram": {"platform": "Instagram", "content": instagram, "character_count": len(instagram), "tips": "Visual launch caption with bio CTA."},
            "twitter": {"platform": "X / Twitter", "content": twitter_single, "thread": twitter_thread, "character_count": len(twitter_single), "tips": "Direct launch update."},
            "threads": {"platform": "Threads", "content": threads, "character_count": len(threads), "tips": "Community feedback prompt."}
        }

    @classmethod
    def _transform_general(cls, text: str, sentences: List[str]) -> Dict[str, Any]:
        first = sentences[0] if sentences else text[:80]
        body = "\n\n".join(sentences[1:]) if len(sentences) > 1 else text

        linkedin = (
            f"{first}\n\n"
            f"{body}\n\n"
            f"What has been your experience with this? Would love to hear your perspective below.\n\n"
            f"#ProfessionalGrowth #ThoughtLeadership #Strategy"
        )

        instagram = (
            f"✨ {first}\n\n"
            f"{body}\n\n"
            f"📌 Save this for later!\n\n"
            f"#learning #mindset #growth #insights"
        )

        twitter_single = f"{first}\n\n{body[:180]}..."
        twitter_thread = [
            f"1/2 {first}",
            f"2/2 {body}"
        ]

        threads = f"{first}\n\nWhat are your thoughts on this?"

        return {
            "linkedin": {"platform": "LinkedIn", "content": linkedin, "character_count": len(linkedin), "tips": "Standard thoughtful post with clean spacing."},
            "instagram": {"platform": "Instagram", "content": instagram, "character_count": len(instagram), "tips": "Scannable caption format."},
            "twitter": {"platform": "X / Twitter", "content": twitter_single, "thread": twitter_thread, "character_count": len(twitter_single), "tips": "Concise post with thread."},
            "threads": {"platform": "Threads", "content": threads, "character_count": len(threads), "tips": "Open community prompt."}
        }
