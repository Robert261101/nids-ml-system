import os
import json
import joblib
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

DATA_PATH = "../data/cicids2017/raw/Friday-WorkingHours-Afternoon-DDos.pcap_ISCX.csv"
ARTIFACTS_DIR = "artifacts"
MODEL_PATH = os.path.join(ARTIFACTS_DIR, "model.joblib")
FEATURES_PATH = os.path.join(ARTIFACTS_DIR, "feature_columns.json")

print("Loading dataset...")
df = pd.read_csv(DATA_PATH)

# Remove leading/trailing spaces in column names
df.columns = df.columns.str.strip()

print("Initial shape:", df.shape)

print("Cleaning dataset...")

df.replace([np.inf, -np.inf], np.nan, inplace=True)
df.dropna(inplace=True)

print("Shape after cleaning:", df.shape)

print("Encoding labels...")

df['Label'] = df['Label'].apply(lambda x: 0 if x == "BENIGN" else 1)

X = df.select_dtypes(include=[np.number]).drop(columns=["Label"])
y = df["Label"]

print("Feature matrix shape:", X.shape)

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("Training Random Forest model...")

model = RandomForestClassifier(
    n_estimators=100,
    max_depth=None,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

print("Evaluating model...")
y_pred = model.predict(X_test)

print(classification_report(y_test, y_pred))

feature_columns = list(X.columns)

with open(FEATURES_PATH, "w") as f:
    json.dump(feature_columns, f)

joblib.dump(model, MODEL_PATH)

print("Model saved to:", MODEL_PATH)
print("Feature columns saved to:", FEATURES_PATH)