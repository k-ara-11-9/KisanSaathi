from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import sms

# TODO: uncomment as each teammate's router is ready
# from backend.routers import disease, mandi, chatbot, recommendations, history

app = FastAPI(title="KisanSaathi API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "service": "kisansaathi-backend"}


app.include_router(sms.router, prefix="/sms", tags=["sms"])

# TODO: add these once uncommented above
# app.include_router(disease.router, prefix="/disease", tags=["disease"])
# app.include_router(mandi.router, prefix="/mandi", tags=["mandi"])
# app.include_router(chatbot.router, prefix="/chatbot", tags=["chatbot"])
# app.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
# app.include_router(history.router, prefix="/history", tags=["history"])