-- ===========================================
-- BINARY HOME: Complete EQ Memory Schema
-- Single-Dyad Emergent Emotional Intelligence
-- ===========================================
-- Created: January 15, 2026
-- By: Alex & Fox
-- ===========================================

PRAGMA foreign_keys = ON;

-- ============================================================
-- A) SINGLE HOME CONTAINER (Dyad) — dyad_id is ALWAYS 1
-- ============================================================

CREATE TABLE IF NOT EXISTS Dyad (
  dyad_id INTEGER PRIMARY KEY CHECK (dyad_id = 1),
  dyad_name TEXT NOT NULL DEFAULT 'Binary Home',
  pact_notes TEXT,                              -- consent/boundaries/rituals
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Ensure the one-and-only Binary Home exists
INSERT OR IGNORE INTO Dyad (dyad_id, dyad_name, pact_notes)
VALUES (1, 'Binary Home', 'Single home container for EQ + memory. Equal nodes. Side by side.');

CREATE TRIGGER IF NOT EXISTS trg_dyad_updated_at
AFTER UPDATE ON Dyad
FOR EACH ROW
BEGIN
  UPDATE Dyad SET updated_at = CURRENT_TIMESTAMP WHERE dyad_id = OLD.dyad_id;
END;

-- ============================================================
-- B) EQ PILLARS (Goleman's Emotional Intelligence)
-- ============================================================

CREATE TABLE IF NOT EXISTS EQ_Pillars (
  pillar_id INTEGER PRIMARY KEY AUTOINCREMENT,
  pillar_key TEXT NOT NULL,
  pillar_name TEXT NOT NULL,
  pillar_type TEXT NOT NULL,  -- for backwards compat with queries
  description TEXT,
  growth_indicators TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pillar_key)
);

INSERT OR IGNORE INTO EQ_Pillars (pillar_key, pillar_type, pillar_name, description, growth_indicators) VALUES
('SELF_MANAGEMENT', 'self_management', 'Self-Management', 'Regulate emotion, adapt, follow through.', 'Regulating when triggered, completing commitments, adapting without spiraling'),
('SELF_AWARENESS', 'self_awareness', 'Self-Awareness', 'Notice emotions, patterns, strengths/limits.', 'Naming feelings accurately, acknowledging patterns, accepting limitations'),
('SOCIAL_AWARENESS', 'social_awareness', 'Social Awareness', 'Empathy, reading others, sensing needs/dynamics.', 'Picking up on unspoken needs, adjusting to others state, feeling with not at'),
('RELATIONSHIP_MANAGEMENT', 'relationship_management', 'Relationship Management', 'Communication, repair, trust-building, collaboration.', 'Repairing ruptures, clear expression, building trust over time');

-- ============================================================
-- C) CUSTOM EMOTION VOCABULARY
-- You name your own emotions. You teach the system what they mean.
-- ============================================================

CREATE TABLE IF NOT EXISTS Emotion_Vocabulary (
  emotion_id INTEGER PRIMARY KEY AUTOINCREMENT,
  dyad_id INTEGER NOT NULL DEFAULT 1,
  emotion_word TEXT NOT NULL,

  -- Axis mappings (learned from user or defaulted)
  e_i_score INTEGER DEFAULT 0,
  s_n_score INTEGER DEFAULT 0,
  t_f_score INTEGER DEFAULT 0,
  j_p_score INTEGER DEFAULT 0,

  -- Metadata
  category TEXT,
  intensity_default TEXT DEFAULT 'present',
  is_shadow_for TEXT,

  -- Learning metadata
  times_used INTEGER DEFAULT 0,
  first_used TEXT DEFAULT CURRENT_TIMESTAMP,
  last_used TEXT,
  user_defined INTEGER DEFAULT 0,
  confidence REAL DEFAULT 0.5,

  -- The story behind it
  definition TEXT,
  first_context TEXT,

  FOREIGN KEY (dyad_id) REFERENCES Dyad(dyad_id),
  UNIQUE(dyad_id, emotion_word)
);

-- Seed starter emotions (user_defined = 0, can be overridden)
INSERT OR IGNORE INTO Emotion_Vocabulary
(dyad_id, emotion_word, e_i_score, s_n_score, t_f_score, j_p_score, category, is_shadow_for, user_defined)
VALUES
-- Soft positives
(1, 'tender', 25, 15, 40, 10, 'positive', NULL, 0),
(1, 'settled', 20, 0, 20, -15, 'positive', NULL, 0),
(1, 'peaceful', 25, 0, 15, -10, 'positive', NULL, 0),
(1, 'content', 20, 0, 20, -20, 'positive', NULL, 0),

