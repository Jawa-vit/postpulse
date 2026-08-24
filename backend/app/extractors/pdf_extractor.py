import io
from typing import Dict, Any, List, Optional
import fitz  # PyMuPDF
from PIL import Image

class PDFExtractor:
    """
    Robust PDF extractor using PyMuPDF (fitz) with layout preservation,
    metadata extraction, and embedded image analysis.
    """
    
    @staticmethod
    def extract_from_bytes(file_bytes: bytes, filename: str = "document.pdf") -> Dict[str, Any]:
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            page_count = len(doc)
            full_text_list: List[str] = []
            extracted_images: List[Image.Image] = []
            pages_detail: List[Dict[str, Any]] = []

            for page_num in range(page_count):
                page = doc[page_num]
                
                # Extract text preserving blocks and structure
                text = page.get_text("text")
                clean_text = text.strip()
                if clean_text:
                    full_text_list.append(clean_text)
                
                # Extract any embedded images for potential OCR or inspection
                image_list = page.get_images(full=True)
                for img_info in image_list:
                    xref = img_info[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    try:
                        pil_img = Image.open(io.BytesIO(image_bytes))
                        extracted_images.append(pil_img)
                    except Exception:
                        pass

                pages_detail.append({
                    "page_number": page_num + 1,
                    "character_count": len(clean_text),
                    "word_count": len(clean_text.split()) if clean_text else 0,
                    "image_count": len(image_list)
                })

            combined_text = "\n\n".join(full_text_list).strip()
            
            # Determine if PDF is scanned (low text relative to pages with images)
            is_scanned_candidate = len(combined_text.split()) < 10 and len(extracted_images) > 0

            return {
                "success": True,
                "text": combined_text,
                "page_count": page_count,
                "word_count": len(combined_text.split()) if combined_text else 0,
                "character_count": len(combined_text),
                "is_scanned": is_scanned_candidate,
                "pages_detail": pages_detail,
                "embedded_image_count": len(extracted_images),
                "metadata": {
                    "title": doc.metadata.get("title", ""),
                    "author": doc.metadata.get("author", ""),
                    "producer": doc.metadata.get("producer", ""),
                }
            }
        except Exception as e:
            return {
                "success": False,
                "text": "",
                "error": f"Failed to parse PDF: {str(e)}",
                "page_count": 0,
                "word_count": 0,
                "character_count": 0,
                "is_scanned": False,
                "pages_detail": []
            }
