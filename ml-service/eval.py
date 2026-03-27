import pandas as pd
import json
from pathlib import Path
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import numpy as np

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "artifacts" / "model.joblib"
FEATURE_PATH = BASE_DIR / "artifacts" / "feature_columns.json"

DATA_PATH = BASE_DIR.parent / "data" / "cicids2017" / "raw" / "Friday-WorkingHours-Afternoon-PortScan.pcap_ISCX.csv"

model = joblib.load(MODEL_PATH)

with open(FEATURE_PATH) as f:
    feature_columns = json.load(f)

df = pd.read_csv(DATA_PATH)

df.columns = df.columns.str.strip()
labels = df["Label"]

df = df.drop(columns=["Label"])

for col in feature_columns:
    if col not in df.columns:
        df[col] = 0

df = df[feature_columns]

df = df.replace([np.inf, -np.inf], np.nan)
df = df.fillna(0)

y_true = (labels != "BENIGN").astype(int)

y_pred = model.predict(df)

print("Confusion Matrix:")
print(confusion_matrix(y_true, y_pred))

print("\nClassification Report:")
print(classification_report(y_true, y_pred))