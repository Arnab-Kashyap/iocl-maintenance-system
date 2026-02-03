from pydantic import BaseModel

class MaintenanceCreate(BaseModel):
    pump_id: int
    description: str
    status: str
