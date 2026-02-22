from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.models import *

from app.models.pump import Pump
from app.models.maintenance import Maintenance

# ✅ Import route files correctly
from app.routes import pump as pump_routes
from app.routes import maintenance as maintenance_routes
from app.routes import auth as auth_routes   # ✅ FIXED
from app.routes import prediction
app.include_router(prediction.router)

# ✅ Create FastAPI app FIRST
app = FastAPI(title="IOCL Maintenance System")

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- CREATE DB TABLES --------------------
Base.metadata.create_all(bind=engine)

# -------------------- HEALTH --------------------
@app.get("/health")
def health_check():
    return {
        "success": True,
        "status": "ok",
        "service": "IOCL Maintenance Backend"
    }

# -------------------- ROOT --------------------
@app.get("/")
def root():
    return {
        "success": True,
        "message": "Backend is running 🚀"
    }

# -------------------- INCLUDE ROUTERS --------------------
app.include_router(auth_routes.router)        # ✅ FIXED
app.include_router(pump_routes.router)
app.include_router(maintenance_routes.router)
