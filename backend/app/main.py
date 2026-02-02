from fastapi import FastAPI
from app.schemas.pump import PumpCreate
from app.schemas.maintenance import MaintenanceCreate


app = FastAPI(title="IOCL Maintenance System")
@app.post("/maintenance")
def schedule_maintenance(maintenance: MaintenanceCreate):
    record = {
        "id": len(maintenance_data) + 1,
        "pump_id": maintenance.pump_id,
        "description": maintenance.description,
        "status": maintenance.status
    }
    maintenance_data.append(record)
    return {
        "message": "Maintenance scheduled",
        "maintenance": record
    }

@app.get("/maintenance/{pump_id}")
def get_maintenance_by_pump(pump_id: int):
    return [
        m for m in maintenance_data if m["pump_id"] == pump_id
    ]


pumps_data = [
    {"id": 1, "name": "Pump A", "status": "Active"},
    {"id": 2, "name": "Pump B", "status": "Under Maintenance"}
]
maintenance_data = []


@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}

@app.get("/pumps")
def get_pumps():
    return pumps_data

@app.get("/pumps/{pump_id}")
def get_pump_by_id(pump_id: int):
    for pump in pumps_data:
        if pump["id"] == pump_id:
            return pump
    return {"message": "Pump not found"}

@app.post("/pumps")
def add_pump(pump: PumpCreate):
    new_pump = {
        "id": len(pumps_data) + 1,
        "name": pump.name,
        "status": pump.status
    }
    pumps_data.append(new_pump)
    return {
        "message": "Pump added successfully",
        "pump": new_pump
    }
