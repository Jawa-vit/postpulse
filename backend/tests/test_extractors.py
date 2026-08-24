import pytest
import io
import fitz
from PIL import Image
from app.extractors.pdf_extractor import PDFExtractor
from app.extractors.ocr_extractor import OCRExtractor

def test_pdf_extractor_with_generated_pdf():
    # Create in-memory test PDF with structured paragraphs
    doc = fitz.open()
    page = doc.new_page()
    sample_content = "PostPulse Test Post\n\nHere is a high-engagement social media draft for testing."
    page.insert_text((50, 72), sample_content, fontsize=12)
    
    pdf_bytes = doc.tobytes()
    doc.close()
    
    result = PDFExtractor.extract_from_bytes(pdf_bytes, "test_post.pdf")
    
    assert result["success"] is True
    assert result["page_count"] == 1
    assert "PostPulse Test Post" in result["text"]
    assert result["word_count"] >= 5

def test_ocr_extractor_handles_empty_or_generated_image():
    # Create small test image
    img = Image.new("RGB", (300, 100), color=(255, 255, 255))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    img_bytes = buf.getvalue()
    
    result = OCRExtractor.extract_from_bytes(img_bytes, "test_canvas.png")
    assert "dimensions" in result
    assert result["dimensions"] == "300x100"
    assert "format" in result
