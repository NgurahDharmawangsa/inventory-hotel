# IT Inventory App Initialization Plan

This document outlines the step-by-step roadmap to build the modern IT Inventory App using Next.js, Tailwind CSS, Shadcn UI, and Supabase.

## User Review Required
> [!IMPORTANT]
> Sesuai permintaan Anda untuk tidak menulis kode terlebih dahulu, saya telah menyusun draf urutan langkah kerja (Roadmap) secara detail. Silakan tinjau tahapan di bawah ini. Jika Anda setuju, kita bisa mulai mengeksekusinya satu per satu.

## Proposed Phased Execution

### Phase 1: Project Bootstrap
- Menjalankan `npx create-next-app@latest` untuk menginisialisasi proyek Next.js dengan TypeScript, Tailwind CSS, dan App Router.
- Menjalankan `npx shadcn-ui@latest init` untuk mengatur fondasi sistem desain Shadcn UI.

### Phase 2: Folder Structure & Architecture
- Membangun struktur folder **Enterprise-Grade** yang telah disepakati (`src/features`, `src/services`, `src/repositories`, `src/validators`, dll).
- Merapikan file bawaan Next.js ke dalam struktur baru ini.

### Phase 3: Supabase Integration
- Menginstal *library* Supabase (`@supabase/supabase-js`).
- Membuat file konfigurasi di `src/lib/supabase.ts`.
- Menyiapkan file `.env.local` untuk menyimpan URL dan Key dari Supabase secara aman.

### Phase 4: Database Schema & Types
- Membuat definisi *TypeScript Interfaces* di `src/types/` berdasarkan struktur kategori lama Anda (Hardware, Software, Networking, dll).
- **Langkah Manual Anda:** Anda perlu membuat tabel di *Dashboard Supabase* yang sesuai dengan tipe data yang kita buat di kode.

### Phase 5: Global Layout & UI Base
- Membuat kerangka tampilan utama dashboard (`src/components/layout/sidebar.tsx` dan `topnav.tsx`).
- Memasang komponen UI dasar dari Shadcn (Button, Table, Form, Input).

### Phase 6: Modul Pertama (Hardware CRUD)
- Ini adalah inti pengembangan. Kita akan fokus menyelesaikan satu modul (Hardware) hingga tuntas (Create, Read, Update, Delete) menggunakan *Server Actions*.
- Membuat `HardwareRepository`, `HardwareService`, `HardwareTable`, dan `HardwareForm`.

### Phase 7: Ekspansi ke Modul Lain
- Setelah modul Hardware berhasil dan stabil, kita akan mereplikasi polanya untuk kategori lain: *Software, Networking, Hospitality, Security, Maintenance, dan Budget*.

## Open Questions
> [!NOTE]
> 1. Apakah Anda sudah memiliki akun dan proyek Supabase yang siap digunakan, atau Anda akan membuatnya nanti saat kita masuk ke Phase 3?
> 2. Apakah tahapan di atas sudah sesuai dengan ekspektasi Anda? Jika ya, beri tahu saya kapan Anda siap untuk memulai eksekusi **Phase 1**.
