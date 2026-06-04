-- =========================================
-- HOTEL INVENTORY SYSTEM - DATABASE MIGRATION
-- Migration Date: 2026-06-02
-- =========================================
-- This script migrates from old structure to new structure:
-- 1. Creates new master tables (departments, locations, rooms)
-- 2. Modifies existing tables (staff, hardware, networking, security)
-- 3. Drops hospitality table
-- 4. Adds foreign key constraints
-- =========================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================
-- PHASE 1: CREATE NEW MASTER TABLES
-- =========================================

-- DEPARTMENTS
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LOCATIONS
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- e.g., 'OFFICE', 'SERVER_ROOM', 'LOBBY', 'STORAGE', etc.
    floor TEXT,
    building TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ROOMS
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_number TEXT UNIQUE NOT NULL,
    floor TEXT,
    room_type TEXT, -- e.g., 'STANDARD', 'DELUXE', 'SUITE', 'PRESIDENTIAL', etc.
    status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'MAINTENANCE', 'INACTIVE'
    capacity INTEGER,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- PHASE 2: MODIFY STAFF TABLE
-- =========================================

-- Add new column for department_id
ALTER TABLE staff
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id) ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_staff_department_id ON staff(department_id);

-- Drop old department column (will be done after data migration in production)
-- For now, we'll keep it commented out for safety
-- ALTER TABLE staff DROP COLUMN IF EXISTS department;

-- =========================================
-- PHASE 3: MODIFY HARDWARE TABLE
-- =========================================

-- Add new columns
ALTER TABLE hardware
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id) ON DELETE SET NULL;

ALTER TABLE hardware
ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES locations(id) ON DELETE SET NULL;

ALTER TABLE hardware
ADD COLUMN IF NOT EXISTS room_id UUID REFERENCES rooms(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_hardware_department_id ON hardware(department_id);
CREATE INDEX IF NOT EXISTS idx_hardware_location_id ON hardware(location_id);
CREATE INDEX IF NOT EXISTS idx_hardware_room_id ON hardware(room_id);

-- Add constraint: either room_id OR location_id, not both
ALTER TABLE hardware
DROP CONSTRAINT IF EXISTS chk_hardware_room_or_location;

ALTER TABLE hardware
ADD CONSTRAINT chk_hardware_room_or_location
CHECK (
    (room_id IS NOT NULL AND location_id IS NULL)
    OR
    (room_id IS NULL AND location_id IS NOT NULL)
    OR
    (room_id IS NULL AND location_id IS NULL)
);

-- Drop old location column (will be done after data migration in production)
-- ALTER TABLE hardware DROP COLUMN IF EXISTS location;

-- =========================================
-- PHASE 4: MODIFY NETWORKING TABLE
-- =========================================

-- Add new columns
ALTER TABLE networking
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id) ON DELETE SET NULL;

ALTER TABLE networking
ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES locations(id) ON DELETE SET NULL;

ALTER TABLE networking
ADD COLUMN IF NOT EXISTS room_id UUID REFERENCES rooms(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_networking_department_id ON networking(department_id);
CREATE INDEX IF NOT EXISTS idx_networking_location_id ON networking(location_id);
CREATE INDEX IF NOT EXISTS idx_networking_room_id ON networking(room_id);

-- Add constraint: either room_id OR location_id, not both
ALTER TABLE networking
DROP CONSTRAINT IF EXISTS chk_networking_room_or_location;

ALTER TABLE networking
ADD CONSTRAINT chk_networking_room_or_location
CHECK (
    (room_id IS NOT NULL AND location_id IS NULL)
    OR
    (room_id IS NULL AND location_id IS NOT NULL)
    OR
    (room_id IS NULL AND location_id IS NULL)
);

-- Drop old location column (will be done after data migration in production)
-- ALTER TABLE networking DROP COLUMN IF EXISTS location;

-- =========================================
-- PHASE 5: MODIFY SECURITY TABLE
-- =========================================

-- Add new columns
ALTER TABLE security
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id) ON DELETE SET NULL;

ALTER TABLE security
ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES locations(id) ON DELETE SET NULL;

