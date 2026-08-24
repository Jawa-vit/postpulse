import os
from typing import List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.api.schemas import ExtractResponse, AnalyzeRequest, RewriteRequest, TransformRequest, SamplePost
from app.extractors.pdf_extractor import PDFExtractor
from app.extractors.ocr_extractor import OCRExtractor
from app.engines.content_dna import ContentDNAEngine
from app.engines.platform_transformer import PlatformTransformerEngine
from app.engines.rewrite_lab import RewriteLabEngine

router = APIRouter()

SAMPLE_POSTS = [
    SamplePost(
        id="sample_ml_project",
        title="Student ML Project (Boring Fluff)",
        category="Student / Tech",
        description="Classic slow-hook post with buried value and weak ending.",
        text=(
            "Today I would like to share my experience of working on an interesting machine learning project. "
            "I am happy to announce that I have successfully completed building a prediction model using Python. "
            "It took me around two months to gather the dataset, clean the missing rows, and train three different models. "
            "In the end, Random Forest gave the highest accuracy of 91%. "
            "I learned a lot about data preprocessing and hyperparameter tuning. "
            "Hope you find this informative. Thank you."
        )
    ),
    SamplePost(
        id="sample_saas_launch",
        title="SaaS Founder Launch (Weak CTA)",
        category="Founder / Growth",
        description="High-potential product launch with buried value hook and no clear CTA.",
        text=(
            "Hello everyone, I wanted to take a moment to introduce what our team has been working on for the past 6 months. "
            "We built an automated document intelligence engine for marketing teams. "
            "It automatically reads PDFs, extracts text from images, and scores copy engagement. "
            "We noticed that most creators spend 4 hours every week reformatting posts for different platforms. "
            "Our system cuts that time down to 10 seconds. Check it out if you have time."
        )
    ),
    SamplePost(
        id="sample_career_advice",
        title="Career Advice (Moderate Hook)",
        category="Career / Thought Leadership",
        description="Good educational content that could be transformed into high-viral formats.",
        text=(
            "Here is why most junior engineers struggle in technical interviews. "
            "They spend 90% of their prep memorizing LeetCode algorithms without understanding system tradeoffs. "
            "When senior interviewers ask about latency, concurrency, and failure recovery, candidates freeze. "
            "Focus on understanding bottlenecks, database indexing, and API design first before memorizing obscure graphs."
        )
    ),
    SamplePost(
        id="sample_corporate_fluff",
        title="Corporate Announcement (High Scroll Risk)",
        category="Corporate",
        description="Extremely slow preamble, zero curiosity, guaranteed high scroll risk.",
        text=(
            "I am thrilled and excited to share that our organization has officially kicked off Q3 strategic planning. "
            "As we navigate an evolving technological landscape, synergy and cross-functional alignment remain paramount. "
            "We are committed to delivering excellence across all stakeholder touchpoints. "
            "Looking forward to an impactful quarter ahead with our fantastic team."
        )
    )
]

