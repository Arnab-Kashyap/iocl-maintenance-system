from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.pump import Pump

router = APIRouter(prefix="/pumps", tags=["Pumps"])


# ✅ Get All Pumps
@router.get("/")
def get_pumps(db: Session = Depends(get_db)):
    pumps = db.query(Pump).all()
    return pumps


# ✅ Create Pump
@router.post("/")
def create_pump(pump_data: dict, db: Session = Depends(get_db)):
    pump = Pump(**pump_data)
    db.add(pump)
    db.commit()
    db.refresh(pump)
    return pump


# ✅ Mark Pump as Maintained (THIS WAS MISSING ❗)
@router.put("/{pump_id}/maintain")
def mark_maintained(pump_id: int, db: Session = Depends(get_db)):
    pump = db.query(Pump).filter(Pump.id == pump_id).first()

    if not pump:
        raise HTTPException(status_code=404, detail="Pump not found")

    pump.status = "working"
    pump.last_maintenance_date = datetime.utcnow()

    db.commit()
    db.refresh(pump)

    return {
        "success": True,
        "message": "Pump marked as maintained",
        "pump_id": pump.id
    }