# app/schemas/maintenance.py

from pydantic import BaseModel
from typing import Literal
from datetime import datetime


class MaintenanceCreate(BaseModel):
    pump_id: int
    description: str
    status: Literal["Pending", "In Progress", "Completed"]
    due_date: datetime


class MaintenanceUpdate(BaseModel):
    status: Literal["Pending", "In Progress", "Completed"]


class MaintenanceResponse(BaseModel):
    id: int
    pump_id: int
    description: str
    status: str
    due_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True