from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pump import Pump
from app.schemas.pump import PumpCreate, PumpResponse


router = APIRouter(
    prefix="/pumps",
    tags=["Pumps"]
)


# =====================================================
#                    CREATE PUMP
# =====================================================
@router.post("/", response_model=PumpResponse)
def add_pump(pump: PumpCreate, db: Session = Depends(get_db)):

    new_pump = Pump(
        name=pump.name,
        status=pump.status
    )

    db.add(new_pump)
    db.commit()
    db.refresh(new_pump)

    return new_pump


# =====================================================
#                    GET ALL PUMPS
# =====================================================
@router.get("/", response_model=list[PumpResponse])
def get_pumps(db: Session = Depends(get_db)):

    return db.query(Pump).all()


# =====================================================
#                    GET PUMP BY ID
# =====================================================
@router.get("/{pump_id}", response_model=PumpResponse)
def get_pump_by_id(pump_id: int, db: Session = Depends(get_db)):

    pump = db.query(Pump).filter(Pump.id == pump_id).first()

    if not pump:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pump not found"
        )

    return pump


# =====================================================
#                    DELETE PUMP
# =====================================================
@router.delete("/{pump_id}")
def delete_pump(pump_id: int, db: Session = Depends(get_db)):

    pump = db.query(Pump).filter(Pump.id == pump_id).first()

    if not pump:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pump not found"
        )

    db.delete(pump)
    db.commit()

    return {
        "success": True,
        "message": "Pump deleted successfully"
    }
