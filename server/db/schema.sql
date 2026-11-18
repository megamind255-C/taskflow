-- ============================================================
-- TaskFlow — Database Schema
-- Run with: psql -U taskflow_user -d taskflow_db -f schema.sql
-- ============================================================

-- Drop the trigger/function if they already exist (safe re-run)
DROP TRIGGER IF EXISTS set_updated_at ON tasks;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop the table if it exists (safe re-run for learning)
DROP TABLE IF EXISTS tasks;

-- ------------------------------------------------------------
-- Table: tasks
-- ------------------------------------------------------------
CREATE TABLE tasks (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL CHECK (length(trim(title)) > 0),
    description TEXT,
    priority    VARCHAR(10)  NOT NULL DEFAULT 'Medium'
                CHECK (priority IN ('Low', 'Medium', 'High')),
    status      VARCHAR(15)  NOT NULL DEFAULT 'Pending'
                CHECK (status IN ('Pending', 'In Progress', 'Completed')),
    due_date    DATE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Trigger: auto-refresh updated_at on UPDATE
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------
-- Helpful indexes (optional but professional)
-- ------------------------------------------------------------
CREATE INDEX idx_tasks_status   ON tasks (status);
CREATE INDEX idx_tasks_priority ON tasks (priority);
CREATE INDEX idx_tasks_created  ON tasks (created_at DESC);

-- ------------------------------------------------------------
-- Optional seed rows (comment out if you don't want them)
-- ------------------------------------------------------------
INSERT INTO tasks (title, description, priority, status, due_date)
VALUES
  ('Buy groceries',      'Milk, eggs, bread, coffee beans',      'Medium', 'Pending',     CURRENT_DATE + 1),
  ('Finish project PRD', 'Phase 1–3 documentation for TaskFlow', 'High',   'In Progress', CURRENT_DATE + 3),
  ('Morning workout',    '30 min cardio',                        'Low',    'Completed',   CURRENT_DATE);