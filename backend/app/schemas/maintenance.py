from pydantic import BaseModel
from enum import Enum

class MaintenanceStatus(str, Enum):
    Scheduled = "Scheduled"
    In_Progress = "In Progress"
    Completed = "Completed"

class MaintenanceCreate(BaseModel):
    pump_id: int
    description: str
    status: MaintenanceStatus
