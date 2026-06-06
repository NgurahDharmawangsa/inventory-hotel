-- Migration: Add description column to hardware table
-- Run this in Supabase SQL Editor (https://supabase.com → SQL Editor)

ALTER TABLE hardware 
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT NULL;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'hardware' 
ORDER BY ordinal_position;