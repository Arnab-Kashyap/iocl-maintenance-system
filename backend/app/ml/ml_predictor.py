import joblib
import numpy as np
from pathlib import Path

MODEL_PATH = Path(__file__).parent / "pump_failure_model.pkl"

model = joblib.load(MODEL_PATH)

def predict_pump_failure(usage_hours, temperature, vibration, breakdown_count):
    features = np.array([[usage_hours, temperature, vibration, breakdown_count]])

    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0][1]

    return {
        "failure_risk": int(prediction),
        "probability": float(round(probability * 100, 2))
    }