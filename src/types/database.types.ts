// =========================================
// MASTER DATA TYPES
// =========================================

export type Department = {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export type Location = {
  id: string;
  name: string;
  type: string;
  floor?: string;
  building?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export type Room = {
  id: string;
  room_number: string;
  floor?: string;
  room_type?: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  capacity?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

// =========================================
// MAIN TYPES
// =========================================

export type Staff = {
  id: string;
  employee_id: string;
  full_name: string;
  department_id?: string;
  position: string;
  status: 'ACTIVE' | 'RESIGNED' | 'ON LEAVE';
  created_at?: string;
  updated_at?: string;
};

export type StaffWithRelations = Staff & {
  department?: {
    id: string;
    name: string;
  } | null;
};

export type StaffDetail = StaffWithRelations & {
  hardware: Hardware[];
  software: Software[];
  emails: EmailAccount[];
};

export type Vendor = {
  id: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
};

export type EmailAccount = {
  id: string;
  email_address: string;
  platform: string;
  staff_id?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  created_at?: string;
  updated_at?: string;
};

export type Hardware = {
  id: string;
  item_code?: string;
  name: string;
  category: string;
  department_id?: string;
  location_id?: string;
  room_id?: string;
  status: 'ACTIVE' | 'BROKEN' | 'REPAIR' | 'DISPOSED';
  staff_id?: string;
  vendor_id?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export type Software = {
  id: string;
  item_code?: string;
  name: string;
  license_key?: string;
  expiration_date?: string;
  staff_id?: string;
  vendor_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type Networking = {
  id: string;
  item_code?: string;
  device_type: string;
  ip_address?: string;
  department_id?: string;
  location_id?: string;
  room_id?: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  vendor_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type Security = {
  id: string;
  item_code?: string;
  device_type: string;
  department_id?: string;
  location_id?: string;
  room_id?: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  vendor_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type Maintenance = {
  id: string;
  item_id: string;
  item_type: string;
  issue: string;
  repair_cost?: number;
  date_reported?: string;
  date_resolved?: string;
  created_at?: string;
  updated_at?: string;
};

export type Budget = {
  id: string;
  year: number;
  total_allocated: number;
  total_spent: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};