"""
KisanSaathi backend - main entrypoint.

This file creates the single shared FastAPI app and mounts every
feature area as its own router. Each teammate owns one router file
under app/routers/ and should NOT need to touch this file except to
add one `app.include_router(...)` line for their own piece.

Run locally with:
    uvicorn app.main:app --reload
"""

from fastapi import FastAPI

from app.routers import sms

# from app.routers import predict  # TODO (ML teammate): uncomment once predict.py exists

app = FastAPI(
    title="KisanSaathi API",
    description="Backend services for KisanSaathi - SMS assistant + crop/ML tools for farmers",
    version="0.1.0",
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Basic health check - hit this to confirm the server is up."""
    return {"status": "ok", "service": "kisansaathi-backend"}


# --- Mount feature routers below ---------------------------------
# Each router is a self-contained set of endpoints for one feature area.
# Prefix + tags keep the auto-generated docs (at /docs) organized.

app.include_router(sms.router, prefix="/sms", tags=["sms"])

# TODO (ML teammate): once app/routers/predict.py exists, add:
# app.include_router(predict.router, prefix="/predict", tags=["ml"])

# TODO (teammate 3): add your router here the same way.
# TODO (teammate 4): add your router here the same way.
