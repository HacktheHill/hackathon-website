PRAGMA foreign_keys = OFF;

CREATE TABLE IF NOT EXISTS moderation_audit_new (
  id TEXT PRIMARY KEY,
  actor_account_id TEXT NOT NULL,
  action TEXT NOT NULL,
  case_id TEXT,
  photo_id TEXT,
  reason TEXT,
  expected_version INTEGER,
  created_at INTEGER NOT NULL
);
INSERT OR IGNORE INTO moderation_audit_new SELECT id,actor_account_id,action,case_id,photo_id,reason,expected_version,created_at FROM moderation_audit;
DROP TABLE IF EXISTS moderation_audit;
ALTER TABLE moderation_audit_new RENAME TO moderation_audit;

CREATE TABLE IF NOT EXISTS viewer_opens_new (
  photo_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  opened_at INTEGER NOT NULL,
  PRIMARY KEY (photo_id, session_key),
  FOREIGN KEY (photo_id) REFERENCES photos(id)
);
INSERT OR IGNORE INTO viewer_opens_new(photo_id,session_key,opened_at)
  SELECT photo_id,session_token_hash,opened_at FROM viewer_opens;
DROP TABLE IF EXISTS viewer_opens;
ALTER TABLE viewer_opens_new RENAME TO viewer_opens;

ALTER TABLE code_challenges ADD COLUMN request_ip_hash TEXT;
CREATE INDEX IF NOT EXISTS challenges_ip_idx ON code_challenges(request_ip_hash, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS download_request_binding_idx ON download_requests(request_id,account_id,photo_id,format);
CREATE TABLE IF NOT EXISTS album_visits (
  day TEXT PRIMARY KEY,
  visits INTEGER NOT NULL DEFAULT 0
);
CREATE TRIGGER IF NOT EXISTS quarantine_photo_after_report
AFTER INSERT ON removal_reports
WHEN NEW.status = 'pending'
BEGIN
  UPDATE photos
  SET status = CASE WHEN status = 'published' THEN 'quarantined' ELSE status END,
      version = version + 1,
      updated_at = strftime('%s','now') * 1000
  WHERE id = NEW.photo_id;
END;

PRAGMA foreign_keys = ON;
