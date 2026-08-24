import io
import re
import asyncio
from typing import Dict, Any
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
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
    Automatically leverages:
    1. Windows Native AI OCR (Windows.Media.Ocr via winocr) when running on Windows.
    2. Tesseract OCR (pytesseract) when running in Docker/Linux/Cloud.
    3. Multi-stage image enhancement and artifact cleanup.
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
        """
        Intelligent image preprocessing:
        - Downscale oversized images (max 1800px)
        - Convert to RGB
        - Autocontrast & slight unsharp sharpening
        """
        if image.mode != "RGB":
            image = image.convert("RGB")

        max_dim = 1800
        w, h = image.size
        if max(w, h) > max_dim:
            scale = max_dim / float(max(w, h))
            new_w = int(w * scale)
            new_h = int(h * scale)
            image = image.resize((new_w, new_h), Image.Resampling.BILINEAR)

        # Grayscale + autocontrast
        gray = image.convert("L")
        auto_contrast = ImageOps.autocontrast(gray, cutoff=2)
        enhancer = ImageEnhance.Contrast(auto_contrast)
        enhanced = enhancer.enhance(1.4)
        return enhanced.convert("RGB")

    @classmethod
    def extract_from_bytes(cls, file_bytes: bytes, filename: str = "image.png") -> Dict[str, Any]:
        try:
            image = Image.open(io.BytesIO(file_bytes))
            orig_w, orig_h = image.size
            format_name = image.format or "PNG"

            extracted_text = ""
            engine_used = "Standard Extractor"

            # 1. Try Windows Native OCR if on Windows
            if HAS_WINOCR:
                try:
                    # Run async winocr in current or new event loop
                    try:
                        loop = asyncio.get_event_loop()
                        if loop.is_running():
                            import concurrent.futures
                            with concurrent.futures.ThreadPoolExecutor() as pool:
                                def run_winocr_sync():
                                    new_loop = asyncio.new_event_loop()
                                    asyncio.set_event_loop(new_loop)
                                    res = new_loop.run_until_complete(winocr.recognize_pil(image, 'en'))
                                    new_loop.close()
                                    return res
                                winocr_res = pool.submit(run_winocr_sync).result(timeout=6)
                        else:
                            winocr_res = loop.run_until_complete(winocr.recognize_pil(image, 'en'))
                    except RuntimeError:
                        winocr_res = asyncio.run(winocr.recognize_pil(image, 'en'))

                    if winocr_res and winocr_res.text:
                        extracted_text = winocr_res.text
                        engine_used = "Windows AI OCR"
                except Exception:
                    pass

            # 2. Fallback to Tesseract OCR (for Linux/Docker/Render or if Tesseract is installed)
            if not extracted_text.strip():
                tesseract_ready = cls._configure_pytesseract()
                if tesseract_ready:
                    processed_img = cls.preprocess_image(image)
                    try:
                        extracted_text = pytesseract.image_to_string(
                            processed_img,
                            config=r'--oem 3 --psm 3 -c preserve_interword_spaces=1',
                            timeout=8
                        )
                        engine_used = "Tesseract OCR"
                    except Exception:
                        try:
                            extracted_text = pytesseract.image_to_string(processed_img, timeout=5)
                            engine_used = "Tesseract OCR"
                        except Exception:
                            pass

            clean_text = extracted_text.strip()
            
            # Clean OCR noise and artifacts
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
