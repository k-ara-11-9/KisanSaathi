import requests
import time
from typing import List, Dict, Any
from dataclasses import dataclass
from datetime import datetime, timedelta

@dataclass
class DailyWeather:
    date: str
    temp_max: float
    temp_min: float
    humidity_mean: float
    rain_probability: float
    rain_sum: float

# In-memory cache: {(rounded_lat, rounded_lon): (expiry_timestamp, forecast_list)}
_forecast_cache: Dict[tuple, tuple] = {}
CACHE_TTL_SECONDS = 1800  # 30 minutes

def get_forecast(lat: float, lon: float, days: int = 6) -> List[DailyWeather]:
    """
    Fetches a 6-day weather forecast from Open-Meteo for the given latitude and longitude.
    Uses in-memory caching keyed by rounded coordinates (2 decimal places) for 30 minutes.
    """
    # Round to 2 decimal places to group nearby requests and improve cache hit rate
    cache_key = (round(lat, 2), round(lon, 2))
    now = time.time()
    
    # Check cache
    if cache_key in _forecast_cache:
        expiry, cached_data = _forecast_cache[cache_key]
        if now < expiry:
            # We return exactly the number of days requested, slicing the cached data if needed
            return cached_data[:days]
        else:
            del _forecast_cache[cache_key]
            
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": "temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean,precipitation_probability_mean,precipitation_sum",
        "forecast_days": max(days, 6), # always fetch at least 6 to cache properly if needed
        "timezone": "auto"
    }
    
    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json()
    
    daily_data = data.get("daily", {})
    dates = daily_data.get("time", [])
    temp_maxes = daily_data.get("temperature_2m_max", [])
    temp_mins = daily_data.get("temperature_2m_min", [])
    humidities = daily_data.get("relative_humidity_2m_mean", [])
    rain_probs = daily_data.get("precipitation_probability_mean", [])
    rain_sums = daily_data.get("precipitation_sum", [])
    
    forecasts = []
    # Open-Meteo sometimes returns None for missing data (e.g. at the end of the forecast window)
    for i in range(len(dates)):
        forecasts.append(
            DailyWeather(
                date=dates[i],
                temp_max=temp_maxes[i] if temp_maxes[i] is not None else 25.0,
                temp_min=temp_mins[i] if temp_mins[i] is not None else 15.0,
                humidity_mean=humidities[i] if humidities[i] is not None else 50.0,
                rain_probability=rain_probs[i] if rain_probs[i] is not None else 0.0,
                rain_sum=rain_sums[i] if rain_sums[i] is not None else 0.0,
            )
        )
        
    _forecast_cache[cache_key] = (now + CACHE_TTL_SECONDS, forecasts)
    
    return forecasts[:days]
