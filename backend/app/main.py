from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.schemas.pump import PumpCreate
from app.schemas.maintenance import MaintenanceCreate

app = FastAPI(title="IOCL Maintenance System")

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- IN-MEMORY DATA --------------------
pumps_data = [
    {"id": 1, "name": "Pump A", "status": "Active"},
    {"id": 2, "name": "Pump B", "status": "Under Maintenance"},
]

maintenance_data = []
@app.put("/maintenance/{maintenance_id}", tags=["Maintenance"])
def update_maintenance_status(maintenance_id: int, new_status: str):
    for m in maintenance_data:
        if m["id"] == maintenance_id:
            m["status"] = new_status

            # update pump status
            for pump in pumps_data:
                if pump["id"] == m["pump_id"]:
                    if new_status == "Completed":
                        pump["status"] = "Active"
                    else:
                        pump["status"] = "Under Maintenance"

            return {
                "success": True,
                "message": "Maintenance and pump status updated",
                "maintenance": m
            }

    raise HTTPException(status_code=404, detail="Maintenance not found")


# -------------------- HEALTH --------------------
@app.get("/health")
def health_check():
    return {
        "success": True,
        "status": "ok",
        "service": "IOCL Maintenance Backend"
    }

# -------------------- ROOT --------------------
@app.get("/")
def root():
    return {
        "success": True,
        "message": "Backend is running 🚀"
    }

# -------------------- PUMPS --------------------
@app.get("/pumps", tags=["Pumps"])
def get_pumps():
    return pumps_data


@app.get("/pumps/{pump_id}", tags=["Pumps"])
def get_pump_by_id(pump_id: int):
    for pump in pumps_data:
        if pump["id"] == pump_id:
            return pump

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Pump not found"
    )


@app.post("/pumps", tags=["Pumps"])
def add_pump(pump: PumpCreate):
    new_pump = {
        "id": len(pumps_data) + 1,
        "name": pump.name,
        "status": pump.status
    }
    pumps_data.append(new_pump)

    return {
        "success": True,
        "message": "Pump added successfully",
        "pump": new_pump
    }

# -------------------- MAINTENANCE --------------------
@app.post("/maintenance", tags=["Maintenance"])
def schedule_maintenance(maintenance: MaintenanceCreate):

    # find pump
    pump = None
    for p in pumps_data:
        if p["id"] == maintenance.pump_id:
            pump = p
            break

    if not pump:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pump not found"
        )

    # create maintenance record
    record = {
        "id": len(maintenance_data) + 1,
        "pump_id": maintenance.pump_id,
        "description": maintenance.description,
        "status": maintenance.status
    }
    maintenance_data.append(record)

    # update pump status
    pump["status"] = "Under Maintenance"

    return {
        "success": True,
        "message": "Maintenance scheduled",
        "maintenance": record,
        "pump": pump
    }
@app.put("/maintenance/{maintenance_id}", tags=["Maintenance"])
def update_maintenance_status(maintenance_id: int, new_status: str):
    for m in maintenance_data:
        if m["id"] == maintenance_id:
            m["status"] = new_status
            return {
                "success": True,
                "message": "Maintenance status updated",
                "maintenance": m
            }

    raise HTTPException(
        status_code=404,
        detail="Maintenance record not found"
    )



@app.get("/maintenance/pump/{pump_id}", tags=["Maintenance"])
def get_maintenance_by_pump(pump_id: int):
    return [
        m for m in maintenance_data if m["pump_id"] == pump_id
    ]

# -------------------- REPORTS --------------------
@app.get("/reports/summary", tags=["Reports"])
def get_report_summary():
    total_pumps = len(pumps_data)

    active_pumps = len(
        [p for p in pumps_data if p["status"] == "Active"]
    )

    maintenance_pumps = len(
        [p for p in pumps_data if p["status"] != "Active"]
    )

    total_maintenance = len(maintenance_data)

    return {
        "total_pumps": total_pumps,
        "active_pumps": active_pumps,
        "pumps_under_maintenance": maintenance_pumps,
        "total_maintenance_records": total_maintenance
    }
