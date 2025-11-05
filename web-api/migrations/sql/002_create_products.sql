CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
