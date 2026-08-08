from fastapi import FastAPI
from backend.routers import recommendations, chatbot
# If other routers like disease or mandi are to be included, they can be added here as well.

app = FastAPI(title="KisanSaathi API")

app.include_router(recommendations.router)
app.include_router(chatbot.router)

@app.get("/")
def read_root():
    """Returns a welcome message."""
    return {"message": "Welcome to KisanSaathi API"}
