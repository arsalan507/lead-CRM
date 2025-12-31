-- Migration: Add PIN authentication
-- Run this in Supabase SQL Editor to add PIN column to users table

-- Add PIN column to users table (stores bcrypt hashed PIN)
ALTER TABLE users ADD COLUMN IF NOT EXISTS pin_hash TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_phone_pin ON users(phone, pin_hash);

-- Note: We'll still keep OTP table for future use if needed
-- But primary authentication will be phone + PIN
