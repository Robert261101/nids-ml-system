CREATE TABLE IF NOT EXISTS predictions (
  id              BIGSERIAL PRIMARY KEY,
  request_id      TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  model_version   TEXT NOT NULL DEFAULT 'unknown',
  input_filename  TEXT,
  rows            INT NOT NULL,
  attacks_count   INT NOT NULL,
  benign_count    INT NOT NULL,
  output_json     JSONB NOT NULL,
  explanation_sample_json JSONB
);

CREATE INDEX IF NOT EXISTS idx_predictions_request_id ON predictions(request_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at);

CREATE TABLE IF NOT EXISTS alerts (
    id BIGSERIAL PRIMARY KEY,
    prediction_id BIGINT REFERENCES predictions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    severity TEXT,
    mitre_tactics TEXT[],
    mitre_techniques TEXT[],
    explanation_row_index integer,
    summary TEXT
);