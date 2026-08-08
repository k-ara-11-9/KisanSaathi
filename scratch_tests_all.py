import json
from datetime import date, timedelta
from backend.schemas.recommendation_schema import RecommendationRequest, SoilReading, FarmerRoutine, DiseaseInput
from backend.services.recommendation_service import build_plan

def run_test(name, request):
    print(f"\n--- {name} ---")
    try:
        response = build_plan(request)
        print(response.model_dump_json(indent=2))
    except Exception as e:
        import traceback
        traceback.print_exc()

today = date.today()

# Test 1: Normal tomato, ideal soil, no disease
req1 = RecommendationRequest(
    crop="tomato",
    growth_stage="vegetative",
    latitude=12.97,
    longitude=77.59,
    soil=SoilReading(nitrogen=80, phosphorus=40, potassium=60, moisture=65),
    farmer_routine=FarmerRoutine(usual_water_liters_per_day=5, usual_fertilizer_frequency_days=10, last_fertilized_date=today - timedelta(days=15)),
    diseases=[],
    plan_days=3
)
run_test("Test 1: Normal Tomato (Ideal Soil, No Disease)", req1)

# Test 2: Tomato with Late Blight
req2 = RecommendationRequest(
    crop="tomato",
    growth_stage="flowering",
    latitude=12.97,
    longitude=77.59,
    soil=SoilReading(nitrogen=60, phosphorus=50, potassium=80, moisture=60),
    farmer_routine=FarmerRoutine(usual_water_liters_per_day=6, usual_fertilizer_frequency_days=7, last_fertilized_date=today - timedelta(days=8)),
    diseases=[DiseaseInput(name="late_blight", confidence=0.85)],
    plan_days=3
)
run_test("Test 2: Tomato with Late Blight", req2)

# Test 3: Rice with very poor soil and no recent fertilizer
req3 = RecommendationRequest(
    crop="rice",
    growth_stage="tillering",
    latitude=28.70,
    longitude=77.10,
    soil=SoilReading(nitrogen=30, phosphorus=10, potassium=10, moisture=30),
    farmer_routine=FarmerRoutine(usual_water_liters_per_day=10, usual_fertilizer_frequency_days=20, last_fertilized_date=today - timedelta(days=30)),
    diseases=[],
    plan_days=3
)
run_test("Test 3: Rice with Poor Soil", req3)

# Test 4: Missing data
req4 = RecommendationRequest(
    crop="tomato",
    growth_stage="fruiting",
    latitude=12.97,
    longitude=77.59,
    soil=None,
    farmer_routine=None,
    diseases=[],
    plan_days=3
)
run_test("Test 4: Missing Soil & Routine Data", req4)
