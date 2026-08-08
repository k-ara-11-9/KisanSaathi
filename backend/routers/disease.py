from fastapi import APIRouter, UploadFile, File, HTTPException
from services.disease_service import analyze_and_save
from schemas.disease_schema import DiseaseAnalysisResponse

router = APIRouter(prefix="/disease", tags=["Disease Detection"])


@router.post("/predict", response_model=DiseaseAnalysisResponse)
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()

    try:
        result = analyze_and_save(image_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

    return result