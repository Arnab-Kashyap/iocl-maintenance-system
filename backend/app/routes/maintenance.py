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

router = APIRouter(
    prefix="/maintenance",
    tags=["Maintenance"]
)


# =====================================================
#                SCHEDULE MAINTENANCE
# =====================================================
@router.post("/", response_model=MaintenanceResponse)
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

    return new_record


# =====================================================
#                UPDATE MAINTENANCE
# =====================================================
@router.put("/{maintenance_id}", response_model=MaintenanceResponse)
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
    db.refresh(record)

    return record


# =====================================================
#        GET MAINTENANCE BY PUMP
# =====================================================
@router.get("/pump/{pump_id}", response_model=list[MaintenanceResponse])
def get_maintenance_by_pump(pump_id: int, db: Session = Depends(get_db)):

    return db.query(Maintenance).filter(
        Maintenance.pump_id == pump_id
    ).all()


# =====================================================
#                DELETE MAINTENANCE
# =====================================================
@router.delete("/{maintenance_id}")
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
