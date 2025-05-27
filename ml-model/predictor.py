import os
import gdown
import joblib
import requests
import pandas as pd
from pathlib import Path

# .pkl file id stored in google drive
FILE_ID = "1_0rtE0H4MlC1uy6vbd7XNIOzcWNdPCTv"
# This gives you the directory where the current file is located
BASE_DIR = Path(__file__).resolve().parent
# These paths work regardless of where the script is called from
MODEL_PATH = BASE_DIR / "far_model.pkl"
PIPELINE_PATH = BASE_DIR / "fare_preprocessing_pipeline.pkl"

# Required input fields
REQUIRED_FEATURES = [
    "distance_km",
    "duration_min",
    "passenger_count",
    "is_airport_ride",
    "is_holiday",
    "is_night",
    "is_weekend"
]


def download_model():
    if not MODEL_PATH.exists():
        print("Downloading model...")
        url = f"https://drive.google.com/uc?id={FILE_ID}"
        gdown.download(url, str(MODEL_PATH), quiet=False)
        print("Model downloaded.")


# Ensure model is downloaded first
download_model()

# Load the saved model and preprocessing pipeline
model = joblib.load(MODEL_PATH)
pipeline = joblib.load(PIPELINE_PATH)


def predict_fare(input_data: dict) -> float:
    """
    Predict taxi fare from structured input dictionary.
    """
    # Convert input to DataFrame
    input_df = pd.DataFrame([input_data])

    # Ensure all required fields are present
    missing = set(REQUIRED_FEATURES) - set(input_df.columns)
    if missing:
        raise ValueError(f"Missing required fields: {missing}")

    # Apply pipeline and predict
    X_prepared = pipeline.transform(input_df)
    prediction = model.predict(X_prepared)

    return round(float(prediction[0]), 2)


# example

normal_booking = {
    "distance_km": 16,
    "duration_min": 20,
    "passenger_count": 4,
    "is_airport_ride": 0,
    "is_holiday": 0,
    "is_night": 1, 
    "is_weekend": 0,
    'day_of_week': 4, 
    'month': 8, 
    'hour':20
}

airport_booking = {
    "distance_km": 16,
    "duration_min": 20,
    "passenger_count": 4,
    "is_airport_ride": 1,
    "is_holiday": 0,
    "is_night": 0,
    "is_weekend": 1,
    'day_of_week': 6, 
    'month': 8, 
    'hour': 20
}


if __name__ == "__main__":
    normal_fare = predict_fare(input_data=normal_booking)
    airport_fare = predict_fare(input_data=airport_booking)

    print(normal_fare, airport_fare)
