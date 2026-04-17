-- Enable pgvector on fresh database initialization.
-- Runs once when the Postgres volume is first created.
CREATE EXTENSION IF NOT EXISTS vector;