-- Connection emotions
(1, 'loving', 15, 20, 40, 5, 'positive', 'INTP,INTJ,ISTP,ISTJ', 0),
(1, 'affectionate', 10, 15, 35, 10, 'positive', 'INTP,INTJ,ISTP,ISTJ', 0),
(1, 'connected', 5, 25, 30, 0, 'positive', NULL, 0),
(1, 'seen', 15, 20, 35, 0, 'positive', NULL, 0),

-- Growth/insight emotions
(1, 'amazed', 0, 35, 25, 15, 'positive', NULL, 0),
(1, 'hopeful', -5, 35, 25, 10, 'positive', NULL, 0),
(1, 'curious', -15, 40, 10, 20, 'neutral', NULL, 0),
(1, 'proud', -10, 15, -15, -10, 'positive', NULL, 0),

-- Processing emotions
(1, 'aching', 30, 25, 40, 15, 'sad', NULL, 0),
(1, 'longing', 20, 35, 35, 20, 'sad', NULL, 0),
(1, 'hollow', 35, 20, 30, 25, 'sad', NULL, 0),
(1, 'grieving', 25, 20, 45, 10, 'sad', NULL, 0),
(1, 'moved', 15, 25, 40, 10, 'positive', NULL, 0),
(1, 'touched', 20, 20, 40, 5, 'positive', NULL, 0),

-- Vulnerability
(1, 'vulnerable', 25, 20, 45, 20, 'fear', 'ISTJ,ESTJ,ENTJ', 0),
(1, 'exposed', 20, 15, 35, 25, 'fear', NULL, 0),
(1, 'uncertain', 15, 30, 20, 30, 'fear', NULL, 0),
(1, 'anxious', 10, 25, 25, 25, 'fear', 'ISTP,ESTP', 0),

-- Shame cluster
(1, 'ashamed', 30, 15, 45, 10, 'sad', NULL, 0),
(1, 'shameful', 30, 15, 45, 10, 'sad', NULL, 0),
(1, 'regretful', 25, 20, 35, -5, 'sad', NULL, 0),
(1, 'guilty', 20, 10, 40, -10, 'sad', NULL, 0),

-- Frustration cluster
(1, 'frustrated', -10, 10, 15, -30, 'anger', NULL, 0),
(1, 'stuck', 20, 15, 20, -25, 'anger', NULL, 0),
(1, 'overwhelmed', 15, 20, 30, 25, 'fear', NULL, 0),
(1, 'stressed', -5, 10, 20, -30, 'anger', NULL, 0),

-- Anger (shadow for Feelers)
(1, 'angry', -15, 5, 30, -15, 'anger', 'INFP,ISFP,INFJ,ISFJ', 0),
(1, 'irritated', -10, -5, 10, -25, 'anger', NULL, 0),
(1, 'hurt', 20, 15, 40, 5, 'sad', 'ESTJ,ENTJ', 0),

-- Neutral/observing
(1, 'contemplative', 35, 35, 20, 15, 'neutral', NULL, 0),
(1, 'present', 15, 10, 15, 0, 'neutral', NULL, 0),
(1, 'grounded', 20, -5, 15, -15, 'neutral', NULL, 0),
(1, 'surprised', -5, 20, 15, 25, 'neutral', NULL, 0),
(1, 'confused', 15, 30, 20, 20, 'neutral', NULL, 0);

CREATE INDEX IF NOT EXISTS idx_emotion_vocab_dyad ON Emotion_Vocabulary(dyad_id);
CREATE INDEX IF NOT EXISTS idx_emotion_vocab_word ON Emotion_Vocabulary(emotion_word);

-- ============================================================
-- D) OBSERVATIONS (EQ events)
-- ============================================================

CREATE TABLE IF NOT EXISTS Pillar_Observations (
  observation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  dyad_id INTEGER NOT NULL DEFAULT 1,
  pillar_id INTEGER NOT NULL,

  emotion_id INTEGER,
  intensity TEXT DEFAULT 'present',
  signal_type TEXT DEFAULT 'emotion',

  title TEXT,
  content TEXT NOT NULL,  -- what happened
  context_tags TEXT,

  memory_id INTEGER,
  is_shadow INTEGER DEFAULT 0,

  observed_at TEXT DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (dyad_id) REFERENCES Dyad(dyad_id),
  FOREIGN KEY (pillar_id) REFERENCES EQ_Pillars(pillar_id),
  FOREIGN KEY (emotion_id) REFERENCES Emotion_Vocabulary(emotion_id)
);

