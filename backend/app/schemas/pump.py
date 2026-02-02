from pydantic import BaseModel

class PumpCreate(BaseModel):
    name: str
    status: str
