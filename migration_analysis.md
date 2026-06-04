# Analisis Migrasi Database - Hotel Inventory System

## Executive Summary

**FEASIBILITY: ✅ MEMUNGKINKAN dengan perencanaan yang matang**

Migrasi struktur database yang Anda rencanakan **sangat memungkinkan** untuk diimplementasikan. Namun, ini adalah perubahan struktural yang signifikan yang memerlukan:

1. **Database Migration Script** yang terstruktur
2. **Data Migration** untuk memindahkan data existing
3. **Code Refactoring** di beberapa bagian aplikasi
4. **Testing** yang komprehensif

---

## 1. DAMPAK PERUBAHAN DATABASE

### 1.1 Tabel yang Dihapus
- ❌ **hospitality** - Akan dihapus sepenuhnya

### 1.2 Tabel Master Baru
- ✅ **departments** - Menggantikan kolom `department` (TEXT) di tabel `staff`
- ✅ **locations** - Menggantikan kolom `location` (TEXT) di `hardware`, `networking`, `security`
- ✅ **rooms** - Menggantikan data `room_number` dari tabel `hospitality`

### 1.3 Perubahan Struktur Tabel Existing

#### **staff**
- ➖ DROP: `department` (TEXT)
- ➕ ADD: `department_id` (UUID → FK ke `departments`)

#### **hardware**
- ➖ DROP: `location` (TEXT)
- ➕ ADD: `department_id` (UUID → FK ke `departments`)
- ➕ ADD: `location_id` (UUID → FK ke `locations`)
- ➕ ADD: `room_id` (UUID → FK ke `rooms`)
- ➕ ADD: CONSTRAINT untuk validasi (hanya boleh room ATAU location, tidak keduanya)

#### **networking**
- ➖ DROP: `location` (TEXT)
- ➕ ADD: `department_id` (UUID → FK ke `departments`)
- ➕ ADD: `location_id` (UUID → FK ke `locations`)
- ➕ ADD: `room_id` (UUID → FK ke `rooms`)
- ➕ ADD: CONSTRAINT untuk validasi

#### **security**
- ➖ DROP: `location` (TEXT)
- ➕ ADD: `department_id` (UUID → FK ke `departments`)
- ➕ ADD: `location_id` (UUID → FK ke `locations`)
- ➕ ADD: `room_id` (UUID → FK ke `rooms`)
- ➕ ADD: CONSTRAINT untuk validasi

---

## 2. ANALISIS KODE APLIKASI YANG TERPENGARUH

### 2.1 Fitur yang PALING Terpengaruh

#### **HOSPITALITY Module** (COMPLETE REMOVAL)
**Files yang harus dihapus:**
- ❌ `src/app/(dashboard)/hospitality/page.tsx` (253 lines)
- ❌ `src/features/hospitality/hospitality-table.tsx`
- ❌ `src/features/hospitality/hospitality-form.tsx`
- ❌ `src/features/hospitality/hospitality-skeleton.tsx`
- ❌ `src/repositories/hospitality.repository.ts`
- ❌ `src/services/hospitality.service.ts`
- ❌ `src/validators/hospitality.validator.ts`
- ❌ `src/app/actions/hospitality.ts`

**Files yang harus diupdate:**
- 🔧 `src/constants/nav-items.ts` - Hapus menu "hospitality"
- 🔧 `src/app/actions/dashboard.ts` - Hapus hospitality stats
- 🔧 `src/app/actions/maintenance.ts` - Hapus hospitality dari asset types
- 🔧 `src/features/maintenance/maintenance-form.tsx` - Hapus HOSPITALITY option

**Impact:** **HIGH** - Penghapusan complete module

---

### 2.2 STAFF Module - Department Migration

**Files yang harus diubah:**
- 🔧 `src/features/staff/staff-form.tsx` - Ubah input text menjadi dropdown/select dari master departments
- 🔧 `src/features/staff/staff-table.tsx` - Tampilkan `department.name` dari relasi
- 🔧 `src/repositories/staff.repository.ts` - Join dengan tabel departments
- 🔧 `src/validators/staff.validator.ts` - Validasi department_id (UUID), bukan TEXT
- 🔧 `src/types/database.types.ts` - Update type `Staff` dan `StaffWithRelations`

**Impact:** **MEDIUM** - Perubahan dari text input ke relational dropdown

---

### 2.3 HARDWARE Module - Location & Room Migration

**Files yang harus diubah:**
- 🔧 `src/features/hardware/hardware-form.tsx` - 3 dropdown baru: department, location, room
- 🔧 `src/features/hardware/hardware-table.tsx` - Tampilkan name dari relasi
- 🔧 `src/app/(dashboard)/hardware/page.tsx` - Fetch departments, locations, rooms untuk filter
- 🔧 `src/repositories/hardware.repository.ts` - Join dengan 3 tabel baru
- 🔧 `src/services/hardware.service.ts` - Update business logic
- 🔧 `src/validators/hardware.validator.ts` - Validasi UUID, bukan TEXT
- 🔧 `src/types/database.types.ts` - Update type definitions
- 🔧 `src/app/actions/hardware.ts` - Update actions untuk fetch master data