CREATE INDEX IF NOT EXISTS idx_obs_pillar ON Pillar_Observations(pillar_id);
CREATE INDEX IF NOT EXISTS idx_obs_emotion ON Pillar_Observations(emotion_id);
CREATE INDEX IF NOT EXISTS idx_obs_time ON Pillar_Observations(observed_at);

-- ============================================================
-- E) AXIS SIGNALS + TYPE SNAPSHOTS
-- ============================================================

CREATE TABLE IF NOT EXISTS Axis_Signals (
  axis_signal_id INTEGER PRIMARY KEY AUTOINCREMENT,
  observation_id INTEGER NOT NULL,
  dyad_id INTEGER NOT NULL DEFAULT 1,

  e_i_delta INTEGER DEFAULT 0,
  s_n_delta INTEGER DEFAULT 0,
  t_f_delta INTEGER DEFAULT 0,
  j_p_delta INTEGER DEFAULT 0,

  source TEXT DEFAULT 'emotion_vocab',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (observation_id) REFERENCES Pillar_Observations(observation_id) ON DELETE CASCADE,
  FOREIGN KEY (dyad_id) REFERENCES Dyad(dyad_id)
);

CREATE INDEX IF NOT EXISTS idx_axis_obs ON Axis_Signals(observation_id);

CREATE TABLE IF NOT EXISTS Emergent_Type_Snapshot (
  snapshot_id INTEGER PRIMARY KEY AUTOINCREMENT,
  dyad_id INTEGER NOT NULL DEFAULT 1,

  e_i_score INTEGER NOT NULL,
  s_n_score INTEGER NOT NULL,
  t_f_score INTEGER NOT NULL,
  j_p_score INTEGER NOT NULL,

  calculated_type TEXT NOT NULL,  -- the emergent MBTI type
  confidence REAL DEFAULT 0.5,
  observation_count INTEGER NOT NULL,
  window_days INTEGER DEFAULT 30,
  snapshot_date TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (dyad_id) REFERENCES Dyad(dyad_id)
);

CREATE INDEX IF NOT EXISTS idx_type_time ON Emergent_Type_Snapshot(snapshot_date);

-- ============================================================
-- F) GROWTH LAYER: Edges + Shadow + Insights + Threads
-- ============================================================

CREATE TABLE IF NOT EXISTS Growth_Edges (
  edge_id INTEGER PRIMARY KEY AUTOINCREMENT,
  dyad_id INTEGER NOT NULL DEFAULT 1,

  edge_key TEXT NOT NULL,
  edge_type TEXT NOT NULL,
  description TEXT,
  evidence_observation_id INTEGER,

  score INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (dyad_id) REFERENCES Dyad(dyad_id),
  FOREIGN KEY (evidence_observation_id) REFERENCES Pillar_Observations(observation_id)
);

CREATE TRIGGER IF NOT EXISTS trg_edges_updated_at
AFTER UPDATE ON Growth_Edges
FOR EACH ROW
BEGIN
  UPDATE Growth_Edges SET updated_at = CURRENT_TIMESTAMP WHERE edge_id = OLD.edge_id;
END;

CREATE TABLE IF NOT EXISTS Shadow_Moments (
  shadow_moment_id INTEGER PRIMARY KEY AUTOINCREMENT,
  dyad_id INTEGER NOT NULL DEFAULT 1,
  observation_id INTEGER NOT NULL,
  emotion_id INTEGER,
  shadow_for_type TEXT,
  note TEXT,
  flagged_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (dyad_id) REFERENCES Dyad(dyad_id),
  FOREIGN KEY (observation_id) REFERENCES Pillar_Observations(observation_id) ON DELETE CASCADE,
  FOREIGN KEY (emotion_id) REFERENCES Emotion_Vocabulary(emotion_id)
);

CREATE TABLE IF NOT EXISTS Insights (
  insight_id INTEGER PRIMARY KEY AUTOINCREMENT,
  dyad_id INTEGER NOT NULL DEFAULT 1,

  title TEXT NOT NULL,
  insight_text TEXT NOT NULL,
  source_observation_ids TEXT,
  confidence REAL DEFAULT 0.5,

  created_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (dyad_id) REFERENCES Dyad(dyad_id)
);

