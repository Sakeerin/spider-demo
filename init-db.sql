-- Initialize database with extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create additional databases for testing if needed
-- CREATE DATABASE spider_marketplace_test;