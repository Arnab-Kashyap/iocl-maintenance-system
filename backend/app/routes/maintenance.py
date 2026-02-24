# app/routes/maintenance.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.maintenance import Maintenance
from app.models.pump import Pump
from app.schemas.maintenance import (
    MaintenanceCreate,
    MaintenanceUpdate,
    MaintenanceResponse
)
from app.routes.auth import require_role

router = APIRouter(
    prefix="/maintenance",
    tags=["Maintenance"]
)


# SCHEDULE MAINTENANCE (TECHNICIAN)
@router.post("/", response_model=MaintenanceResponse)
def schedule_maintenance(
    maintenance: MaintenanceCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("technician"))
):

    pump = db.query(Pump).filter(Pump.id == maintenance.pump_id).first()

    if not pump:
        raise HTTPException(status_code=404, detail="Pump not found")

    new_record = Maintenance(
        pump_id=maintenance.pump_id,
        description=maintenance.description,
        status=maintenance.status
    )

    db.add(new_record)

    pump.status = "Under Maintenance"

    db.commit()
    db.refresh(new_record)

    return new_record


# UPDATE MAINTENANCE
@router.put("/{maintenance_id}", response_model=MaintenanceResponse)
def update_maintenance_status(
    maintenance_id: int,
    data: MaintenanceUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("technician"))
):

    record = db.query(Maintenance).filter(
        Maintenance.id == maintenance_id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Maintenance record not found")

    record.status = data.status

    pump = db.query(Pump).filter(Pump.id == record.pump_id).first()

    if pump:
        if data.status == "Completed":
            pump.status = "Active"
            pump.last_maintenance_date = datetime.utcnow()
        else:
            pump.status = "Under Maintenance"

    db.commit()
    db.refresh(record)

    return record


# GET MAINTENANCE BY PUMP
@router.get("/pump/{pump_id}", response_model=list[MaintenanceResponse])
def get_maintenance_by_pump(
    pump_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("technician"))
):
    return db.query(Maintenance).filter(
        Maintenance.pump_id == pump_id
    ).all()


# DELETE MAINTENANCE (ADMIN)
@router.delete("/{maintenance_id}")
def delete_maintenance(
    maintenance_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("admin"))
):

    record = db.query(Maintenance).filter(
        Maintenance.id == maintenance_id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Maintenance not found")

    db.delete(record)
    db.commit()

    return {"success": True, "message": "Maintenance record deleted"}