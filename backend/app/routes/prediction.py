from fastapi import APIRouter
from app.ml.ml_predictor import predict_pump_failure

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)


@router.post("/")
def predict_failure(
    usage_hours: int,
    temperature: float,
    vibration: float
):

    result = predict_pump_failure(
        usage_hours,
        temperature,
        vibration
    )

    if result["prediction"] == 1:
        message = "⚠️ High risk of failure. Schedule maintenance."
    else:
        message = "✅ Pump operating normally."

    return {
        "failure_prediction": result["prediction"],
        "failure_probability": result["probability"],
        "message": message
    }