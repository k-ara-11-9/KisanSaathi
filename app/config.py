"""
Shared configuration, loaded once from environment variables / .env.

Anyone on the team needing a new env var should add it here rather
than calling os.getenv() scattered across files - keeps one place
to see everything the app needs to run.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# --- SMS / MSG91 ----------------------------------------------------
MSG91_AUTH_KEY = os.getenv("MSG91_AUTH_KEY", "")
MSG91_SENDER_ID = os.getenv("MSG91_SENDER_ID", "")
MSG91_LONG_CODE_NUMBER = os.getenv("MSG91_LONG_CODE_NUMBER", "")

# --- ML / model paths (teammate: fill in as needed) ------------------
# MODEL_PATH = os.getenv("MODEL_PATH", "app/models/crop_disease_model.h5")

# --- General ----------------------------------------------------------
ENV = os.getenv("ENV", "development")
