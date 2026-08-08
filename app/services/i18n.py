"""
Builds the reply text for an incoming SMS, driving a short menu-based
conversation (HI -> pick an option -> answer that option).
"""

from app.services import session as session_service
from app.services.weather_service import get_forecast

MENU_TEXT = (
    "Welcome to KisanSaathi!\n"
    "Reply with a number:\n"
    "1 - Crop Price\n"
    "2 - Weather\n"
    "3 - Disease Advice\n"
    "(Reply HI anytime to restart)"
)

AWAITING_MENU_CHOICE = "awaiting_menu_choice"
AWAITING_WEATHER_COORDS = "awaiting_weather_coords"
AWAITING_PRICE_CROP = "awaiting_price_crop"
AWAITING_DISEASE_CROP = "awaiting_disease_crop"

# Placeholder until disease_service.py exists in the shared repo
DISEASE_ADVICE = {
    "WHEAT": "Common wheat issue: rust (orange spots on leaves). Advice: use resistant seed varieties, apply fungicide early, avoid excess nitrogen.",
    "RICE": "Common rice issue: blast disease (grey spots on leaves). Advice: use certified seeds, avoid dense planting, apply fungicide if spotted early.",
    "TOMATO": "Common tomato issue: early blight (brown rings on leaves). Advice: remove infected leaves, avoid overhead watering, rotate crops yearly.",
    "COTTON": "Common cotton issue: bollworm. Advice: monitor plants weekly, use pheromone traps, apply pesticide only if infestation confirmed.",
    "POTATO": "Common potato issue: late blight (dark patches on leaves). Advice: ensure good drainage, avoid wet foliage, apply fungicide preventively.",
}


def get_reply_text(phone: str, raw_text: str) -> str:
    text = (raw_text or "").strip()
    upper = text.upper()
    state = session_service.get_state(phone)

    if upper in ("HI", "HELLO", "START"):
        session_service.set_state(phone, AWAITING_MENU_CHOICE)
        return MENU_TEXT

    if state == AWAITING_MENU_CHOICE:
        if text == "1":
            session_service.set_state(phone, AWAITING_PRICE_CROP)
            return "Which crop? (e.g. WHEAT, RICE, COTTON)"
        elif text == "2":
            session_service.set_state(phone, AWAITING_WEATHER_COORDS)
            return "Send your location as lat,lon (e.g. 28.61,77.23). (Demo only - real version will use your pincode.)"
        elif text == "3":
            session_service.set_state(phone, AWAITING_DISEASE_CROP)
            return "Which crop? (e.g. WHEAT, RICE, TOMATO)"
        else:
            return "Please reply with 1, 2, or 3. Reply HI to see the menu again."

    if state == AWAITING_PRICE_CROP:
        session_service.set_state(phone, None)
        return f"Price info for {upper} is not yet available. Please check back soon. Reply HI for menu."

    if state == AWAITING_WEATHER_COORDS:
        session_service.set_state(phone, None)
        try:
            lat_str, lon_str = text.split(",")
            lat, lon = float(lat_str.strip()), float(lon_str.strip())
            forecast = get_forecast(lat, lon, days=1)
            if forecast:
                f = forecast[0]
                return (
                    f"Weather for {f.date}: High {f.temp_max}C, Low {f.temp_min}C, "
                    f"Rain chance {f.rain_probability}%. Reply HI for menu."
                )
            return "Could not fetch weather right now. Reply HI for menu."
        except Exception:
            return "Please send location as lat,lon (e.g. 28.61,77.23). Reply HI to restart."

    if state == AWAITING_DISEASE_CROP:
        session_service.set_state(phone, None)
        info = DISEASE_ADVICE.get(upper)
        if info:
            return info + " Reply HI for menu."
        return f"No info for {upper} yet. Reply HI for menu."

    return "Sorry, we didn't understand that. Reply HI to see menu options."