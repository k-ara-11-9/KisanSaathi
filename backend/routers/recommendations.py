from fastapi import APIRouter, HTTPException
from schemas.recommendation_schema import RecommendationRequest, RecommendationResponse
from services.recommendation_service import build_plan

router = APIRouter(
    prefix="/recommendation",
    tags=["recommendations"]
)

@router.post("", response_model=RecommendationResponse)
def get_recommendation(request: RecommendationRequest):
    """
    Generates a deterministic irrigation and fertilizer recommendation plan.
    Takes farm conditions and an optional list of detected diseases.
    """
    try:
        response = build_plan(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
