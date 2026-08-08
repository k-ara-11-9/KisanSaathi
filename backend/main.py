
from starlette.responses import JSONResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from services.history_service import init_db

from routers import disease, history
init_db()
app = FastAPI(
    title="KisanSaathi API",
    description="Backend API for KisanSaathi Crop & Disease Management",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(disease.router)
app.include_router(history.router)


@app.get("/")
def read_root():
    return {"status": "online", "message": "Welcome to KisanSaathi Backend API"}


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    # Return only the first error (cleaner for UI)
    first_error = exc.errors()[0]
    field = first_error['loc'][-1]
    msg = first_error['msg']
    return JSONResponse(
        status_code=422,
        content={"detail": f"{field}: {msg}"}
    )
