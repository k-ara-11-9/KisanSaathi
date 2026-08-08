def get_recommendation(predicted_class: str, is_healthy: bool) -> dict:
    """
    TEMPORARY MOCK — replace with teammate's real implementation.
    Same function signature so nothing else needs to change later.
    """
    if is_healthy:
        return {
            "status": "healthy",
            "message": "No disease detected. Continue regular care.",
            "treatment": None,
        }

    return {
        "status": "disease_detected",
        "severity": "medium",
        "treatment": f"Apply appropriate fungicide/treatment for {predicted_class.replace('___', ' - ').replace('_', ' ')}. (Placeholder — real guidance pending.)",
        "prevention": "Ensure proper spacing and avoid overhead watering. (Placeholder.)",
    }