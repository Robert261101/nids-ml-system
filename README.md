# NIDS-ML-System (CIC-IDS2017) — Local Run Guide

This repo contains a minimal full-stack NIDS prototype:

* **ML Service** (FastAPI): runs the trained model and serves `/predict`
* **Backend API** (Express): the only API the browser talks to (`/api/predict`)
* **Frontend** (React/Vite): upload CSV → send sample rows → show results

---

## Prerequisites

* Node.js (LTS recommended)
* Python 3.12+
* CIC-IDS2017 CSV files extracted into: `data/cicids2017/raw/`

---

## Project Structure (important paths)

* `ml-service/` — FastAPI + training script + artifacts
* `backend/` — Express API
* `frontend/` — React UI
* `data/cicids2017/raw/` — raw CSV dataset (gitignored)
* `data/cicids2017/processed/` — processed dataset (gitignored)
* `ml-service/artifacts/` — model + feature columns (generated)

---

## 1) ML Service (train + run)

Open a terminal in: `ml-service/`

### Create + activate venv (Windows)

```bash
python -m venv venv
venv\Scripts\activate
```

### Install deps

```bash
pip install -r requirements.txt
```

### Train model (generates artifacts)

```bash
python train.py
```

Confirm these exist:

* `ml-service/artifacts/model.joblib`
* `ml-service/artifacts/feature_columns.json`

### Run ML API

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Quick check:

* `http://127.0.0.1:8000/health`
* `http://127.0.0.1:8000/docs`

Keep this terminal running.

---

## 2) Backend API (Express)

Open a second terminal in: `backend/`

### Install deps

```bash
npm install
```

### Configure env

Create/verify `backend/.env`:

```env
PORT=5000
ML_SERVICE_URL=http://127.0.0.1:8000
```

### Run backend

```bash
npm run dev
```

Quick check:

* `http://localhost:5000/health`

Keep this terminal running.

---

## 3) Frontend (React/Vite)

Open a third terminal in: `frontend/`

### Install deps

```bash
npm install
```

### Run frontend

```bash
npm run dev
```

Open the URL shown in terminal (usually `http://localhost:5173`).

Upload a CIC-IDS2017 CSV file:

* The UI samples the first N rows
* Sends them to `backend /api/predict`
* Backend forwards to ML `/predict`
* UI shows predicted BENIGN vs ATTACK counts

---

## Troubleshooting

* **Backend ECONNREFUSED ::1:8000**

  * Run ML service with IPv4:

    ```bash
    uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
    ```
  * Use `ML_SERVICE_URL=http://127.0.0.1:8000`

* **Prediction fails due to feature mismatch**

  * Your model expects the exact feature set it was trained on.
  * Ensure training and inference use the same CSV schema.
