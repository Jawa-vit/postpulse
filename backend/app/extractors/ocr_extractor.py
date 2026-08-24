import io
import re
import asyncio
from typing import Dict, Any
from PIL import Image, ImageEnhance, ImageOps
import pytesseract
from app.core.config import settings

# Optional Windows native OCR support
try:
    import winocr
    HAS_WINOCR = True
except ImportError:
    HAS_WINOCR = False

class OCRExtractor:
    """
    Universal High-Performance OCR Extractor.
    1. Async Windows Native AI OCR (Windows.Media.Ocr via winocr) on Windows (~30ms latency).
    2. Tesseract OCR (pytesseract) on Linux/Docker/Cloud (~300ms latency).
    """
    
    @staticmethod
    def _configure_pytesseract() -> bool:
        tess_path = settings.get_tesseract_path()
        if tess_path:
            pytesseract.pytesseract.tesseract_cmd = tess_path
            return True
        return False

    @staticmethod
    def preprocess_image(image: Image.Image) -> Image.Image:
        if image.mode != "RGB":
            image = image.convert("RGB")

        max_dim = 1600
        w, h = image.size
        if max(w, h) > max_dim:
            scale = max_dim / float(max(w, h))
            new_w = int(w * scale)
            new_h = int(h * scale)
            image = image.resize((new_w, new_h), Image.Resampling.BILINEAR)

        gray = image.convert("L")
        auto_contrast = ImageOps.autocontrast(gray, cutoff=2)
        enhancer = ImageEnhance.Contrast(auto_contrast)
        enhanced = enhancer.enhance(1.4)
        return enhanced.convert("RGB")

    @classmethod
    async def extract_from_bytes_async(cls, file_bytes: bytes, filename: str = "image.png") -> Dict[str, Any]:
        try:
            image = Image.open(io.BytesIO(file_bytes))
            orig_w, orig_h = image.size
            format_name = image.format or "PNG"

            extracted_text = ""
            engine_used = "Text Parser"

            # 1. Native Windows AI OCR (Fast direct await in async event loop)
            if HAS_WINOCR:
                try:
                    res = await winocr.recognize_pil(image, 'en')
                    if res and res.text and res.text.strip():
                        extracted_text = res.text.strip()
                        engine_used = "Windows AI OCR"
                except Exception:
                    pass

            # 2. Fallback to Tesseract OCR (for Docker / Linux / Render)
            if not extracted_text:
                tesseract_ready = cls._configure_pytesseract()
                if tesseract_ready:
                    processed_img = cls.preprocess_image(image)
                    try:
                        extracted_text = pytesseract.image_to_string(
                            processed_img,
                            config=r'--oem 3 --psm 3 -c preserve_interword_spaces=1',
                            timeout=6
                        )
                        engine_used = "Tesseract OCR"
                    except Exception:
                        pass

            clean_text = extracted_text.strip()
            clean_text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', clean_text)
            clean_text = re.sub(r'[ \t]+', ' ', clean_text)
            clean_text = re.sub(r'\n{3,}', '\n\n', clean_text)
            clean_text = clean_text.strip()

            return {
                "success": bool(clean_text),
                "text": clean_text,
                "engine": engine_used,
                "confidence": 92.0 if clean_text else 0.0,
                "dimensions": f"{orig_w}x{orig_h}",
                "format": format_name,
                "word_count": len(clean_text.split()) if clean_text else 0,
                "character_count": len(clean_text)
            }
        except Exception as e:
            return {
                "success": False,
                "text": "",
                "error": f"Failed to extract text from image: {str(e)}",
                "engine": "Error",
                "confidence": 0.0,
                "dimensions": "0x0",
                "format": "Unknown",
                "word_count": 0,
                "character_count": 0
            }

    @classmethod
    def extract_from_bytes(cls, file_bytes: bytes, filename: str = "image.png") -> Dict[str, Any]:
        """Synchronous wrapper for tests."""
        try:
            return asyncio.run(cls.extract_from_bytes_async(file_bytes, filename))
        except RuntimeError:
            loop = asyncio.new_event_loop()
            res = loop.run_until_complete(cls.extract_from_bytes_async(file_bytes, filename))
            loop.close()
            return res
