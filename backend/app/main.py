from fastapi import FastAPI

app = FastAPI(title="IOCL Maintenance System")

# Temporary in-memory data (no database yet)
pumps_data = [
    {"id": 1, "name": "Pump A", "status": "Active"},
    {"id": 2, "name": "Pump B", "status": "Under Maintenance"}
]

# Root API
@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}

# Get all pumps
@app.get("/pumps")
def get_pumps():
    return pumps_data

# Add a new pump
@app.post("/pumps")
def add_pump(pump: dict):
    pump["id"] = len(pumps_data) + 1
    pumps_data.append(pump)
    return {
        "message": "Pump added successfully",
        "pump": pump
    }
