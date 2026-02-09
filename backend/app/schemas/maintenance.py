from pydantic import BaseModel
from typing import Literal

class MaintenanceCreate(BaseModel):
    pump_id: int
    description: str
    status: Literal["Scheduled", "In Progress", "Completed"]
