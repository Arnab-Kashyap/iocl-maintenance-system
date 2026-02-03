from fastapi import APIRouter
from app.schemas.maintenance import MaintenanceRequest

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])

@router.post("/report")
def report_issue(data: MaintenanceRequest):
    return {
        "message": "Maintenance issue received",
        "data": data
    }
