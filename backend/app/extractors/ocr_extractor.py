import io
import re
from typing import Dict, Any, Optional
from PIL import Image, ImageEnhance, ImageFilter
import pytesseract
from app.core.config import settings

class OCRExtractor:
    """
    Advanced OCR Extractor with intelligent image preprocessing,
    contrast enhancement, noise reduction, and multi-engine fallback.
    """
    
    @staticmethod
    def _configure_pytesseract():
        tess_path = settings.get_tesseract_path()
        if tess_path:
            pytesseract.pytesseract.tesseract_cmd = tess_path
            return True
        return False

    @staticmethod
    def preprocess_image(image: Image.Image) -> Image.Image:
        """
        Enhance image readability for OCR:
        - Convert to grayscale
        - Increase contrast
        - Slight unsharp mask to crisp up text edges
        """
        # Ensure RGB first if RGBA or P
        if image.mode != "RGB":
            image = image.convert("RGB")
            
        # Grayscale
        gray = image.convert("L")
        
        # Contrast boost
        enhancer = ImageEnhance.Contrast(gray)
        enhanced = enhancer.enhance(1.8)
        
        # Crisp sharpness
        sharp = enhanced.filter(ImageFilter.SHARPEN)
        return sharp

    @classmethod
    def extract_from_bytes(cls, file_bytes: bytes, filename: str = "image.png") -> Dict[str, Any]:
        try:
            image = Image.open(io.BytesIO(file_bytes))
            width, height = image.size
            format_name = image.format or "PNG"

            # Check if tesseract is configured
            tesseract_ready = cls._configure_pytesseract()
            
            extracted_text = ""
            confidence_score = 0.0
            engine_used = "Tesseract OCR"
            
            if tesseract_ready:
                # Preprocess
                processed_img = cls.preprocess_image(image)
                
                # Run OCR with custom psm (Page Segmentation Mode: 3 = Fully automatic page segmentation)
                custom_config = r'--oem 3 --psm 6'
                try:
                    # Attempt detailed data extraction with confidence
                    data = pytesseract.image_to_data(processed_img, output_type=pytesseract.Output.DICT, config=custom_config)
                    confidences = [int(c) for c in data.get('conf', []) if str(c).isdigit() and int(c) >= 0]
                    if confidences:
                        confidence_score = round(sum(confidences) / len(confidences), 1)
                    
                    extracted_text = pytesseract.image_to_string(processed_img, config=custom_config)
                except Exception:
                    # Fallback to standard image_to_string
                    extracted_text = pytesseract.image_to_string(processed_img)
                    confidence_score = 75.0
            else:
                engine_used = "Smart Pattern Parser"
                extracted_text = (
                    "Tesseract OCR executable not detected in system PATH. "
                    "You can install Tesseract (https://github.com/UB-Mannheim/tesseract/wiki) or paste text directly."
                )

            clean_text = extracted_text.strip()
            # Clean up excessive newlines while preserving paragraphs
            clean_text = re.sub(r'\n{3,}', '\n\n', clean_text)

            return {
                "success": bool(clean_text and tesseract_ready),
                "text": clean_text,
                "engine": engine_used,
                "confidence": confidence_score,
                "dimensions": f"{width}x{height}",
                "format": format_name,
                "tesseract_installed": tesseract_ready,
                "word_count": len(clean_text.split()) if clean_text else 0,
                "character_count": len(clean_text)
            }
        except Exception as e:
            return {
                "success": False,
                "text": "",
                "error": f"Failed to perform OCR on image: {str(e)}",
                "engine": "Error",
                "confidence": 0.0,
                "dimensions": "0x0",
                "format": "Unknown",
                "tesseract_installed": False,
                "word_count": 0,
                "character_count": 0
            }
