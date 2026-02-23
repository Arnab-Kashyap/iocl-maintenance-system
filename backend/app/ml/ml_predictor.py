import joblib
from pathlib import Path
import numpy as np

# Load model
BASE_DIR = Path(__file__).resolve().parent
model_path = BASE_DIR / "pump_failure_model.pkl"

model = joblib.load(model_path)


def predict_pump_failure(usage_hours, temperature, vibration, breakdown_count):
    try:
        # Prepare input (4 features)
        input_data = np.array([[usage_hours, temperature, vibration, breakdown_count]])

        prediction = model.predict(input_data)[0]
        probability = model.predict_proba(input_data)[0][1]

        return {
            "prediction": int(prediction),
            "probability": round(float(probability), 2)
        }

    except Exception as e:
        return {
            "prediction": None,
            "probability": None,
            "error": str(e)
        }