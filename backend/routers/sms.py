"""
SMS feature router - receives the MSG91 webhook and replies.
"""

from fastapi import APIRouter, Request
from backend.services.sms_provider import send_sms
from backend.services.i18n import get_reply_text

router = APIRouter()


@router.get("/health")
def sms_health():
    return {"status": "sms router ok"}


@router.post("/webhook")
async def inbound_sms_webhook(request: Request):
    payload = await request.json()
    sender = payload.get("from") or payload.get("sender")
    text = payload.get("text") or payload.get("message", "")

    reply_text = get_reply_text(sender, text)
    send_sms(to=sender, message=reply_text)

    return {"status": "received", "reply": reply_text}