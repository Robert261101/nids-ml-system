import pandas as pd
import numpy as np
import joblib
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR.parent.parent / "artifacts" / "model.joblib"
FEATURE_PATH = BASE_DIR.parent.parent / "artifacts" / "feature_columns.json"
DATA_PATH = BASE_DIR.parent.parent.parent / "data" / "cicids2017" / "raw" / "Monday-WorkingHours.pcap_ISCX.csv"

model = joblib.load(MODEL_PATH)

with open(FEATURE_PATH) as f:
    feature_columns = json.load(f)

df = pd.read_csv(DATA_PATH)

for col in feature_columns:
    if col not in df.columns:
        df[col] = 0

df = df[feature_columns]
df = df.replace([np.inf, -np.inf], np.nan)
df = df.fillna(0)

print("Original dataset shape:", df.shape)


baseline_preds = model.predict(df)

baseline_attack_rate = (baseline_preds == 1).mean()

print("Baseline attack rate:", baseline_attack_rate)

noise_df = df + np.random.normal(0, 0.01, df.shape)

noise_preds = model.predict(noise_df)

noise_attack_rate = (noise_preds == 1).mean()

print("Noise attack rate:", noise_attack_rate)

missing_df = df.copy()

mask = np.random.rand(*missing_df.shape) < 0.05
missing_df[mask] = np.nan

missing_df = missing_df.fillna(0)

missing_preds = model.predict(missing_df)

missing_attack_rate = (missing_preds == 1).mean()

print("Missing value attack rate:", missing_attack_rate)

scaled_df = df * 10

scaled_preds = model.predict(scaled_df)

scaled_attack_rate = (scaled_preds == 1).mean()

print("Scaled feature attack rate:", scaled_attack_rate)

out_df = df.copy()

out_df.iloc[:, :5] = out_df.iloc[:, :5] * 1000

out_preds = model.predict(out_df)

out_attack_rate = (out_preds == 1).mean()

print("Out-of-range attack rate:", out_attack_rate)