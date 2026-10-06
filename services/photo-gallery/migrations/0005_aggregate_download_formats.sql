ALTER TABLE daily_aggregates ADD COLUMN full_downloads INTEGER NOT NULL DEFAULT 0;
ALTER TABLE daily_aggregates ADD COLUMN quick_downloads INTEGER NOT NULL DEFAULT 0;
