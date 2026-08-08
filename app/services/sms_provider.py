"""
MSG91 SMS provider wrapper.

Kept separate from the router so the provider can be swapped later
(e.g. Twilio for international users) without touching business logic
elsewhere in the app.

For hackathon/demo purposes, set MOCK_SMS=true in your .env to skip
the real network call and just log/print the reply instead - keeps
the demo reliable without needing live MSG91 credentials.
"""

import os
import requests
from app.config import MSG91_AUTH_KEY, MSG91_SENDER_ID

MSG91_SEND_URL = "https://api.msg91.com/api/v5/flow/"  # confirm exact endpoint for your product (long code / flow API differ)
MOCK_SMS = os.getenv("MOCK_SMS", "true").lower() == "true"


def send_sms(to: str, message: str) -> dict:
    """
    Send an SMS reply via MSG91 (or log it, if MOCK_SMS is on).

    NOTE: payload shape below is a starting guess based on MSG91's
    general send API - confirm the exact fields for the two-way long
    code product against their dashboard/docs once provisioned.
    """
    if MOCK_SMS:
        print(f"[MOCK SMS] To: {to} | Message: {message}")
        return {"status": "mocked", "to": to, "message": message}