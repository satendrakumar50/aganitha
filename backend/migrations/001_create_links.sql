CREATE TABLE IF NOT EXISTS links (
id serial PRIMARY KEY,
code varchar(32) NOT NULL UNIQUE,
original_url text NOT NULL,
clicks integer NOT NULL DEFAULT 0,
created_at timestamptz NOT NULL DEFAULT now()
);