**Impact:** **HIGH** - Perubahan struktur location dari text ke relational + tambahan fields

---

### 2.4 NETWORKING Module - Location & Room Migration

**Files yang harus diubah:**
- 🔧 `src/features/networking/networking-form.tsx` - 3 dropdown baru
- 🔧 `src/features/networking/networking-table.tsx` - Tampilkan dari relasi
- 🔧 `src/app/(dashboard)/networking/page.tsx` - Fetch master data
- 🔧 `src/repositories/networking.repository.ts` - Join tables
- 🔧 `src/validators/networking.validator.ts` - Validasi UUID
- 🔧 `src/types/database.types.ts` - Update types

**Impact:** **HIGH** - Sama seperti hardware

---

### 2.5 SECURITY Module - Location & Room Migration

**Files yang harus diubah:**
- 🔧 `src/features/security/security-form.tsx` - 3 dropdown baru
- 🔧 `src/features/security/security-table.tsx` - Tampilkan dari relasi
- 🔧 `src/app/(dashboard)/security/page.tsx` - Fetch master data
- 🔧 `src/repositories/security.repository.ts` - Join tables
- 🔧 `src/validators/security.validator.ts` - Validasi UUID
- 🔧 `src/types/database.types.ts` - Update types

**Impact:** **HIGH** - Sama seperti hardware dan networking

---

### 2.6 SOFTWARE Module - Minimal Impact

**Files yang mungkin terpengaruh:**
- 🔧 `src/features/software/software-table.tsx` - Tampilkan `staff.department.name` (nested relation)
- 🔧 `src/features/software/software-form.tsx` - Tampilkan `staff.department.name` di dropdown

**Impact:** **LOW** - Hanya tampilan, tidak ada perubahan struktur

---

### 2.7 EMAILS Module - Minimal Impact

**Files yang mungkin terpengaruh:**
- 🔧 `src/features/emails/email-form.tsx` - Tampilkan `staff.department.name` di dropdown
- 🔧 `src/repositories/email.repository.ts` - Join nested relation

**Impact:** **LOW** - Hanya tampilan

---

### 2.8 Master Data Management (NEW)

**Files yang HARUS dibuat:**
- ✅ `src/app/(dashboard)/departments/page.tsx` - CRUD departments
- ✅ `src/app/(dashboard)/locations/page.tsx` - CRUD locations
- ✅ `src/app/(dashboard)/rooms/page.tsx` - CRUD rooms
- ✅ `src/features/departments/*` - Components
- ✅ `src/features/locations/*` - Components
- ✅ `src/features/rooms/*` - Components
- ✅ `src/repositories/departments.repository.ts`
- ✅ `src/repositories/locations.repository.ts`
- ✅ `src/repositories/rooms.repository.ts`
- ✅ `src/services/departments.service.ts`
- ✅ `src/services/locations.service.ts`
- ✅ `src/services/rooms.service.ts`
- ✅ `src/validators/departments.validator.ts`
- ✅ `src/validators/locations.validator.ts`
- ✅ `src/validators/rooms.validator.ts`
- ✅ `src/app/actions/departments.ts`
- ✅ `src/app/actions/locations.ts`
- ✅ `src/app/actions/rooms.ts`

**Impact:** **HIGH** - Penambahan 3 complete modules baru

---

## 3. REKOMENDASI STRATEGI MIGRASI

### 3.1 Safe Migration Path (RECOMMENDED)

```
PHASE 1: Preparation
├── Backup production database
├── Create migration script dengan rollback plan
└── Test di development environment

PHASE 2: Create New Tables
├── Create departments table
├── Create locations table  
└── Create rooms table

PHASE 3: Data Migration
├── Migrate distinct departments from staff.department → departments table
├── Migrate distinct locations from hardware/networking/security → locations table
├── Migrate room_number + device_type from hospitality → rooms table (OPTIONAL)
└── Keep original columns temporarily (DON'T DROP YET)

PHASE 4: Add Foreign Keys
├── Add department_id to staff (populate from departments)
├── Add department_id, location_id, room_id to hardware
├── Add department_id, location_id, room_id to networking
└── Add department_id, location_id, room_id to security

PHASE 5: Code Migration
├── Create master data management modules (departments, locations, rooms)
├── Update all affected components and repositories
├── Update validators and types
└── Delete hospitality module completely

PHASE 6: Testing
├── Test all CRUD operations
├── Test search and filters
├── Test relations and joins
└── Test constraints

PHASE 7: Cleanup
├── Drop old columns (department, location)
├── Drop hospitality table
└── Update database schema documentation

PHASE 8: Deploy
├── Run migration on production
└── Monitor for issues
```

---

### 3.2 Alternative: Big Bang Migration (RISKY)