ALTER TABLE security
ADD COLUMN IF NOT EXISTS room_id UUID REFERENCES rooms(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_department_id ON security(department_id);
CREATE INDEX IF NOT EXISTS idx_security_location_id ON security(location_id);
CREATE INDEX IF NOT EXISTS idx_security_room_id ON security(room_id);

-- Add constraint: either room_id OR location_id, not both
ALTER TABLE security
DROP CONSTRAINT IF EXISTS chk_security_room_or_location;

ALTER TABLE security
ADD CONSTRAINT chk_security_room_or_location
CHECK (
    (room_id IS NOT NULL AND location_id IS NULL)
    OR
    (room_id IS NULL AND location_id IS NOT NULL)
    OR
    (room_id IS NULL AND location_id IS NULL)
);

-- Drop old location column (will be done after data migration in production)
-- ALTER TABLE security DROP COLUMN IF EXISTS location;

-- =========================================
-- PHASE 6: DROP HOSPITALITY TABLE
-- =========================================

-- Drop hospitality table
DROP TABLE IF EXISTS hospitality CASCADE;

-- =========================================
-- PHASE 7: INSERT SAMPLE MASTER DATA (OPTIONAL)
-- =========================================

-- Sample Departments
INSERT INTO departments (name, description) VALUES
('IT', 'Information Technology and Systems'),
('Front Office', 'Guest Services and Reception'),
('Housekeeping', 'Room Cleaning and Maintenance'),
('Food & Beverage', 'Restaurant and Bar Services'),
('Engineering', 'Building Maintenance and Facilities'),
('Security', 'Safety and Security Operations'),
('Human Resources', 'HR and Administration'),
('Finance & Accounting', 'Financial Management'),
('Sales & Marketing', 'Business Development')
ON CONFLICT (name) DO NOTHING;

-- Sample Locations
INSERT INTO locations (name, type, floor, description) VALUES
('Lobby', 'PUBLIC', 'Ground Floor', 'Main hotel lobby area'),
('Server Room', 'TECHNICAL', 'Basement', 'Main IT server room'),
('MDF Room', 'TECHNICAL', 'Basement', 'Main Distribution Frame'),
('IDF Room RPV', 'TECHNICAL', 'River Pool Villa Area', 'Intermediate Distribution Frame'),
('IDF Room Floor 1', 'TECHNICAL', '1st Floor', 'Intermediate Distribution Frame'),
('IDF Room Floor 2', 'TECHNICAL', '2nd Floor', 'Intermediate Distribution Frame'),
('IDF Room Floor 3', 'TECHNICAL', '3nd Floor', 'Intermediate Distribution Frame'),
('Back Office', 'OFFICE', 'Ground Floor', 'Administrative offices'),
('Security Office', 'OFFICE', 'Ground Floor', 'Security operations center'),
('POMEC Office', 'OFFICE', 'Ground Floor', 'POMEC department office'),
('Storage Room', 'STORAGE', 'Basement', 'Equipment storage'),
('Restaurant', 'PUBLIC', '5th Floor', 'Main dining area and restaurant outlet'),
('Gym / Fitness Center', 'PUBLIC', 'Outdoor Area', 'Guest fitness and gym area'),
('Yoga Pavilion', 'PUBLIC', '5th Floor', 'Open-air pavilion for yoga and wellness activities'),
('Pool Bar', 'PUBLIC', '4th Floor', 'Bar and beverage service area near the main pool')
ON CONFLICT (name) DO NOTHING;

-- Sample Rooms (Guest Rooms)
INSERT INTO rooms (room_number, floor, room_type, status, capacity) VALUES
('711', '1st Floor', 'Valley Suite', 'ACTIVE', 2),
('712', '1st Floor', 'Valley Suite', 'ACTIVE', 2),
('715', '1st Floor', 'Valley Suite', 'ACTIVE', 2),
('716', '1st Floor', 'Valley Suite', 'ACTIVE', 2),
('721', '2nd Floor', 'Valley Twin', 'ACTIVE', 2),
('722', '2nd Floor', 'Valley Suite', 'ACTIVE', 2),
('723', '2nd Floor', 'Valley Suite', 'ACTIVE', 2),
('724', '2nd Floor', 'Valley Suite', 'ACTIVE', 2),
('725', '2nd Floor', 'Valley Suite', 'ACTIVE', 2),
('731', '3rd Floor', 'Valley Twin', 'ACTIVE', 2),
('732', '3rd Floor', 'Valley Suite', 'ACTIVE', 2),
('733', '3rd Floor', 'Valley Suite', 'ACTIVE', 2),
('734', '3rd Floor', 'Valley Suite', 'ACTIVE', 2),
('735', '3rd Floor', 'Valley Suite', 'ACTIVE', 2),
('801', '4th Floor', 'Suite Spa Bath', 'ACTIVE', 2),
('802', '4th Floor', 'Suite Spa Bath', 'ACTIVE', 2),
('803', '4th Floor', 'Suite Spa Bath', 'ACTIVE', 2),
('804', '4th Floor', 'Suite Spa Bath', 'ACTIVE', 2),
('805', '4th Floor', 'Suite Spa Bath', 'ACTIVE', 2),
('806', '4th Floor', 'Suite Spa Bath', 'ACTIVE', 2),
('901', '5th Floor', 'Suite Pool Villa', 'ACTIVE', 2),
('902', '5th Floor', 'Suite Pool Villa', 'ACTIVE', 2),
('903', '5th Floor', 'Suite Pool Villa', 'ACTIVE', 2),
('904', '5th Floor', 'Suite Pool Villa', 'ACTIVE', 2),
('905', '5th Floor', 'Suite Pool Villa', 'ACTIVE', 2),
('Yamuna', 'River Area', 'River Pool Villa', 'ACTIVE', 2),
('Gangga', 'River Area', 'River Pool Villa', 'ACTIVE', 2),
('Kaveri', 'River Area', 'River Pool Villa', 'ACTIVE', 2),
('Serayu', 'River Area', 'River Pool Villa', 'ACTIVE', 2),
('Nirwana', 'River Area', 'Royal Suite With Spa Bath', 'ACTIVE', 2),
ON CONFLICT (room_number) DO NOTHING;

-- =========================================
-- MIGRATION COMPLETE
-- =========================================

-- Summary of changes:
-- ✅ Created departments table
-- ✅ Created locations table
-- ✅ Created rooms table
-- ✅ Modified staff table (added department_id)
-- ✅ Modified hardware table (added department_id, location_id, room_id)
-- ✅ Modified networking table (added department_id, location_id, room_id)
-- ✅ Modified security table (added department_id, location_id, room_id)
-- ✅ Dropped hospitality table
-- ✅ Added sample master data

-- Note: Old columns (department, location) are NOT dropped yet for safety.
-- You can drop them manually after verifying the migration:
-- ALTER TABLE staff DROP COLUMN department;
-- ALTER TABLE hardware DROP COLUMN location;
-- ALTER TABLE networking DROP COLUMN location;
-- ALTER TABLE security DROP COLUMN location;