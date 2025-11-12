-- Enable crypto/random UUIDs for Postgres 13+
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- USERS table (owned by Auth teammate, included here for e2e demo)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('student','admin')),
  valid_meal_plan BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS meal_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  dietary_tags TEXT[] NOT NULL DEFAULT '{}',
  is_available BOOLEAN NOT NULL DEFAULT true,
  ingredient_cost_cents INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS meal_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serve_date DATE NOT NULL,
  meal_option_id UUID NOT NULL REFERENCES meal_options(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_meal_schedule_date ON meal_schedule(serve_date);
CREATE INDEX IF NOT EXISTS idx_meal_schedule_meal ON meal_schedule(meal_option_id);

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('PENDING','CONFIRMED','CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_schedule_id UUID NOT NULL REFERENCES meal_schedule(id) ON DELETE RESTRICT,
  status booking_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_per_day UNIQUE (user_id, meal_schedule_id)
);
