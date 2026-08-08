import json
import os
from typing import Dict, List, Optional

from groq import Groq

from backend.schemas.recommendation_schema import RecommendationRequest, RecommendationResponse

# Initialize Groq client
# The API key is passed directly or loaded from environment variables
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
client = Groq(api_key=GROQ_API_KEY)


def parse_farmer_input(
    text: str,
    disease_class: Optional[str] = None,
    history: Optional[List[Dict[str, str]]] = None
) -> RecommendationRequest:
    """
    Uses Groq LLM to parse a simple/broken prompt from a farmer into a structured RecommendationRequest.
    """
    system_prompt = """
    You are an agricultural assistant. Your job is to extract farming information from a user's text and output a STRICT JSON object matching this schema:
    {
      "crop": "string (default: 'tomato' if unknown)",
      "growth_stage": "string (seedling, vegetative, flowering, or fruiting. default: 'vegetative')",
      "latitude": float (default 12.97, DO NOT USE NULL),
      "longitude": float (default 77.59, DO NOT USE NULL),
      "soil": {
        "nitrogen": float or null,
        "phosphorus": float or null,
        "potassium": float or null,
        "moisture": float or null
      } or null,
      "farmer_routine": {
        "usual_water_liters_per_day": float or null,
        "usual_fertilizer_frequency_days": int or null,
        "last_fertilized_date": "YYYY-MM-DD" or null
      } or null,
      "diseases": [
        {
          "name": "string",
          "confidence": float
        }
      ] or null,
      "plan_days": 5
    }

    Rules:
    - If a field is not mentioned, use the default or null.
    - ONLY output the JSON object, nothing else. No markdown wrapping.
    - If conversation history is provided, use the most recent information provided by the user.
    """

    messages = [{"role": "system", "content": system_prompt}]

    if history:
        for msg in history:
            messages.append({"role": msg["role"], "content": msg["content"]})

    # If the ML model already detected a disease class, we pass it as extra context
    user_prompt = f"Farmer Input: '{text}'"
    if disease_class:
        user_prompt += f"\nNote: An image model detected the class '{disease_class}'. Add this to the 'diseases' array with 0.9 confidence."

    messages.append({"role": "user", "content": user_prompt})

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages,
        temperature=0.0,
        response_format={"type": "json_object"}
    )

    raw_json = response.choices[0].message.content
    data = json.loads(raw_json)

    # Validate and return as Pydantic model
    return RecommendationRequest(**data)


def generate_simple_advice(
    response: RecommendationResponse,
    language: str = "English"
) -> str:
    """
    Uses Groq LLM to summarize the complex RecommendationResponse into a simple 1-2 sentence advice.
    """
    system_prompt = f"""
    You are an expert but simple-speaking agricultural advisor.
    You will receive a complex JSON plan for fertilizer and irrigation.
    Translate the MOST IMPORTANT actions into a very simple, easy-to-understand 1-2 sentence advice.
    Speak directly to the farmer. Do not use technical terms or percentages.
    Example: "You don't need to water today, but tomorrow give your plants 2 mugs of water. Apply a small handful of Urea on Monday."
    
    CRITICAL RULE: You MUST output the final advice in the following language: {language}.
    """

    user_prompt = f"Plan JSON: {response.model_dump_json()}"

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.3
    )

    return completion.choices[0].message.content.strip()
