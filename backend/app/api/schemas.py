from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class ExtractResponse(BaseModel):
    success: bool
    text: str
    file_type: str
    file_name: str
    word_count: int
    character_count: int
    details: Dict[str, Any]
    error: Optional[str] = None

class AnalyzeRequest(BaseModel):
    text: str

class RewriteRequest(BaseModel):
    text: str
    strategy: Optional[str] = "viral"

class TransformRequest(BaseModel):
    text: str
    platform: Optional[str] = "linkedin"

class SamplePost(BaseModel):
    id: str
    title: str
    category: str
    text: str
    description: str
