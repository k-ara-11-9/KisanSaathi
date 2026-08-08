import tensorflow as tf
import numpy as np
import json
from pathlib import Path
from PIL import Image, ImageOps
import io
from services.recommendation_service import build_plan
from services.history_service import save_history_entry
from services.llm_service import generate_simple_advice
from schemas.recommendation_schema import RecommendationRequest, DiseaseInput

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "plant_disease_recog_model_pwp.keras"
CLASS_NAMES_PATH = BASE_DIR / "models" / "class_names.json"

IMG_SIZE = 160   # confirmed from model.input_shape

# Load once at import time — NOT inside the predict function,
# otherwise you reload the model on every single request
model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_NAMES_PATH, "r") as f:
    CLASS_NAMES = json.load(f)


def format_class_name(raw_name: str) -> dict:
    """Splits 'Tomato___Late_blight' into crop + disease, cleans up formatting."""
    parts = raw_name.split("___")
    crop = parts[0].replace(",_", ", ").replace("_", " ")
    disease = parts[1].replace("_", " ") if len(parts) > 1 else "Unknown"
    is_healthy = disease.strip().lower() == "healthy"
    return {
        "crop": crop,
        "disease": "Healthy" if is_healthy else disease,
        "is_healthy": is_healthy,
    }


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    image = Image.open(io.BytesIO(image_bytes))
    image = ImageOps.exif_transpose(image).convert("RGB")
    image = image.resize((IMG_SIZE, IMG_SIZE))
    image_array = np.array(image, dtype=np.float32)
    image_array = tf.keras.applications.efficientnet.preprocess_input(image_array)
    return np.expand_dims(image_array, axis=0)  # add batch dimension

def sigmoid_to_softmax(sigmoid_probs: np.ndarray) -> np.ndarray:
        epsilon = 1e-7
        clipped = np.clip(sigmoid_probs, epsilon, 1 - epsilon)
        logits = np.log(clipped / (1 - clipped))
        exp_logits = np.exp(logits - np.max(logits))
        return exp_logits / exp_logits.sum()

CONFIDENCE_THRESHOLD = 0.50


def predict_disease(image_bytes: bytes) -> dict:
    processed = preprocess_image(image_bytes)
    
    raw_predictions = model.predict(processed, verbose=0)[0]
    predictions = sigmoid_to_softmax(raw_predictions)
    print("Sum of all probabilities:", predictions.sum())
    print("Top 5 raw values:", np.sort(predictions)[-5:][::-1])
    top_index = int(np.argmax(predictions))
    confidence = float(predictions[top_index])
    predicted_class = CLASS_NAMES[top_index]

    if predicted_class == "Background_without_leaves":
        return {
            "predicted_class": predicted_class,
            "crop": None,
            "disease": None,
            "is_healthy": None,
            "confidence": confidence,
            "is_uncertain": True,
            "message": "No leaf detected in the image. Please upload a clear photo of a plant leaf.",
        }

    formatted = format_class_name(predicted_class)

    top3_indices = np.argsort(predictions)[-3:][::-1]
    top3 = [
        {"label": CLASS_NAMES[i], "confidence": float(predictions[i])}
        for i in top3_indices
    ]

    is_uncertain = confidence < CONFIDENCE_THRESHOLD
    message = (
        "Low confidence diagnosis. Please provide a closer, well-lit photo of the plant leaf for better accuracy."
        if is_uncertain
        else None
    )

    return {
        "predicted_class": predicted_class,
        "crop": formatted["crop"],
        "disease": formatted["disease"],
        "is_healthy": formatted["is_healthy"],
        "confidence": confidence,
        "is_uncertain": is_uncertain,
        "message": message,
        "top3": top3,
    }
def analyze_and_save(image_bytes: bytes, language: str = "English") -> dict:
    result = predict_disease(image_bytes)

    if result["predicted_class"] == "Background_without_leaves":
        return result

    diseases_input = None
    if not result["is_healthy"] and result["disease"]:
        diseases_input = [DiseaseInput(name=result["predicted_class"], confidence=result["confidence"])]

    req = RecommendationRequest(
        crop=result["crop"] or "Unknown",
        growth_stage="vegetative",
        diseases=diseases_input
    )
    
    plan = build_plan(req)
    solution_brief = generate_simple_advice(plan, language=language)

    saved = save_history_entry(
        image_bytes=image_bytes,
        predicted_class=result["predicted_class"],
        crop=result["crop"],
        disease=result["disease"],
        confidence=result["confidence"],
        solution_brief=solution_brief,
    )

    return {
        **result, 
        "recommendation": plan.model_dump(), 
        "solution_brief": solution_brief, 
        "history_id": saved["id"]
    }
