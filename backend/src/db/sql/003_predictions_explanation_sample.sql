ALTER TABLE predictions
ADD COLUMN IF NOT EXISTS explanation_sample_json JSONB;