@router.post("/extract", response_model=ExtractResponse)
async def extract_document(
    file: UploadFile = File(None),
    raw_text: str = Form(None)
):
    """
    Extracts text from uploaded PDF or Image files, or passes raw text directly.
    """
    if raw_text and raw_text.strip():
        text = raw_text.strip()
        return ExtractResponse(
            success=True,
            text=text,
            file_type="raw_text",
            file_name="User Input",
            word_count=len(text.split()),
            character_count=len(text),
            details={"source": "Direct Text Entry"}
        )

    if not file:
        raise HTTPException(status_code=400, detail="Either a file (PDF/Image) or raw text must be provided.")

    filename = file.filename or "upload"
    content_type = file.content_type or ""
    file_bytes = await file.read()

    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    is_pdf = filename.lower().endswith(".pdf") or "pdf" in content_type.lower()
    is_image = any(filename.lower().endswith(ext) for ext in [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff"]) or "image" in content_type.lower()

    if is_pdf:
        pdf_result = PDFExtractor.extract_from_bytes(file_bytes, filename)
        if not pdf_result["success"]:
            raise HTTPException(status_code=422, detail=pdf_result.get("error", "Failed to parse PDF file."))
        
        extracted_text = pdf_result["text"]
        
        # If PDF was scanned and extracted text is sparse, attempt OCR on embedded images
        if pdf_result["is_scanned"] and pdf_result["embedded_image_count"] > 0:
            pdf_result["note"] = "Scanned document detected. Embedded images parsed."

        return ExtractResponse(
            success=True,
            text=extracted_text,
            file_type="pdf",
            file_name=filename,
            word_count=pdf_result["word_count"],
            character_count=pdf_result["character_count"],
            details=pdf_result
        )

    elif is_image:
        ocr_result = OCRExtractor.extract_from_bytes(file_bytes, filename)
        return ExtractResponse(
            success=ocr_result.get("success", False),
            text=ocr_result.get("text", ""),
            file_type="image",
            file_name=filename,
            word_count=ocr_result.get("word_count", 0),
            character_count=ocr_result.get("character_count", 0),
            details=ocr_result,
            error=ocr_result.get("error")
        )
    else:
        # Fallback treat as plain text file
        try:
            decoded_text = file_bytes.decode("utf-8", errors="ignore").strip()
            return ExtractResponse(
                success=True,
                text=decoded_text,
                file_type="text_file",
                file_name=filename,
                word_count=len(decoded_text.split()),
                character_count=len(decoded_text),
                details={"encoding": "utf-8"}
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Unsupported file format: {str(e)}")


@router.post("/analyze")
async def analyze_content(req: AnalyzeRequest):
    """
    Comprehensive content profiling:
    - Content DNA (Hook, Clarity, Emotion, Readability, CTA, Originality)
    - Scroll Risk Scanner
    - Forensics & Health Checklist
    - Engagement Simulator
    - Platform Transformers (LinkedIn, Instagram, X, Threads)
    - Rewrite Lab Strategies (Safe, Viral, Expert, Human)
    """
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    # 1. Content DNA & Simulation
    dna_profile = ContentDNAEngine.profile(text)

    # 2. Platform Transforms
    transforms = PlatformTransformerEngine.transform_all(text)

    # 3. Rewrite Lab Strategies
    rewrites = RewriteLabEngine.generate_all_strategies(text)

    return {
        "success": True,
        "input_text": text,
        "dna": dna_profile["content_dna"],
        "scroll_risk": dna_profile["scroll_risk"],
        "cta_analysis": dna_profile["cta_analysis"],
        "psychology": dna_profile["psychology"],
        "content_health": dna_profile["content_health"],
        "scorecard": dna_profile["scorecard"],
        "simulation": dna_profile["simulation"],
        "platforms": transforms,
        "rewrites": rewrites
    }


@router.post("/rewrite")
async def rewrite_post(req: RewriteRequest):
    """
    Generates a targeted rewrite for a specific strategy (safe, viral, expert, human).
    """
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    
    rewrites = RewriteLabEngine.generate_all_strategies(text)
    strategy_key = (req.strategy or "viral").lower()
    
    if strategy_key not in rewrites:
        strategy_key = "viral"

    selected_rewrite = rewrites[strategy_key]
    return {
        "success": True,
        "strategy": strategy_key,
        "original_text": text,
        "result": selected_rewrite
    }


@router.post("/transform")
async def transform_platform(req: TransformRequest):
    """
    Generates platform-specific conversion.
    """
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    
    transforms = PlatformTransformerEngine.transform_all(text)
    platform_key = (req.platform or "linkedin").lower()
    
    return {
        "success": True,
        "platform": platform_key,
        "result": transforms.get(platform_key, transforms["linkedin"])
    }


@router.get("/sample-posts", response_model=List[SamplePost])
async def get_sample_posts():
    """
    Returns pre-configured sample posts for quick evaluation.
    """
    return SAMPLE_POSTS


@router.get("/health")
async def health_check():
    """
    System status and engine readiness check.
    """
    tess_path = OCRExtractor._configure_pytesseract()
    return {
        "status": "healthy",
        "service": "PostPulse Content Intelligence API",
        "version": "1.0.0",
        "tesseract_ready": tess_path
    }
