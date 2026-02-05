from pydantic import BaseModel
from typing import Literal

class PumpCreate(BaseModel):
    name: str
    status: Literal["Active", "Under Maintenance", "Inactive"]
