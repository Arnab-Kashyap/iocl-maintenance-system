# backend/app/train_model.py

import numpy as np
from sklearn.linear_model import LogisticRegression
import joblib

# Generate dummy training data
# Features: [usage_hours, temperature, vibration, breakdown_count]

X = np.array([
    [200, 60, 2.0, 0],
    [300, 65, 2.5, 1],
    [600, 85, 4.0, 3],
    [700, 90, 4.5, 4],
    [150, 55, 1.5, 0],
    [500, 80, 3.5, 2],
])

# Labels: 0 = no failure, 1 = failure risk
y = np.array([0, 0, 1, 1, 0, 1])

# Train model
model = LogisticRegression()
model.fit(X, y)

# Save model
joblib.dump(model, "pump_failure_model.pkl")

print("Model trained and saved successfully!")