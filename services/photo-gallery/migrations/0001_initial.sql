PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  email_hash TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('viewer', 'admin')) DEFAULT 'viewer',
  active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  revoked_at INTEGER
);
CREATE INDEX IF NOT EXISTS accounts_email_hash_idx ON accounts(email_hash);

CREATE TABLE IF NOT EXISTS code_challenges (
  id TEXT PRIMARY KEY,
  account_id TEXT,
  email TEXT NOT NULL,
  email_hash TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('en', 'fr')),
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  resend_after INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  consumed_at INTEGER,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);
CREATE INDEX IF NOT EXISTS challenges_email_idx ON code_challenges(email_hash, created_at DESC);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  csrf_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  licence_version TEXT,
  revoked_at INTEGER,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);
CREATE INDEX IF NOT EXISTS sessions_account_idx ON sessions(account_id);

CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  filename TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL CHECK (status IN ('published', 'quarantined', 'withdrawn')),
  thumbnail_key TEXT NOT NULL,
  preview_key TEXT NOT NULL,
  full_key TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS photos_status_order_idx ON photos(status, category, filename);

CREATE TABLE IF NOT EXISTS photo_variants (
  photo_id TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('thumbnail', 'preview', 'full', 'quick')),
  object_key TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  bytes INTEGER NOT NULL,
  sha256 TEXT,
  content_type TEXT NOT NULL DEFAULT 'image/jpeg',
  PRIMARY KEY (photo_id, format),
  FOREIGN KEY (photo_id) REFERENCES photos(id)
);

CREATE TABLE IF NOT EXISTS licence_versions (
  version TEXT PRIMARY KEY,
  en_json TEXT NOT NULL,
  fr_json TEXT NOT NULL,
  current INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS removal_cases (
  id TEXT PRIMARY KEY,
  photo_id TEXT NOT NULL,
  requester_account_id TEXT NOT NULL,
  explanation TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'dismissed', 'withdrawn', 'duplicate')) DEFAULT 'pending',
  photo_version INTEGER NOT NULL,
  cross_channel_reviewed INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (photo_id) REFERENCES photos(id),
  FOREIGN KEY (requester_account_id) REFERENCES accounts(id)
);
CREATE INDEX IF NOT EXISTS removal_cases_queue_idx ON removal_cases(status, created_at);

CREATE TABLE IF NOT EXISTS removal_reports (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL,
  photo_id TEXT NOT NULL,
  requester_account_id TEXT NOT NULL,
  explanation TEXT NOT NULL,
  request_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'dismissed', 'withdrawn', 'duplicate')) DEFAULT 'pending',
  photo_version INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (case_id) REFERENCES removal_cases(id),
  FOREIGN KEY (photo_id) REFERENCES photos(id),
  FOREIGN KEY (requester_account_id) REFERENCES accounts(id),
  UNIQUE (photo_id, requester_account_id, request_id)
);
CREATE INDEX IF NOT EXISTS removal_reports_photo_idx ON removal_reports(photo_id, status);
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

CREATE TABLE IF NOT EXISTS notification_outbox (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('otp', 'removal')),
  payload_json TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  available_at INTEGER NOT NULL,
  locked_until INTEGER,
  sent_at INTEGER,
  last_error TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS outbox_due_idx ON notification_outbox(sent_at, available_at, locked_until);

CREATE TABLE IF NOT EXISTS moderation_audit (
  id TEXT PRIMARY KEY,
  actor_account_id TEXT NOT NULL,
  action TEXT NOT NULL,
  case_id TEXT,
  photo_id TEXT,
  reason TEXT,
  expected_version INTEGER,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (actor_account_id) REFERENCES accounts(id)
);

CREATE TABLE IF NOT EXISTS daily_aggregates (
  day TEXT NOT NULL,
  photo_id TEXT NOT NULL,
  opens INTEGER NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, photo_id),
  FOREIGN KEY (photo_id) REFERENCES photos(id)
);

CREATE TABLE IF NOT EXISTS album_visits (
  day TEXT PRIMARY KEY,
  visits INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS viewer_opens (
  account_id TEXT NOT NULL,
  photo_id TEXT NOT NULL,
  session_token_hash TEXT NOT NULL,
  opened_at INTEGER NOT NULL,
  PRIMARY KEY (account_id, photo_id, session_token_hash),
  FOREIGN KEY (account_id) REFERENCES accounts(id),
  FOREIGN KEY (photo_id) REFERENCES photos(id)
);

CREATE TABLE IF NOT EXISTS download_requests (
  request_id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  photo_id TEXT NOT NULL,
  photo_version INTEGER NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('full', 'quick')),
  created_at INTEGER NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id),
  FOREIGN KEY (photo_id) REFERENCES photos(id)
);
CREATE INDEX IF NOT EXISTS download_requests_retention_idx ON download_requests(created_at);
