import os
import shutil
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "PostPulse — Social Media Content Digital Twin"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Auto-detect Tesseract binary path on Windows / Linux / macOS
    TESSERACT_CMD: str = os.getenv("TESSERACT_CMD", "")
    
    def get_tesseract_path(self) -> str:
        if self.TESSERACT_CMD and os.path.exists(self.TESSERACT_CMD):
            return self.TESSERACT_CMD
            
        which_tess = shutil.which("tesseract")
        if which_tess:
            return which_tess
            
        # Common Windows installation locations
        windows_paths = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
            os.path.expanduser(r"~\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"),
            os.path.expanduser(r"~\scoop\apps\tesseract\current\tesseract.exe"),
            r"C:\tools\tesseract\tesseract.exe",
        ]
        for p in windows_paths:
            if os.path.exists(p):
                return p
        return ""

settings = Settings()