Jalankan semua perubahan sekaligus. **TIDAK DIREKOMENDASIKAN** karena:
- High risk of data loss
- Sulit rollback jika ada masalah
- Downtime lebih lama
- Testing lebih kompleks

---

## 4. MIGRATION SCRIPT RECOMMENDATIONS

### 4.1 Data Migration untuk Departments

```sql
-- Extract unique departments
INSERT INTO departments (name)
SELECT DISTINCT department 
FROM staff 
WHERE department IS NOT NULL AND department != ''
ON CONFLICT (name) DO NOTHING;

-- Populate department_id in staff
UPDATE staff s
SET department_id = d.id
FROM departments d
WHERE s.department = d.name;
```

### 4.2 Data Migration untuk Locations

```sql
-- Extract unique locations from multiple tables
INSERT INTO locations (name, type)
SELECT DISTINCT location, 'GENERAL' as type
FROM (
  SELECT location FROM hardware WHERE location IS NOT NULL
  UNION
  SELECT location FROM networking WHERE location IS NOT NULL
  UNION
  SELECT location FROM security WHERE location IS NOT NULL
) AS combined_locations
ON CONFLICT (name) DO NOTHING;

-- Populate location_id in hardware
UPDATE hardware h
SET location_id = l.id
FROM locations l
WHERE h.location = l.name;

-- Repeat for networking and security
```

### 4.3 Data Migration untuk Rooms (from Hospitality)

```sql
-- Extract unique room numbers from hospitality
INSERT INTO rooms (room_number, room_type, status)
SELECT DISTINCT 
  room_number,
  'STANDARD' as room_type,
  CASE 
    WHEN status = 'ACTIVE' THEN 'ACTIVE'
    ELSE 'ACTIVE'
  END as status
FROM hospitality
WHERE room_number IS NOT NULL
ON CONFLICT (room_number) DO NOTHING;
```

---

## 5. ESTIMATED EFFORT

### Time Estimates

| Task | Estimated Time | Priority |
|------|---------------|----------|
| **Database Migration Script** | 4-6 hours | CRITICAL |
| **Data Migration & Testing** | 3-4 hours | CRITICAL |
| **Master Data Modules (3x)** | 12-16 hours | HIGH |
| **Staff Module Updates** | 2-3 hours | HIGH |
| **Hardware Module Updates** | 4-6 hours | HIGH |
| **Networking Module Updates** | 4-6 hours | HIGH |
| **Security Module Updates** | 4-6 hours | HIGH |
| **Software Module Updates** | 1-2 hours | MEDIUM |
| **Emails Module Updates** | 1-2 hours | MEDIUM |
| **Delete Hospitality Module** | 2-3 hours | HIGH |
| **Testing & Bug Fixes** | 8-12 hours | CRITICAL |
| **Documentation** | 2-3 hours | MEDIUM |

**TOTAL: 47-69 hours (6-9 working days)**

---

## 6. RISKS & MITIGATION

### Risks

1. **Data Loss** - Jika migration script salah
   - **Mitigation:** Backup database, test di development, dry-run migration

2. **Downtime** - Aplikasi tidak bisa diakses selama migration
   - **Mitigation:** Lakukan di jam off-peak, gunakan maintenance mode

3. **Breaking Changes** - Fitur existing rusak
   - **Mitigation:** Comprehensive testing, staged rollout

4. **Foreign Key Violations** - Data orphan atau invalid references
   - **Mitigation:** Data validation sebelum drop columns

5. **Loss of Hospitality Data** - Data perangkat hotel hilang
   - **Mitigation:** Migrate data hospitality ke rooms table atau hardware table sebelum drop

---

## 7. FINAL RECOMMENDATION

### ✅ GO AHEAD dengan catatan:

1. **Backup database production** sebelum apapun
2. **Test complete migration flow** di development environment
3. **Phase migration** - jangan langsung drop columns/tables
4. **Create rollback script** untuk emergency
5. **Coordinate with stakeholders** tentang potential downtime
6. **Consider keeping hospitality data** - migrate ke rooms atau create archive table

### ⚠️ CONSIDERATIONS:

**Hospitality Data:**
Sebelum drop tabel `hospitality`, pertimbangkan:
- Apakah data device_type dari hospitality perlu dipindah ke tabel lain?
- Apakah ada historical records yang perlu dipertahankan?
- Alternatif: Buat tabel `hospitality_archive` untuk data lama

**UI/UX Impact:**
- User perlu training untuk master data management
- Form input berubah dari free text ke dropdown
- Filter locations jadi lebih terstruktur

---

## 8. NEXT STEPS

Jika Anda setuju untuk proceed, saya bisa membantu:

1. ✅ Create complete migration SQL script dengan rollback plan
2. ✅ Generate semua boilerplate code untuk master data modules
3. ✅ Update semua affected files dengan proper TypeScript types
4. ✅ Create testing checklist
5. ✅ Setup master data seeding untuk development

**Apakah Anda ingin saya lanjutkan dengan implementasi?**