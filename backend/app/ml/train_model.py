import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
from pathlib import Path

# -------------------------
# Create Dummy Dataset
# -------------------------

data = {
    "usage_hours": [200, 400, 600, 800, 1000, 1200, 1400, 1600, 300, 900, 1500, 700],
    "temperature": [60, 65, 75, 85, 90, 95, 100, 105, 70, 88, 98, 80],
    "vibration": [2.5, 3.0, 3.8, 4.5, 4.8, 5.2, 5.5, 6.0, 3.2, 4.6, 5.3, 4.0],
    "breakdown_count": [0, 0, 1, 1, 2, 3, 3, 4, 0, 2, 4, 1],
    "failure": [0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0]
}

df = pd.DataFrame(data)

# Features (4)
X = df[["usage_hours", "temperature", "vibration", "breakdown_count"]]
y = df["failure"]

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train Model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

# Save Model
BASE_DIR = Path(__file__).resolve().parent
model_path = BASE_DIR / "pump_failure_model.pkl"

joblib.dump(model, model_path)

print("\nModel trained and saved successfully at:", model_path)