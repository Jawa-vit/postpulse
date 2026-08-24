# 📋 Technical Assessment Approach Write-Up

**Candidate Assessment Submission**: Software Engineering Position  
**Project**: PostPulse — Social Media Content Intelligence Platform  
**Deliverable**: Brief Write-up of Approach (Strict Constraint: **200 Words Max**)

---

## 🎯 Executive Approach Write-Up *(183 Words — Strictly < 200 Words Limit)*

> PostPulse was engineered as an explainable Content Intelligence Platform that transforms static social media drafts, PDFs, and mobile screenshots into actionable digital twins. Rather than simply extracting raw text or relying on opaque AI wrappers, the system evaluates the cognitive and psychological drivers of audience retention.
> 
> The architecture employs a dual-pipeline ingestion layer: PyMuPDF preserves structural document layouts from multi-page PDFs, while a high-performance multi-pass OCR engine extracts text from compressed screenshots and mobile graphics in milliseconds.
> 
> Extracted content is processed through a deterministic NLP analytics engine calculating readability indices, sentence velocity, call-to-action intent, and psycholinguistic markers. The system computes a 6-vector Content DNA score (Hook Strength, Readability, Skimmability, Sentiment, CTA, and Curiosity) and pinpoints scroll friction in the critical opening seconds.
> 
> To maximize distribution, the Platform Transformer calibrates formatting for LinkedIn, Instagram, X (single post + 3-part threads), and Threads. The Revision Lab generates four targeted writing strategies (Clean Polish, High Engagement, Authority, and Authentic Story) paired with side-by-side visual diffs and diagnostic rationales.
> 
> Built with FastAPI, React, and TypeScript, PostPulse executes all profiling locally in under 20 milliseconds without third-party API dependencies.

---

## 🏛️ Summary of Key Technical Decisions

- **Fast & Reliable Ingestion**: Dual-engine design combining **PyMuPDF** (layout-aware PDF parsing) and **Universal OCR** (Windows Native AI OCR for sub-50ms local execution + Tesseract for Docker/Cloud).
- **Deterministic Analytics Engine**: Flesch-Kincaid grade level, velocity analysis, and lexical intent scoring eliminate unpredictable hallucinations.
- **Production-Grade Code Quality**: Strict TypeScript types (`verbatimModuleSyntax`), modular FastAPI backend architecture, and **13/13 automated test suite** with 100% pass rate.
- **Unified Cloud Containerization**: Multi-stage `Dockerfile` serving both the compiled React SPA and FastAPI endpoints as a single unified service on **Render**.
