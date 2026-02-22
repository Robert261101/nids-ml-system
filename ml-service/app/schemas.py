from pydantic import BaseModel
from typing import List, Dict, Any


# One network flow row (features as key-value pairs)
class Flow(BaseModel):
    features: Dict[str, Any]


# Multiple rows
class FlowBatch(BaseModel):
    flows: List[Flow]


# Response for one prediction
class PredictionResult(BaseModel):
    label: int
    probability: float


# Response for batch
class PredictionBatchResponse(BaseModel):
    predictions: List[PredictionResult]