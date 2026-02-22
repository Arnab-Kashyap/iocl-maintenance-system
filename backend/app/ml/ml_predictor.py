import pickle
import numpy as np
from pathlib import Path

# Get correct path of model file
MODEL_PATH = Path(__file__).parent / "pump_failure_model.pkl"

# Load model only once
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)


def predict_pump_failure(usage_hours: int, temperature: float, vibration: float):
    """
    Predict pump failure risk
    """

    data = np.array([[usage_hours, temperature, vibration]])

    prediction = model.predict(data)[0]
    probability = model.predict_proba(data)[0][1]

    return {
        "prediction": int(prediction),
        "probability": float(probability)
    }