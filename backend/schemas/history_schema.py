from pydantic import BaseModel
from typing import Optional

class HistoryEntry(BaseModel):
    id: str
    image_filename: str
    predicted_class: Optional[str]
    crop: Optional[str]
    disease: Optional[str]
    confidence: Optional[float]
    solution_brief: Optional[str]
    created_at: str