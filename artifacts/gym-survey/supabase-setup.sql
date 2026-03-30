-- Run this in your Supabase SQL Editor
-- Project Settings → SQL Editor → New Query

-- 1. Create the survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id                 BIGSERIAL PRIMARY KEY,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  gym_frequency      TEXT NOT NULL,
  experience_rating  TEXT NOT NULL,
  frustrations       TEXT[] NOT NULL DEFAULT '{}',
  frustrations_other TEXT,
  gym_time           TEXT NOT NULL,
  gym_anxiety        TEXT NOT NULL,
  biggest_challenge  TEXT NOT NULL,
  improvements       TEXT[] NOT NULL DEFAULT '{}'
);

-- 2. Enable Row Level Security
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- 3. Allow anyone to INSERT (anonymous survey submissions)
CREATE POLICY "Allow anonymous inserts"
  ON survey_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 4. Allow anyone to SELECT (for the aggregated results page)
CREATE POLICY "Allow anonymous reads"
  ON survey_responses
  FOR SELECT
  TO anon
  USING (true);
