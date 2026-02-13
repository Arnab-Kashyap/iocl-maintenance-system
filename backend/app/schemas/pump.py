from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PumpCreate(BaseModel):
    name: str
    status: str


class PumpResponse(BaseModel):
    id: int
    name: str
    status: str
    last_maintenance_date: Optional[datetime]

    class Config:
        from_attributes = True
