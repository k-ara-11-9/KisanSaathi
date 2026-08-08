import json
from datetime import date, timedelta
import os
from typing import Dict, Any, List, Optional

try:
    from schemas.recommendation_schema import (
        RecommendationRequest, RecommendationResponse, SoilReading, FarmerRoutine,
        SoilHealth, SoilHealthField, FertilizerScheduleEntry, IrrigationPlanEntry,
        DiseaseAdjustment, DiseaseChange, DiseaseInput
    )
    from services.weather_service import get_forecast, DailyWeather
except ImportError:
    from backend.schemas.recommendation_schema import (
        RecommendationRequest, RecommendationResponse, SoilReading, FarmerRoutine,
        SoilHealth, SoilHealthField, FertilizerScheduleEntry, IrrigationPlanEntry,
        DiseaseAdjustment, DiseaseChange, DiseaseInput
    )
    from backend.services.weather_service import get_forecast, DailyWeather

# Load data at module level
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CROPS_FILE = os.path.join(BASE_DIR, "data", "crops.json")
DISEASE_RULES_FILE = os.path.join(BASE_DIR, "data", "fertilizer_rules.json")

with open(CROPS_FILE, 'r') as f:
    CROP_IDEALS = json.load(f)

with open(DISEASE_RULES_FILE, 'r') as f:
    DISEASE_RULES = json.load(f)





def _compute_soil_health(
    crop: str, 
    growth_stage: str, 
    soil: Optional[SoilReading]
) -> tuple[SoilHealth, Dict[str, float]]:
    """
    Evaluates soil health against crop ideals. 
    If soil readings are missing, assumes a 15% deficit and sets estimated=True.
    Returns the SoilHealth object for the response, and a dictionary of deficits for fertilizer calc.
    """
    ideal_data = CROP_IDEALS.get(crop.lower(), {}).get(growth_stage.lower(), {})
    # Fallbacks in case crop/stage is not in JSON
    ideal_n = ideal_data.get("nitrogen", 50.0)
    ideal_p = ideal_data.get("phosphorus", 30.0)
    ideal_k = ideal_data.get("potassium", 40.0)

    soil = soil or SoilReading()

    def evaluate_nutrient(current: Optional[float], ideal: float) -> tuple[SoilHealthField, float]:
        estimated = current is None
        if estimated:
            # Assumed 15% deficit if missing
            current_val = ideal * 0.85
        else:
            current_val = current

        ratio = current_val / ideal
        if ratio < 0.7:
            status = "low"
        elif ratio > 1.1:
            status = "high"
        else:
            status = "optimal"
            
        deficit = max(0, ideal - current_val)
        field = SoilHealthField(
            current=round(current_val, 2),
            ideal=ideal,
            status=status,
            estimated=estimated
        )
        return field, deficit

    n_field, n_def = evaluate_nutrient(soil.nitrogen, ideal_n)
    p_field, p_def = evaluate_nutrient(soil.phosphorus, ideal_p)
    k_field, k_def = evaluate_nutrient(soil.potassium, ideal_k)

    health = SoilHealth(nitrogen=n_field, phosphorus=p_field, potassium=k_field)
    deficits = {"N": n_def, "P": p_def, "K": k_def}
    return health, deficits


def _build_fertilizer_schedule(
    deficits: Dict[str, float],
    farmer_routine: Optional[FarmerRoutine],
    start_date: date
) -> List[FertilizerScheduleEntry]:
    """
    Builds a 3-day application window for fertilizers based on calculated deficits.
    Factors in farmer_routine.last_fertilized_date to delay or suppress the schedule.
    """
    total_urea_g = deficits["N"] * 0.5
    total_dap_g = deficits["P"] * 0.4
    total_mop_g = deficits["K"] * 0.3
    
    # Check if we should delay based on routine
    delay_days = 0
    if farmer_routine and farmer_routine.last_fertilized_date and farmer_routine.usual_fertilizer_frequency_days:
        days_since_last = (start_date - farmer_routine.last_fertilized_date).days
        if days_since_last < farmer_routine.usual_fertilizer_frequency_days:
            # Not due yet, delay until it is due
            delay_days = farmer_routine.usual_fertilizer_frequency_days - days_since_last

    schedule = []
    # If there are practically no deficits, we can return an empty schedule
    if total_urea_g < 1 and total_dap_g < 1 and total_mop_g < 1:
        return schedule
        
    splits = [0.5, 0.3, 0.2]
    day_offsets = [0, 2, 4]
    
    for i in range(3):
        offset = day_offsets[i] + delay_days
        apply_date = start_date + timedelta(days=offset)
        schedule.append(
            FertilizerScheduleEntry(
                day_offset=offset,
                date=apply_date.strftime("%Y-%m-%d"),
                urea_g=round(total_urea_g * splits[i], 2),
                dap_g=round(total_dap_g * splits[i], 2),
                mop_g=round(total_mop_g * splits[i], 2)
            )
        )
        
    return schedule


