import json
import os
import joblib
import numpy as np
import pandas as pd

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "..", "artifacts")
MODEL_PATH = os.path.join(ARTIFACTS_DIR, "model.joblib")
FEATURES_PATH = os.path.join(ARTIFACTS_DIR, "feature_columns.json")


class ModelService:
    def __init__(self):
        self.model = None
        self.feature_columns = None

    def load(self):
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Missing model artifact: {MODEL_PATH}")
        if not os.path.exists(FEATURES_PATH):
            raise FileNotFoundError(f"Missing feature columns: {FEATURES_PATH}")

        self.model = joblib.load(MODEL_PATH)

        with open(FEATURES_PATH, "r") as f:
            self.feature_columns = json.load(f)

    def _to_float(self, v):
        # Convert strings to float safely. Unknown -> NaN.
        try:
            if v is None:
                return np.nan
            if isinstance(v, str):
                v = v.strip()
                if v == "":
                    return np.nan
            return float(v)
        except Exception:
            return np.nan

    def predict_batch(self, flows):
        if self.model is None or self.feature_columns is None:
            raise RuntimeError("Model not loaded")

        rows = []
        for flow in flows:
            feats = flow.get("features", {})
            row = {col: self._to_float(feats.get(col)) for col in self.feature_columns}
            rows.append(row)

        X = pd.DataFrame(rows, columns=self.feature_columns)

        # Match training cleaning: replace inf -> NaN, then fill NaN with 0 (simple + stable)
        X.replace([np.inf, -np.inf], np.nan, inplace=True)
        X.fillna(0.0, inplace=True)

        proba = None
        if hasattr(self.model, "predict_proba"):
            proba = self.model.predict_proba(X)[:, 1]  # probability of ATTACK (label=1)

        preds = self.model.predict(X).astype(int)

        results = []
        for i, label in enumerate(preds):
            p = float(proba[i]) if proba is not None else None
            results.append({"label": int(label), "probability": p})

        return results


model_service = ModelService()