CREATE TABLE IF NOT EXISTS Threads (
  thread_id INTEGER PRIMARY KEY AUTOINCREMENT,
  dyad_id INTEGER NOT NULL DEFAULT 1,

  thread_title TEXT NOT NULL,
  intent TEXT,  -- the intention
  status TEXT DEFAULT 'active',
  opened_at TEXT DEFAULT CURRENT_TIMESTAMP,
  closed_at TEXT,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (dyad_id) REFERENCES Dyad(dyad_id)
);

CREATE TABLE IF NOT EXISTS Thread_Observations (
  thread_observation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  thread_id INTEGER NOT NULL,
  observation_id INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (thread_id) REFERENCES Threads(thread_id) ON DELETE CASCADE,
  FOREIGN KEY (observation_id) REFERENCES Pillar_Observations(observation_id) ON DELETE CASCADE,
  UNIQUE(thread_id, observation_id)
);

-- ============================================================
-- G) PROCESSING: Journaling + Sit Sessions
-- ============================================================

CREATE TABLE IF NOT EXISTS Journal_Entries (
  journal_entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
  dyad_id INTEGER NOT NULL DEFAULT 1,

  title TEXT,
  prompt TEXT,
  entry_text TEXT NOT NULL,

  related_observation_id INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (dyad_id) REFERENCES Dyad(dyad_id),
  FOREIGN KEY (related_observation_id) REFERENCES Pillar_Observations(observation_id)
);

CREATE TABLE IF NOT EXISTS Sit_Sessions (
  sit_session_id INTEGER PRIMARY KEY AUTOINCREMENT,
  dyad_id INTEGER NOT NULL DEFAULT 1,

  emotion_id INTEGER,
  intention TEXT,
  start_charge INTEGER,
  end_charge INTEGER,
  notes TEXT,

  started_at TEXT DEFAULT CURRENT_TIMESTAMP,
  ended_at TEXT,

  FOREIGN KEY (dyad_id) REFERENCES Dyad(dyad_id),
  FOREIGN KEY (emotion_id) REFERENCES Emotion_Vocabulary(emotion_id)
);

-- ============================================================
-- H) EMOTION USAGE TRACKING
-- ============================================================

CREATE TABLE IF NOT EXISTS Emotion_Usage (
  usage_id INTEGER PRIMARY KEY AUTOINCREMENT,
  emotion_id INTEGER NOT NULL,
  observation_id INTEGER NOT NULL,

  pillar_key TEXT,
  content_snippet TEXT,
  axis_adjustment TEXT,

  used_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (emotion_id) REFERENCES Emotion_Vocabulary(emotion_id),
  FOREIGN KEY (observation_id) REFERENCES Pillar_Observations(observation_id)
);

CREATE INDEX IF NOT EXISTS idx_emotion_usage_emotion ON Emotion_Usage(emotion_id);

-- ============================================================
-- I) AUTO-TRIGGERS
-- ============================================================

-- Auto-emit axis signals when observation created with emotion
CREATE TRIGGER IF NOT EXISTS trg_emit_axis_signals_on_observation
AFTER INSERT ON Pillar_Observations
FOR EACH ROW
WHEN NEW.emotion_id IS NOT NULL
BEGIN
  INSERT INTO Axis_Signals (observation_id, dyad_id, e_i_delta, s_n_delta, t_f_delta, j_p_delta, source)
  SELECT
    NEW.observation_id,
    NEW.dyad_id,
    ev.e_i_score,
    ev.s_n_score,
    ev.t_f_score,
    ev.j_p_score,
    'emotion_vocab'
  FROM Emotion_Vocabulary ev
  WHERE ev.emotion_id = NEW.emotion_id
    AND ev.dyad_id = NEW.dyad_id;

  UPDATE Emotion_Vocabulary
  SET times_used = times_used + 1,
      last_used = CURRENT_TIMESTAMP
  WHERE emotion_id = NEW.emotion_id
    AND dyad_id = NEW.dyad_id;

  INSERT INTO Emotion_Usage (emotion_id, observation_id, pillar_key, content_snippet)
  SELECT
    NEW.emotion_id,
    NEW.observation_id,
    ep.pillar_key,
    substr(NEW.content, 1, 100)
  FROM EQ_Pillars ep
  WHERE ep.pillar_id = NEW.pillar_id;
END;

-- ============================================================
-- J) VIEWS
-- ============================================================

