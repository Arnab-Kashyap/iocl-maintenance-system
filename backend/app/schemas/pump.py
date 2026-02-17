from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from typing import Literal
from app.auth import require_admin, get_current_user
from fastapi import Depends


class PumpCreate(BaseModel):
    name: str
    status: Literal["Active", "Inactive"]


class PumpResponse(BaseModel):
    id: int
    name: str
    status: Literal["Active", "Inactive", "Under Maintenance"]
    last_maintenance_date: Optional[datetime]

    class Config:
        from_attributes = True
