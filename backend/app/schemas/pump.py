# app/schemas/pump.py

from pydantic import BaseModel, ConfigDict
from typing import Literal
from datetime import datetime


class PumpCreate(BaseModel):
    name: str
    status: Literal["Active", "Inactive", "Under Maintenance"]


class PumpResponse(BaseModel):
    id: int
    name: str
    status: str
    created_at: datetime   

    model_config = ConfigDict(from_attributes=True)