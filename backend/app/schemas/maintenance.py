from pydantic import BaseModel
from datetime import datetime
from typing import Literal


class MaintenanceCreate(BaseModel):
    pump_id: int
    description: str
    status: Literal["Scheduled", "In Progress", "Completed"]


class MaintenanceUpdate(BaseModel):
    status: Literal["Scheduled", "In Progress", "Completed"]


class MaintenanceResponse(BaseModel):
    id: int
    pump_id: int
    description: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
