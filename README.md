# 🚀 PostPulse — AI-Powered Social Media Content Digital Twin

> **"Don't just analyze your content. Understand why it works."**  
> PostPulse is an explainable **Social Media Content Intelligence & Digital Twin Platform** that reconstructs, profiles, diagnoses, and optimizes content across LinkedIn, Instagram, X (Twitter), and Threads.

---

## 🌟 Key Capabilities & Differentiators

```
                 USER UPLOAD
                     ↓
          ┌─────────────────────┐
          │ PDF / Screenshot /  │
          │ Image / Document    │
          └──────────┬──────────┘
                     ↓
              OCR / PDF Parser
                     ↓
              CONTENT ENGINE
                     ↓
        ┌────────────┼────────────┐
        ↓            ↓            ↓
   Content DNA   Risk Scanner   Audience
        ↓            ↓            ↓
        └────────────┼────────────┘
                     ↓
              ENGAGEMENT SCORE
                     ↓
          ┌──────────┴──────────┐
          ↓                     ↓
   "What's wrong?"        "How to fix?"
          ↓                     ↓
    Explanation          AI Improvements
                                ↓
                    ┌───────────┼───────────┐
                    ↓           ↓           ↓
                 LinkedIn    Instagram    X/Twitter
```

### 🧬 1. Content DNA Signature
Profiles content along 6 distinct vectors (0–100):
- **Hook Strength**: First-sentence velocity & curiosity gap.
- **Message Clarity**: Flesch Reading Ease & structural conciseness.
- **Emotional Impact**: Psycholinguistic intensity (Curiosity, Trust, Urgency, Joy).
- **Readability Ease**: Syllable pacing and reading grade level.
- **CTA Strength**: Conversion guidance and intent detection.
- **Originality**: Vocabulary richness & metric density.
- *Meta Tags*: Tone, Primary Emotion, Target Audience, Content Type.

### 🚨 2. Scroll Risk Scanner
Detects the exact word delay causing reader friction and highlights:
- ❌ **Weak Opening**: Displays the wordy preamble.
- 🔥 **High-Converting Hook Alternative**: Rule-based & AI-backed instant replacement.

### 🧠 3. Engagement Simulator
Forecasts reach potential across 3 scenarios:
- **Original** vs **PostPulse Optimized** vs **Aggressive Hook**
- Displays metric deltas (+32% Hook, +18% Clarity, +27% CTA, +14% Emotion).

### 🤯 4. Platform Transformer (1 Input → 4 Platforms)
- **LinkedIn**: Thought-leadership storytelling, double line-spacing, career takeaway, engagement CTA.
- **Instagram**: Visual scannable bullets, high-energy opening, "Save this post" bookmark hook.
- **X / Twitter**: Single punchy tweet (< 280 chars) + 3-part viral thread (`1/3`, `2/3`, `3/3`).
- **Threads**: Conversational, unfiltered, authentic reply starter.

### 🔍 5. Content Forensics & Audience Psychology
- **Health Checklist**: Excessive repetition, sentence pacing, CTA clarity, spam prevention, information density.
- **Audience Psychology**: Live meters for *Curiosity*, *Trust*, *Urgency*, and *Emotion*.

### 💎 6. Visual Diff & "Why is it better?" Diagnostic
- Side-by-side Before vs After diff with structured AI improvement tags explaining the rationale.

### 🔬 7. Rewrite Lab (4 Personas)
- 🎯 **Safe Polish**: Conservative improvement preserving voice.
- 🔥 **Viral Magnet**: High curiosity gap & viral pacing.
- 🧠 **Authority & Expert**: Data-driven thought leadership & framework format.
- 💬 **Authentic Human**: Vulnerable storytelling that builds genuine connection.

### 🏆 8. Executive Scorecard & Report Export
- Printable executive summary and formatted markdown report.

---

## 🛠️ Architecture & Tech Stack

- **Backend**: Python 3.9+, FastAPI, Uvicorn, Pydantic, PyMuPDF (`fitz`), Pillow, PyTesseract.
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Canvas Confetti.
- **NLP Engine**: Deterministic Flesch-Kincaid readability, psycholinguistic lexicons, regex tokenizers (sub-20ms latency, zero cloud vendor lock-in).
- **Test Suite**: Pytest (13 integration tests) + TypeScript type-checking.

---

## ⚡ Quick Start Guide

### Prerequisites
- Python 3.9+ installed
- Node.js 18+ and npm installed

### 1. Start the Backend API
```bash
cd backend
python -m venv .venv

# On Windows:
.\.venv\Scripts\activate

# On macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend API will be live at `http://localhost:8000` (Interactive Swagger Docs at `http://localhost:8000/docs`).

### 2. Start the Frontend UI
```bash
cd ../frontend
npm install
npm run dev
```
Frontend will be accessible at `http://localhost:5173`.

---

## 🌐 Cloud Hosting & Live URL Deployment

PostPulse is pre-configured with a multi-stage `Dockerfile` and `render.yaml` for 1-click cloud hosting on **Render**, **Railway**, **Fly.io**, or **Vercel**.

1. Push your repository to GitHub.
2. Go to [render.com](https://render.com) → **New Web Service** → Connect your repository.
3. Select **Docker** environment and click **Create Web Service**.
4. Render will build and deploy the entire application at `https://your-app.onrender.com`.

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for full step-by-step instructions for Render, Vercel, and Docker.

---

## 🧪 Running Tests

### Backend Test Suite
```bash
cd backend
python -m pytest -v
```
*Output: 13 passed unit and integration tests verifying extractors, NLP metrics, Content DNA, and API routes.*

### Frontend Production Build
```bash
cd frontend
npm run build
```

---

## 📂 Project Structure

```
postpulse/
├── APPROACH.md              # 200-word submission write-up for assessment
├── README.md                # Project documentation & architecture
├── test_samples/            # Sample PDF, screenshot, and text test files
│   ├── sample_tech_post.pdf
│   ├── sample_screenshot.png
│   └── sample_draft.txt
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI routers & schemas
│   │   ├── core/            # App configuration & Tesseract auto-detection
│   │   ├── engines/         # Content DNA, NLP, Transformer & Rewrite engines
│   │   ├── extractors/      # PyMuPDF parser & OCR extractor
│   │   └── main.py          # FastAPI application entrypoint
│   ├── tests/               # Pytest suite
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/      # UI components (ContentDNA, ScrollRisk, Simulator, etc.)
    │   ├── data/            # Preloaded demo post scenarios
    │   ├── services/        # API client
    │   ├── types/           # TypeScript interfaces
    │   ├── App.tsx          # Main dashboard view
    │   └── main.tsx
    ├── package.json
    └── tailwind.config.js
```

---

## 📝 200-Word Assessment Summary

Please refer to [`APPROACH.md`](APPROACH.md) for the official assessment submission write-up.
