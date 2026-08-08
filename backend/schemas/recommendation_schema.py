from datetime import date
from typing import Any, List, Optional

from pydantic import BaseModel, ConfigDict, Field

class SoilReading(BaseModel):
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None
    moisture: Optional[float] = None

class FarmerRoutine(BaseModel):
    usual_water_liters_per_day: Optional[float] = None
    usual_fertilizer_frequency_days: Optional[int] = None
    last_fertilized_date: Optional[date] = None

class DiseaseInput(BaseModel):
    name: str
    confidence: float

class RecommendationRequest(BaseModel):
    crop: str
    growth_stage: str
    latitude: float = 12.97
    longitude: float = 77.59
    soil: Optional[SoilReading] = None
    farmer_routine: Optional[FarmerRoutine] = None
    diseases: Optional[List[DiseaseInput]] = None
    plan_days: int = 5

class DiseaseRule(BaseModel):
    nitrogen_multiplier: float = 1.0
    irrigation_override: Optional[str] = None
    water_multiplier: float = 1.0
    advice: str

# Response schemas

class SoilHealthField(BaseModel):
    current: float
    ideal: float
    status: str
    estimated: bool

class SoilHealth(BaseModel):
    nitrogen: SoilHealthField
    phosphorus: SoilHealthField
    potassium: SoilHealthField

class FertilizerScheduleEntry(BaseModel):
    day_offset: int
    date: str
    urea_g: float
    dap_g: float
    mop_g: float

class IrrigationPlanEntry(BaseModel):
    date: str
    action: str
    water_liters: float
    delta_from_usual_liters: float

class DiseaseChange(BaseModel):
    field: str
    from_value: Any = Field(..., alias="from")
    to: Any
    reason: str

    model_config = ConfigDict(populate_by_name=True)

class DiseaseAdjustment(BaseModel):
    applied: bool
    primary_disease: Optional[str] = None
    confidence: Optional[float] = None
    changes: Optional[List[DiseaseChange]] = None

class RecommendationResponse(BaseModel):
    soil_health: SoilHealth
    fertilizer_schedule: List[FertilizerScheduleEntry]
    irrigation_plan: List[IrrigationPlanEntry]
    disease_adjustment: Optional[DiseaseAdjustment] = None
    priority: str = "high"
    simple_advice: Optional[str] = None
