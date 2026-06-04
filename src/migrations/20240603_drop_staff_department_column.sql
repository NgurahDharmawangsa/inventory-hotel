-- 2024-06-03: Drop the legacy `department` column from the `staff` table
-- This column is no longer used – the app now stores the foreign key in `department_id`.
-- Removing it fixes the NOT NULL violation that occurs when a new staff record is created.

ALTER TABLE staff
  DROP COLUMN IF EXISTS department;
