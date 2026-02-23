from pydantic import BaseModel


class PredictionRequest(BaseModel):
    usage_hours: int
    temperature: float
    vibration: float
    breakdown_count: int