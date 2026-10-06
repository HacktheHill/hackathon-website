ALTER TABLE removal_reports ADD COLUMN resolved_at INTEGER;
CREATE INDEX IF NOT EXISTS removal_reports_retention_idx ON removal_reports(status, resolved_at);
