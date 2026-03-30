import json
from pathlib import Path

import joblib
import pandas as pd
import shap


BASE_DIR = Path(__file__).resolve().parent.parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"

MODEL_PATH = ARTIFACTS_DIR / "model.joblib"
FEATURE_COLUMNS_PATH = ARTIFACTS_DIR / "feature_columns.json"

_model = None
_feature_columns = None
_explainer = None


def load_model():
    global _model
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    return _model


def load_feature_columns():
    global _feature_columns
    if _feature_columns is None:
        with open(FEATURE_COLUMNS_PATH, "r", encoding="utf-8") as f:
            _feature_columns = json.load(f)
    return _feature_columns


def load_explainer():
    global _explainer
    model = load_model()
    if _explainer is None:
        _explainer = shap.TreeExplainer(model)
    return _explainer


def build_row_dataframe(row_dict: dict) -> pd.DataFrame:
    feature_columns = load_feature_columns()

    aligned_row = {}
    for col in feature_columns:
        value = row_dict.get(col, 0)
        if value is None:
            value = 0
        aligned_row[col] = value

    return pd.DataFrame([aligned_row])


def explain_row(row_dict: dict, top_n: int = 10) -> dict:
    model = load_model()
    explainer = load_explainer()
    df = build_row_dataframe(row_dict)

    prediction = int(model.predict(df)[0])

    probability = None
    if hasattr(model, "predict_proba"):
        probability = float(model.predict_proba(df)[0][1])

    shap_values = explainer.shap_values(df)

    if isinstance(shap_values, list):
        values = shap_values[1][0]
    else:
        values = shap_values[0]

    feature_columns = load_feature_columns()
    row_values = df.iloc[0].to_dict()

    items = []
    for idx, feature_name in enumerate(feature_columns):
        shap_value = float(values[idx])
        raw_value = row_values.get(feature_name)

        items.append({
            "feature": feature_name,
            "value": raw_value,
            "shap_value": round(shap_value, 6),
            "direction": "ATTACK" if shap_value > 0 else "BENIGN",
        })

    items.sort(key=lambda x: abs(x["shap_value"]), reverse=True)
    top_features = items[:top_n]

    return {
        "predicted_label": prediction,
        "probability": round(probability, 6) if probability is not None else None,
        "top_features": top_features,
    }