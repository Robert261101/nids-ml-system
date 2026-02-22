from fastapi import FastAPI
from app.schemas import FlowBatch, PredictionBatchResponse, PredictionResult
from app.model import model_service

app = FastAPI()


@app.on_event("startup")
def startup():
    model_service.load()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionBatchResponse)
def predict(data: FlowBatch):
    # Convert pydantic models -> dicts for model service
    flows = [{"features": f.features} for f in data.flows]

    preds = model_service.predict_batch(flows)

    return PredictionBatchResponse(
        predictions=[
            PredictionResult(label=p["label"], probability=p["probability"] if p["probability"] is not None else 0.0)
            for p in preds
        ]
    )