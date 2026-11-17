# Pembagian Tanggung Jawab Tim – Frontend vs Backend

Meskipun sistem dibangun dalam repositori monolitik Next.js yang terpadu, batas tanggung jawab teknis antara **Tim Frontend** dan **Tim Backend** didefinisikan secara tegas untuk mencegah tumpang tindih dan memfasilitasi pengembangan paralel.

---

## 1. Ringkasan Matriks Tanggung Jawab

| Area Fungsional | Tim Frontend | Tim Backend |
|---|:---:|:---:|
| **App Routing & Dynamic Pages** | ✅ Penanggung Jawab Utama | ❌ Konsumsi & Review |
| **UI Components & Styling (Bootstrap 5)** | ✅ Penanggung Jawab Utama | ❌ Tidak Terlibat |
| **Client-Side Form Validation (Zod UX)** | ✅ Penanggung Jawab Utama | ⚠️ Kolaborasi Kontrak Schema |
| **Server Actions & Mutation Orchestration** | ⚠️ Konsumsi Signature Action | ✅ Penanggung Jawab Utama |
| **Supabase Query & Data Access Layer** | ❌ Tidak Diperbolehkan Langsung | ✅ Penanggung Jawab Utama |
| **Row Level Security (RLS) & DB Policies** | ❌ Tidak Terlibat | ✅ Penanggung Jawab Utama |
| **File Storage & Bucket Access Rules** | ⚠️ Upload Form Trigger | ✅ Upload Handler & Bucket Policy |
| **PDF & Excel Document Generation** | ⚠️ Tombol Cetak / Tampilan UI | ✅ Engine Generator & Template |
| **Audit Log Trail (activity_logs)** | ❌ Otomatis di Server Action | ✅ Penanggung Jawab Utama |

---

## 2. Tanggung Jawab Rinci Tim Frontend

1. **Routing & Antarmuka Halaman (`src/app/`)**:
   - Membangun struktur layout, halaman rute dinamis, navigasi sidebar, breadcrumbs, dan modal dialog.
   - Mengelola visual state: loading spinners, skeleton screen, alert notifikasi sukses/error, dan empty state.

2. **Komponen UI Bersama (`src/components/`)**:
   - Memastikan penggunaan class Bootstrap 5 secara konsisten, responsif pada perangkat mobile dan desktop.
   - Mengembangkan komponen formulir reusable (`FormInput`, `FormSelect`, `Modal`, `Table`, `Badge`).

3. **Validasi & Interaksi Klien**:
   - Mengikat event formulir dengan skema Zod untuk memberikan umpan balik instan saat input tidak valid.
   - Memanggil Server Actions yang disediakan oleh Tim Backend dan menangani rendering responsnya.

---

## 3. Tanggung Jawab Rinci Tim Backend

1. **Server Actions & Business Logic (`src/features/*/actions/`)**:
   - Menerima input dari formulir klien, melakukan otentikasi session, dan re-validasi payload menggunakan Zod.
   - Melakukan pengecekan otorisasi berbasis peran (RBAC) sebelum mutasi dieksekusi.
   - Memformat return data ke dalam interface standar `ActionResponse<T>`.

2. **Supabase Integration & Services (`src/features/*/services/`, `src/lib/supabase/`)**:
   - Mengelola client server (`createClient()`) berbasis cookies dan client admin (`createAdminClient()`).
   - Menyusun query PostgreSQL efisien (join, pagination, filter) melalui library `@supabase/supabase-js`.

3. **Database Security & Migrations (`supabase/migrations/`)**:
   - Merancang DDL tabel, constraint foreign key, indexing, dan trigger `updated_at`.
   - Mengimplementasikan kebijakan Row Level Security (RLS) pada seluruh tabel database.

4. **Storage & Dokumen Resmi**:
   - Mengelola bucket storage (`documents`, `warta`, `avatars`).
   - Mengimplementasikan pembuatan dokumen otomatis (PDF piagam sakramen, warta, laporan keuangan Excel).

---

## 4. Titik Temu & Kontrak Kerja Bersama (Interface Contract)

Pengembangan paralel dilakukan dengan mematuhi dua kontrak utama:
1. **Schema Validasi Zod (`src/features/*/validations/`)**:
   - Dibuat bersama pada awal sprint. Frontend menggunakannya untuk form hook, Backend menggunakannya untuk parse payload di Server Action.
2. **Standard Action Response (`src/types/common.types.ts`)**:
   ```typescript
   export interface ActionResponse<T = unknown> {
     success: boolean;
     message: string;
     data?: T;
     errors?: Record<string, string[]>;
   }
   ```
   Frontend cukup mengecek `res.success` untuk menampilkan notifikasi atau menandai error field formulir.
