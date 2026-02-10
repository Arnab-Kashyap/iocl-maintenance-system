from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models.pump import Pump
from app.schemas.pump import PumpCreate
from app.schemas.maintenance import MaintenanceCreate

# create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="IOCL Maintenance System")

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- DUMMY MAINTENANCE DATA --------------------
maintenance_data = []

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

# -------------------- PUMPS (DATABASE) --------------------
@app.post("/pumps", tags=["Pumps"])
def add_pump(pump: PumpCreate, db: Session = Depends(get_db)):
    new_pump = Pump(
        name=pump.name,
        status=pump.status
    )
    db.add(new_pump)
    db.commit()
    db.refresh(new_pump)

    return {
        "success": True,
        "message": "Pump added successfully",
        "pump": new_pump
    }


@app.get("/pumps", tags=["Pumps"])
def get_pumps(db: Session = Depends(get_db)):
    return db.query(Pump).all()


@app.get("/pumps/{pump_id}", tags=["Pumps"])
def get_pump_by_id(pump_id: int, db: Session = Depends(get_db)):
    pump = db.query(Pump).filter(Pump.id == pump_id).first()
    if not pump:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pump not found"
        )
    return pump

# -------------------- MAINTENANCE (DUMMY) --------------------
@app.post("/maintenance", tags=["Maintenance"])
def schedule_maintenance(maintenance: MaintenanceCreate, db: Session = Depends(get_db)):
    pump = db.query(Pump).filter(Pump.id == maintenance.pump_id).first()

    if not pump:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pump not found"
        )

    record = {
        "id": len(maintenance_data) + 1,
        "pump_id": maintenance.pump_id,
        "description": maintenance.description,
        "status": maintenance.status
    }

    maintenance_data.append(record)

    # update pump status
    pump.status = "Under Maintenance"
    db.commit()

    return {
        "success": True,
        "message": "Maintenance scheduled",
        "maintenance": record
    }


@app.put("/maintenance/{maintenance_id}", tags=["Maintenance"])
def update_maintenance_status(maintenance_id: int, new_status: str, db: Session = Depends(get_db)):
    for m in maintenance_data:
        if m["id"] == maintenance_id:
            m["status"] = new_status

            pump = db.query(Pump).filter(Pump.id == m["pump_id"]).first()
            if pump:
                pump.status = "Active" if new_status == "Completed" else "Under Maintenance"
                db.commit()

            return {
                "success": True,
                "message": "Maintenance updated",
                "maintenance": m
            }

    raise HTTPException(
        status_code=404,
        detail="Maintenance record not found"
    )


@app.get("/maintenance/pump/{pump_id}", tags=["Maintenance"])
def get_maintenance_by_pump(pump_id: int):
    return [m for m in maintenance_data if m["pump_id"] == pump_id]

# -------------------- REPORTS --------------------
@app.get("/reports/summary", tags=["Reports"])
def get_report_summary(db: Session = Depends(get_db)):
    pumps = db.query(Pump).all()

    return {
        "total_pumps": len(pumps),
        "active_pumps": len([p for p in pumps if p.status == "Active"]),
        "pumps_under_maintenance": len([p for p in pumps if p.status != "Active"]),
        "total_maintenance_records": len(maintenance_data)
    }
