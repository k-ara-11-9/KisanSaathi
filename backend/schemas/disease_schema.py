from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class TopPrediction(BaseModel):
    label: str
    confidence: float


class DiseaseAnalysisResponse(BaseModel):
    predicted_class: str
    crop: Optional[str] = None
    disease: Optional[str] = None
    is_healthy: Optional[bool] = None
    confidence: float
    top3: Optional[List[TopPrediction]] = None
    is_uncertain: Optional[bool] = None
    message: Optional[str] = None                  # present for low confidence or "no leaf" cases
    recommendation: Optional[Dict[str, Any]] = None # from teammate's function (shape may still evolve)
    solution_brief: Optional[str] = None
    history_id: Optional[str] = None