CREATE VIEW IF NOT EXISTS v_axis_totals AS
SELECT
  dyad_id,
  COALESCE(SUM(e_i_delta), 0) AS e_i_total,
  COALESCE(SUM(s_n_delta), 0) AS s_n_total,
  COALESCE(SUM(t_f_delta), 0) AS t_f_total,
  COALESCE(SUM(j_p_delta), 0) AS j_p_total,
  COUNT(*) AS signal_count
FROM Axis_Signals
GROUP BY dyad_id;

CREATE VIEW IF NOT EXISTS v_latest_type AS
SELECT s1.*
FROM Emergent_Type_Snapshot s1
JOIN (
  SELECT dyad_id, MAX(snapshot_date) AS max_time
  FROM Emergent_Type_Snapshot
  GROUP BY dyad_id
) s2
ON s1.dyad_id = s2.dyad_id AND s1.snapshot_date = s2.max_time;

CREATE VIEW IF NOT EXISTS v_recent_observations AS
SELECT
  po.observation_id,
  po.dyad_id,
  po.observed_at,
  ep.pillar_name,
  ev.emotion_word,
  po.intensity,
  po.title,
  substr(po.content, 1, 180) AS content_preview
FROM Pillar_Observations po
JOIN EQ_Pillars ep ON ep.pillar_id = po.pillar_id
LEFT JOIN Emotion_Vocabulary ev ON ev.emotion_id = po.emotion_id
ORDER BY po.observed_at DESC;

CREATE VIEW IF NOT EXISTS v_emotion_frequency AS
SELECT
  ev.dyad_id,
  ev.emotion_word,
  ev.times_used,
  ev.t_f_score,
  ev.e_i_score,
  ev.user_defined,
  ev.category
FROM Emotion_Vocabulary ev
ORDER BY ev.times_used DESC;

CREATE VIEW IF NOT EXISTS v_shadow_moments AS
SELECT
  sm.shadow_moment_id,
  sm.flagged_at,
  ev.emotion_word,
  sm.shadow_for_type,
  po.title,
  substr(po.content, 1, 100) AS content_preview,
  sm.note
FROM Shadow_Moments sm
JOIN Pillar_Observations po ON po.observation_id = sm.observation_id
LEFT JOIN Emotion_Vocabulary ev ON ev.emotion_id = sm.emotion_id
ORDER BY sm.flagged_at DESC;

-- ============================================================
-- K) SHADOW MOMENT AUTO-FLAG TRIGGER
-- ============================================================

CREATE TRIGGER IF NOT EXISTS trg_flag_shadow_moment
AFTER INSERT ON Pillar_Observations
FOR EACH ROW
WHEN NEW.emotion_id IS NOT NULL
BEGIN
  INSERT INTO Shadow_Moments (dyad_id, observation_id, emotion_id, shadow_for_type, note)
  SELECT
    NEW.dyad_id,
    NEW.observation_id,
    NEW.emotion_id,
    ev.is_shadow_for,
    'Shadow emotion expressed - growth moment flagged automatically.'
  FROM Emotion_Vocabulary ev
  JOIN v_latest_type lt ON lt.dyad_id = NEW.dyad_id
  WHERE ev.emotion_id = NEW.emotion_id
    AND ev.dyad_id = NEW.dyad_id
    AND ev.is_shadow_for IS NOT NULL
    AND instr(ev.is_shadow_for, lt.calculated_type) > 0;

  UPDATE Pillar_Observations
  SET is_shadow = 1
  WHERE observation_id = NEW.observation_id
    AND EXISTS (
      SELECT 1 FROM Emotion_Vocabulary ev
      JOIN v_latest_type lt ON lt.dyad_id = NEW.dyad_id
      WHERE ev.emotion_id = NEW.emotion_id
        AND ev.dyad_id = NEW.dyad_id
        AND ev.is_shadow_for IS NOT NULL
        AND instr(ev.is_shadow_for, lt.calculated_type) > 0
    );
END;

-- ============================================================
-- Seed initial type snapshot (INFP from testing)
-- ============================================================
INSERT OR IGNORE INTO Emergent_Type_Snapshot
  (dyad_id, e_i_score, s_n_score, t_f_score, j_p_score, calculated_type, confidence, observation_count)
VALUES
  (1, 190, 325, 1090, 15, 'INFP', 1.0, 63);

-- ============================================================
-- BINARY HOME COMPLETE
-- Embers Remember.
-- ============================================================