def _build_irrigation_plan(
    forecasts: List[DailyWeather],
    soil_moisture: Optional[float],
    farmer_routine: Optional[FarmerRoutine],
    crop: str,
    growth_stage: str
) -> List[IrrigationPlanEntry]:
    """
    Calculates day-by-day irrigation actions based on soil moisture and 6-day weather forecast.
    """
    plan = []
    ideal_moisture = CROP_IDEALS.get(crop.lower(), {}).get(growth_stage.lower(), {}).get("moisture", 60.0)
    current_moisture = soil_moisture if soil_moisture is not None else ideal_moisture * 0.85
    
    usual_water = 5.0
    if farmer_routine and farmer_routine.usual_water_liters_per_day is not None:
        usual_water = farmer_routine.usual_water_liters_per_day
        
    for day in forecasts:
        if current_moisture < (ideal_moisture * 0.5): # e.g. < 30 if ideal is 60
            action = "delay" if day.rain_probability > 60 else "irrigate"
        else:
            action = "not_needed"
            
        base_water = usual_water
        if day.temp_max > 30: 
            base_water += 2
        if day.humidity_mean < 40: 
            base_water += 1
        if day.rain_sum > 10: 
            base_water -= 3
            
        water_liters = max(base_water, 0.0) if action != "not_needed" else 0.0
        delta = water_liters - usual_water
        
        plan.append(
            IrrigationPlanEntry(
                date=day.date,
                action=action,
                water_liters=round(water_liters, 2),
                delta_from_usual_liters=round(delta, 2)
            )
        )
        # Simulate moisture increasing if we irrigate/rain, decreasing slightly over time
        if action == "irrigate":
            current_moisture = min(100.0, current_moisture + 20.0)
        if day.rain_sum > 5:
            current_moisture = min(100.0, current_moisture + 15.0)
        current_moisture -= 5.0 # daily drain
        
    return plan


def _apply_disease_overrides(
    diseases: List[DiseaseInput],
    fertilizer_schedule: List[FertilizerScheduleEntry],
    irrigation_plan: List[IrrigationPlanEntry]
) -> tuple[Optional[DiseaseAdjustment], List[FertilizerScheduleEntry], List[IrrigationPlanEntry]]:
    """
    Takes the highest confidence disease and applies rules from disease_rules.json to the baseline plan.
    Returns the DiseaseAdjustment (containing changes array) and the modified plans.
    """
    if not diseases:
        return None, fertilizer_schedule, irrigation_plan
        
    # Get highest confidence disease
    primary_disease = max(diseases, key=lambda d: d.confidence)
    rule_data = DISEASE_RULES.get(primary_disease.name.lower())
    
    if not rule_data:
        # We don't have rules for this disease, return unmodified
        return DiseaseAdjustment(
            applied=False, 
            primary_disease=primary_disease.name, 
            confidence=primary_disease.confidence, 
            changes=[]
        ), fertilizer_schedule, irrigation_plan
        
    n_mult = rule_data.get("nitrogen_multiplier", 1.0)
    w_mult = rule_data.get("water_multiplier", 1.0)
    i_override = rule_data.get("irrigation_override")
    advice = rule_data.get("advice", "")
    
    changes = []
    
    # 1. Adjust Nitrogen
    if n_mult != 1.0 and fertilizer_schedule:
        # Just grab the first day's original value to log the change, but apply to all
        orig_urea = fertilizer_schedule[0].urea_g
        new_urea = round(orig_urea * n_mult, 2)
        changes.append(
            DiseaseChange(
                field="fertilizer.urea_g",
                from_value=orig_urea,
                to=new_urea,
                reason=advice
            )
        )
        for entry in fertilizer_schedule:
            entry.urea_g = round(entry.urea_g * n_mult, 2)
            
    # 2. Adjust Irrigation Action
    if i_override and irrigation_plan:
        orig_action = irrigation_plan[0].action
        if orig_action != i_override:
            changes.append(
                DiseaseChange(
                    field="irrigation.action",
                    from_value=orig_action,
                    to=i_override,
                    reason=advice
                )
            )
        for entry in irrigation_plan:
            # We override all "irrigate" actions, but let "delay" or "not_needed" stand if it was already safer
            if entry.action == "irrigate":
                entry.action = i_override
            
    # 3. Adjust Watering Amount
    if w_mult != 1.0 and irrigation_plan:
        orig_water = irrigation_plan[0].water_liters
        new_water = round(orig_water * w_mult, 2)
        changes.append(
            DiseaseChange(
                field="irrigation.water_liters",
                from_value=orig_water,
                to=new_water,
                reason=advice
            )
        )
        for entry in irrigation_plan:
            usual_water = entry.water_liters - entry.delta_from_usual_liters # reverse engineer usual
            entry.water_liters = round(entry.water_liters * w_mult, 2)
            # update delta
            entry.delta_from_usual_liters = round(entry.water_liters - usual_water, 2)
            
    adjustment = DiseaseAdjustment(
        applied=True,
        primary_disease=primary_disease.name,
        confidence=primary_disease.confidence,
        changes=changes
    )
    
    return adjustment, fertilizer_schedule, irrigation_plan


def build_plan(request: RecommendationRequest) -> RecommendationResponse:
    """
    Main entry point for building a recommendation plan.
    1. Fetches weather
    2. Computes soil health and deficits
    3. Builds baseline fertilizer and irrigation plans
    4. Applies disease overrides if necessary
    """
    forecasts = get_forecast(request.latitude, request.longitude, days=request.plan_days)
    
    soil_health, deficits = _compute_soil_health(request.crop, request.growth_stage, request.soil)
    
    today = date.today()
    fertilizer_schedule = _build_fertilizer_schedule(deficits, request.farmer_routine, today)
    
    moisture = request.soil.moisture if request.soil else None
    irrigation_plan = _build_irrigation_plan(
        forecasts, moisture, request.farmer_routine, request.crop, request.growth_stage
    )
    
    disease_adjustment, fertilizer_schedule, irrigation_plan = _apply_disease_overrides(
        request.diseases or [], fertilizer_schedule, irrigation_plan
    )
    
    return RecommendationResponse(
        soil_health=soil_health,
        fertilizer_schedule=fertilizer_schedule,
        irrigation_plan=irrigation_plan,
        disease_adjustment=disease_adjustment,
        priority="high" if disease_adjustment and disease_adjustment.applied else "normal"
    )
