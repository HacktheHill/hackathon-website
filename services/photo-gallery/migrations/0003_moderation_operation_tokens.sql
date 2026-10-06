ALTER TABLE photos ADD COLUMN moderation_operation_id TEXT;
ALTER TABLE removal_cases ADD COLUMN moderation_operation_id TEXT;
CREATE INDEX IF NOT EXISTS photos_moderation_operation_idx ON photos(moderation_operation_id);
CREATE INDEX IF NOT EXISTS removal_cases_moderation_operation_idx ON removal_cases(moderation_operation_id);
