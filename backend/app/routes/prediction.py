from fastapi import APIRouter
from app.ml.ml_predictor import predict_pump_failure
from app.schemas.prediction import PredictionRequest

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)


@router.post("/")
def predict_failure(request: PredictionRequest):

    result = predict_pump_failure(
        request.usage_hours,
        request.temperature,
        request.vibration,
        request.breakdown_count
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