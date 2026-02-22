from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.models import *

from app.models.pump import Pump
from app.models.maintenance import Maintenance

from app.routes import pump as pump_routes
from app.routes import maintenance as maintenance_routes
from app.routes import auth as auth_routes
from app.routes import prediction

app = FastAPI(title="IOCL Maintenance System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/health")
def health_check():
    return {
        "success": True,
        "status": "ok",
        "service": "IOCL Maintenance Backend"
    }

@app.get("/")
def root():
    return {
        "success": True,
        "message": "Backend is running 🚀"
    }

app.include_router(auth_routes.router)
app.include_router(pump_routes.router)
app.include_router(maintenance_routes.router)
app.include_router(prediction.router)