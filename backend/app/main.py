from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import Base, engine, get_db
from app.models.pump import Pump
from app.models.maintenance import Maintenance
from app.schemas.pump import PumpCreate
from app.schemas.maintenance import MaintenanceCreate, MaintenanceUpdate


# Create DB tables
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

# =====================================================
#                    PUMPS
# =====================================================

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


@app.delete("/pumps/{pump_id}", tags=["Pumps"])
def delete_pump(pump_id: int, db: Session = Depends(get_db)):
    pump = db.query(Pump).filter(Pump.id == pump_id).first()

    if not pump:
        raise HTTPException(status_code=404, detail="Pump not found")

    db.delete(pump)
    db.commit()

    return {
        "success": True,
        "message": "Pump deleted successfully"
    }


# =====================================================
#                    MAINTENANCE
# =====================================================

@app.post("/maintenance", tags=["Maintenance"])
def schedule_maintenance(
    maintenance: MaintenanceCreate,
    db: Session = Depends(get_db)
):
    pump = db.query(Pump).filter(Pump.id == maintenance.pump_id).first()

    if not pump:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pump not found"
        )

    new_record = Maintenance(
        pump_id=maintenance.pump_id,
        description=maintenance.description,
        status=maintenance.status
    )

    db.add(new_record)

    # Update pump status
    pump.status = "Under Maintenance"
    pump.last_maintenance_date = datetime.utcnow()

    db.commit()
    db.refresh(new_record)

    return {
        "success": True,
        "message": "Maintenance scheduled",
        "maintenance": new_record
    }


@app.put("/maintenance/{maintenance_id}", tags=["Maintenance"])
def update_maintenance_status(
    maintenance_id: int,
    data: MaintenanceUpdate,
    db: Session = Depends(get_db)
):

    record = db.query(Maintenance).filter(
        Maintenance.id == maintenance_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Maintenance record not found"
        )

    record.status = data.status

    pump = db.query(Pump).filter(
        Pump.id == record.pump_id
    ).first()

    if pump:
        pump.status = (
            "Active" if data.status == "Completed"
            else "Under Maintenance"
        )

        if data.status == "Completed":
            pump.last_maintenance_date = datetime.utcnow()

    db.commit()

    return {
        "success": True,
        "message": "Maintenance updated",
        "maintenance": record
    }


@app.get("/maintenance/pump/{pump_id}", tags=["Maintenance"])
def get_maintenance_by_pump(pump_id: int, db: Session = Depends(get_db)):
    return db.query(Maintenance).filter(
        Maintenance.pump_id == pump_id
    ).all()


@app.delete("/maintenance/{maintenance_id}", tags=["Maintenance"])
def delete_maintenance(maintenance_id: int, db: Session = Depends(get_db)):
    record = db.query(Maintenance).filter(
        Maintenance.id == maintenance_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Maintenance not found"
        )

    db.delete(record)
    db.commit()

    return {
        "success": True,
        "message": "Maintenance record deleted"
    }


# =====================================================
#                    REPORTS
# =====================================================

@app.get("/reports/summary", tags=["Reports"])
def get_report_summary(db: Session = Depends(get_db)):
    pumps = db.query(Pump).all()
    maintenance = db.query(Maintenance).all()

    return {
        "total_pumps": len(pumps),
        "active_pumps": len([p for p in pumps if p.status == "Active"]),
        "pumps_under_maintenance": len(
            [p for p in pumps if p.status != "Active"]
        ),
        "total_maintenance_records": len(maintenance)
    }
