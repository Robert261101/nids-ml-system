from fastapi import FastAPI, UploadFile, File, HTTPException
import pandas as pd
from io import BytesIO

from app.schemas import FlowBatch, PredictionBatchResponse, PredictionResult
from app.model import model_service

app = FastAPI()

MAX_BYTES = 300 * 1024 * 1024  # 10MB  --  300MB for now


@app.on_event("startup")
def startup():
    model_service.load()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionBatchResponse)
def predict(data: FlowBatch):
    flows = [{"features": f.features} for f in data.flows]
    preds = model_service.predict_batch(flows)

    return PredictionBatchResponse(
        predictions=[
            PredictionResult(
                label=p["label"],
                probability=p["probability"] if p["probability"] is not None else 0.0,
            )
            for p in preds
        ]
    )


@app.post("/predict/csv", response_model=PredictionBatchResponse)
async def predict_csv(file: UploadFile = File(...)):
    # basic filename check
    if file.filename and not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are allowed")

    contents = await file.read()

    # size guard
    if len(contents) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 10MB)")

    # parse CSV
    try:
        df = pd.read_csv(BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid CSV")
    
    df = df.head(50)

    # Convert dataframe rows -> expected format for model_service.predict_batch
    # Each row becomes {"features": {col: value, ...}}
    flows = []
    for _, row in df.iterrows():
        features = row.to_dict()
        flows.append({"features": features})

    preds = model_service.predict_batch(flows)

    return PredictionBatchResponse(
        predictions=[
            PredictionResult(
                label=p["label"],
                probability=p["probability"] if p["probability"] is not None else 0.0,
            )
            for p in preds
        ]
    )