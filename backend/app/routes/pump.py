from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pump import Pump
from app.schemas.pump import PumpCreate, PumpResponse
from app.auth import get_current_user, require_admin

router = APIRouter(
    prefix="/pumps",
    tags=["Pumps"]
)

@router.post("/", response_model=PumpResponse)
def add_pump(
    pump: PumpCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    new_pump = Pump(
        name=pump.name,
        status=pump.status
    )

    db.add(new_pump)
    db.commit()
    db.refresh(new_pump)

    return new_pump


@router.get("/", response_model=list[PumpResponse])
def get_pumps(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return db.query(Pump).all()


@router.get("/{pump_id}", response_model=PumpResponse)
def get_pump_by_id(
    pump_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    pump = db.query(Pump).filter(Pump.id == pump_id).first()

    if not pump:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pump not found"
        )

    return pump


@router.delete("/{pump_id}")
def delete_pump(
    pump_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
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
