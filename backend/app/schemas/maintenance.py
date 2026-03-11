from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MaintenanceCreate(BaseModel):
    pump_id: int
    description: str
    status: str = "Pending"
    due_date: Optional[datetime] = None


class MaintenanceUpdate(BaseModel):
    status: str
    due_date: Optional[datetime] = None


class MaintenanceResponse(BaseModel):
    id: int
    pump_id: int
    description: str
    status: str
    due_date: Optional[datetime] = None   # ← Optional so None doesn't crash
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True