import json
from datetime import date
from backend.schemas.recommendation_schema import RecommendationRequest, SoilReading, FarmerRoutine, DiseaseInput
from backend.services.recommendation_service import build_plan

request = RecommendationRequest(
    crop="tomato",
    growth_stage="vegetative",
    latitude=12.97,
    longitude=77.59,
    soil=SoilReading(nitrogen=30, phosphorus=20, potassium=40, moisture=45),
    farmer_routine=FarmerRoutine(usual_water_liters_per_day=5, usual_fertilizer_frequency_days=10, last_fertilized_date=date(2026, 8, 1)),
    diseases=[DiseaseInput(name="leaf_curl", confidence=0.9)],
    plan_days=5
)

try:
    response = build_plan(request)
    print(response.model_dump_json(indent=2))
except Exception as e:
    import traceback
    traceback.print_exc()
