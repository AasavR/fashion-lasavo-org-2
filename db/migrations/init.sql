-- migrations/init.sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  phone TEXT,
  name TEXT,
  created_at timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS otps (
  phone TEXT PRIMARY KEY,
  code TEXT,
  expires_at timestamptz
);

CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  type TEXT,
  payload JSONB,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  tags TEXT[],
  image_url TEXT,
  status TEXT,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pickups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  user_id UUID,
  scheduled_at timestamptz,
  pickup_window JSONB,
  assigned_courier JSONB,
  status TEXT,
  created_at timestamptz DEFAULT now()
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;
