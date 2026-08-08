from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from schemas.recommendation_schema import RecommendationResponse
from services.llm_service import generate_simple_advice, parse_farmer_input
from services.recommendation_service import build_plan

router = APIRouter(
    prefix="/chat",
    tags=["chatbot"]
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    disease_class: Optional[str] = None
    language: Optional[str] = "English"
    history: Optional[List[ChatMessage]] = []

@router.post("", response_model=RecommendationResponse)
def chat_with_farmer(request: ChatRequest):
    """
    Accepts a natural language message from the farmer (and optionally a disease class from an ML model).
    Parses the intent, builds the plan, and attaches simplified advice.
    """
    try:
        # 1. Parse natural language into structured RecommendationRequest, including chat history
        history_dicts = [msg.model_dump() for msg in request.history] if request.history else None
        
        rec_request = parse_farmer_input(
            text=request.message,
            disease_class=request.disease_class,
            history=history_dicts
        )

        # 2. Build the standard recommendation plan
        plan_response = build_plan(rec_request)

        # 3. Generate simple, localized advice for the farmer
        simple_advice = generate_simple_advice(
            response=plan_response,
            language=request.language or "English"
        )
        plan_response.simple_advice = simple_advice

        return plan_response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
