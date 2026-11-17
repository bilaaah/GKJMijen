# Sistem Informasi Manajemen Gereja Kristen Jawa Mijen (SIM GKJ Mijen)

[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![Bootstrap](https://img.shields.io/badge/UI-Bootstrap%205-7952B3?style=flat&logo=bootstrap)](https://getbootstrap.com/)

---

## 1. Project Title
**Sistem Informasi Manajemen Gereja Kristen Jawa (SIM GKJ Mijen)**

---

## 2. Project Description
**SIM GKJ Mijen** merupakan sistem informasi berbasis web terpadu yang dirancang khusus untuk memodernisasi, mengotomatisasi, dan mengintegrasikan seluruh operasional administrasi, pelayanan pastoral jemaat, keuangan, persuratan, jadwal kegiatan, serta publikasi warta di lingkungan Gereja Kristen Jawa (GKJ) Mijen.

Aplikasi ini dibangun menggunakan arsitektur monolit modular modern dengan kerangka kerja **Next.js (App Router)** dan **TypeScript**, serta didukung oleh platform **Supabase** untuk basis data relasional PostgreSQL berstandar enterprise, autentikasi terpusat (Supabase Auth), dan media penyimpanan berkas digital (Supabase Storage). Antarmuka pengguna dirancang responsif dan konsisten menggunakan kerangka kerja **Bootstrap 5**.

---

## 3. Project Objectives
1. **Sentralisasi Data Jemaat**: Mengintegrasikan basis data sensus warga jemaat, riwayat keluarga, blok wilayah, serta arsip sakramen (baptis, sidi, dan pernikahan) secara akurat dan real-time.
2. **Efisiensi Layanan Surat & Dokumen**: Mempercepat proses permohonan surat gerejawi oleh warga jemaat dan pengarsipan surat resmi secara digital.
3. **Transparansi & Akuntabilitas Keuangan**: Menyediakan pencatatan pembukuan kas operasional dan rekonsiliasi penghitungan persembahan ibadah yang rapi, transparan, dan terverifikasi.
4. **Koordinasi Pelayanan yang Terstruktur**: Memfasilitasi penjadwalan agenda komisi kerja dan penugasan petugas ibadah (pelayan firman, liturgos, pemusik) dengan sistem konfirmasi terpadu.
5. **Kemudahan Akses Informasi**: Menyediakan kanal distribusi warta jemaat mingguan dan pengumuman gerejawi yang dapat diakses dengan mudah oleh seluruh warga jemaat.
6. **Keamanan & Kontrol Akses Berbasis Peran**: Melindungi kerahasiaan data jemaat dan keuangan melalui penerapan Role-Based Access Control (RBAC) serta Row Level Security (RLS) pada level basis data.

---

## 4. Technology Stack

| Komponen | Teknologi | Keterangan |
|---|---|---|
| **Framework Utama** | Next.js (App Router) | Full-stack React Framework untuk Server-Side Rendering (SSR) & Server Actions |
| **Bahasa Pemrograman** | TypeScript | Type safety statis pada seluruh layer frontend dan backend |
| **Database Engine** | Supabase PostgreSQL | Basis data relasional dengan dukungan Row Level Security (RLS) |
| **Authentication** | Supabase Auth | Manajemen session, otentikasi JWT, dan login terproteksi cookie HTTP-only |
| **File Storage** | Supabase Storage | Penyimpanan dokumen surat, bukti transaksi, dan berkas PDF warta |
| **UI Framework** | Bootstrap 5 | Komponen tata letak, grid responsif, dan styling antarmuka sistem |
| **Validasi Skema** | Zod | Deklarasi skema validasi tipe data di sisi klien dan server |
| **Version Control** | Git & GitHub | Manajemen kode sumber dan kolaborasi tim pengembang |

---

## 5. System Modules

Sistem dibagi menjadi 6 (enam) kelompok modul utama yang saling terhubung:

### A. Data Jemaat (`src/features/jemaat/`)
- **Data Jemaat**: Manajemen profil lengkap anggota, nomor induk warga, kontak, dan status keanggotaan.
- **Data Keluarga**: Pengelolaan nomor Kartu Keluarga (KK) gereja, kepala keluarga, dan susunan anggota keluarga.
- **Data Wilayah**: Pemetaan jemaat berdasarkan blok/lingkungan wilayah pelayanan pastoral.
- **Riwayat Sakramen**: Pencatatan sakramen Baptis Anak, Baptis Dewasa, Peneguhan Sidi, dan Pernikahan Kudus.

### B. Layanan Surat dan Arsip (`src/features/surat-arsip/`)
- **Permohonan Surat**: Pengajuan surat pengantar, surat baptis/sidi, atau atestasi pindah secara online oleh jemaat.
- **Jenis Surat**: Master format dan template surat resmi gereja.
- **Pembuatan Surat**: Alur kerja verifikasi, persetujuan tata usaha/majelis, hingga penerbitan dokumen resmi.
- **Arsip Dokumen**: Repositori arsip surat keluar, surat masuk, dan dokumen hukum/sertifikat gereja.

### C. Keuangan (`src/features/keuangan/`)
- **Kategori Keuangan**: Master pos mata anggaran untuk penerimaan dan pengeluaran kas.
- **Penghitungan Persembahan**: Pencatatan fisik kantong merah, kantong hitam, dan persembahan khusus setiap kebaktian.
- **Transaksi Keuangan**: Pencatatan kas operasional berkala yang dilengkapi bukti transfer/kuitansi digital.
- **Laporan Keuangan**: Pembuatan rekapitulasi buku kas, laporan realisasi anggaran, dan neraca berkala.

### D. Jadwal dan Kegiatan (`src/features/jadwal-kegiatan/`)
- **Data Komisi**: Master komisi pelayanan gerejawi (Komisi Anak, Pemuda, Dewasa, Diakonia, dll.).
- **Anggota Komisi**: Struktur kepengurusan komisi dan periode masa jabatan.
- **Jadwal Kegiatan**: Kalender kegiatan ibadah minggu, persekutuan wilayah, rapat majelis, dan latihan musik.
- **Penugasan Petugas**: Penjadwalan petugas ibadah (pendeta/pengkhotbah, liturgos, lektor, organis, kantoria).

### E. Warta dan Pengumuman (`src/features/warta-pengumuman/`)
- **Warta Jemaat**: Penyusunan edisi warta jemaat mingguan, tema mingguan, dan leksionari Alkitab.
- **Pengumuman**: Siaran warta penting seputar kedukaan, pernikahan, atau imbauan majelis.
- **Publikasi Warta**: Manajemen status penerbitan (draft, publish, archive).
- **Arsip PDF Warta**: Repositori file PDF warta jemaat yang dapat diunduh langsung oleh warga.

### F. Pengguna dan Hak Akses (`src/features/pengguna-akses/`)
- **Roles (RBAC)**: Penetapan hak akses pengguna (`super_admin`, `pendeta`, `majelis`, `tata_usaha`, `bendahara`, `warga`).
- **Profiles**: Sinkronisasi data pengguna akun dengan data entitas jemaat fisik.
- **Log Aktivitas**: Audit trail rekam jejak setiap aksi mutasi data penting pada sistem.
- **Manajemen Hak Akses**: Pengaturan otorisasi menu navigasi dan proteksi Server Actions.

---

## 6. Project Folder Structure

Struktur direktori proyek dirancang dengan pendekatan modular berbasis domain fitur:

```text
sim-gkj-mijen/
├── .env.example                       # Contoh konfigurasi environment variables
├── .gitignore                          # Daftar file dan direktori yang diabaikan oleh Git
├── next.config.mjs                    # Konfigurasi Next.js
├── package.json                       # Manifes dependensi dan script proyek
├── tsconfig.json                      # Konfigurasi TypeScript dan path alias (@/*)
├── README.md                          # Dokumentasi utama proyek
│
├── docs/                              # Dokumentasi teknis komprehensif
│   ├── api-and-actions-guide.md       # Panduan Server Actions dan API Route
│   ├── architecture.md                # Desain dan diagram arsitektur sistem
│   ├── coding-standards.md            # Standar konvensi kode dan penamaan
│   ├── database-design.md             # Desain ERD dan kamus basis data PostgreSQL
│   ├── modules-breakdown.md           # Rincian 6 modul fungsional sistem
│   └── team-responsibilities.md       # Pembagian peran kerja Tim Frontend vs Backend
│
├── public/                            # Berkas statis publik
│   ├── docs/                          # Dokumen publik statis
│   ├── images/                        # Aset grafis, logo gereja, dan placeholder
│   └── favicon.ico
│
├── supabase/                          # Konfigurasi basis data & migrasi Supabase
│   ├── config.toml                    # Konfigurasi lokal Supabase CLI
│   ├── migrations/                    # Skrip migrasi DDL database PostgreSQL
│   │   ├── 20261117000001_initial_schema.sql
│   │   └── 20261117000002_row_level_security.sql
│   └── seeds/                         # Data awal / master seed
│       └── seed.sql
│
└── src/                               # Kode sumber aplikasi (Source Code)
    ├── middleware.ts                  # Middleware Next.js untuk refresh session Supabase
    │
    ├── app/                           # Routing Next.js (App Router)
    │   ├── layout.tsx                 # Root layout aplikasi (Bootstrap 5 & metadata)
    │   ├── page.tsx                   # Landing page / halaman depan
    │   ├── loading.tsx                # Global loading state
    │   ├── error.tsx                  # Global error boundary
    │   ├── not-found.tsx              # Halaman 404
    │   │
    │   ├── (auth)/                    # Route Group: Autentikasi Pengguna
    │   │   ├── layout.tsx
    │   │   ├── login/page.tsx
    │   │   └── forgot-password/page.tsx
    │   │
    │   ├── (dashboard)/               # Route Group: Area Terproteksi Pengguna / Admin
    │   │   ├── layout.tsx             # Dashboard layout (Header, Sidebar, Content, Footer)
    │   │   ├── page.tsx               # Halaman utama ringkasan dashboard
    │   │   ├── jemaat/                # Rute Modul Data Jemaat (keluarga, wilayah, sakramen)
    │   │   ├── surat-arsip/           # Rute Modul Layanan Surat & Pengarsipan
    │   │   ├── keuangan/              # Rute Modul Transaksi & Laporan Keuangan
    │   │   ├── jadwal-kegiatan/       # Rute Modul Komisi & Jadwal Kebaktian
    │   │   ├── warta-pengumuman/      # Rute Modul Warta Mingguan & Informasi
    │   │   └── pengguna-akses/        # Rute Modul Akun Pengguna, Roles & Audit Trail
    │   │
    │   └── api/                       # Route Handlers untuk integrasi API / Webhook
    │       └── webhooks/route.ts
    │
    ├── components/                    # Komponen UI bersama (Reusable Components)
    │   ├── common/                    # Komponen atomik (Button, Modal, Table, Badge)
    │   ├── feedback/                  # Komponen umpan balik (LoadingSpinner, Alert, EmptyState)
    │   ├── forms/                     # Komponen input form (FormInput, FormSelect)
    │   └── layouts/                   # Komponen tata letak (Header, Sidebar, Footer)
    │
    ├── features/                      # Domain Feature Modules (6 Modul Utama)
    │   ├── jemaat/                    # Modul A: Data Jemaat
    │   │   ├── actions/               # Server Actions mutasi data
    │   │   ├── components/            # Komponen visual khusus domain
    │   │   ├── hooks/                 # Custom React hooks khusus domain
    │   │   ├── services/              # Query data access layer Supabase
    │   │   ├── types/                 # Interface dan tipe data TypeScript domain
    │   │   ├── validations/           # Skema validasi Zod
    │   │   └── index.ts               # Barrel export modul
    │   │
    │   ├── surat-arsip/               # Modul B: Layanan Surat dan Arsip
    │   ├── keuangan/                  # Modul C: Keuangan Gereja
    │   ├── jadwal-kegiatan/           # Modul D: Jadwal dan Kegiatan
    │   ├── warta-pengumuman/          # Modul E: Warta dan Pengumuman
    │   └── pengguna-akses/            # Modul F: Pengguna dan Hak Akses
    │
    ├── hooks/                         # Shared React custom hooks (useDebounce, usePagination, useModal)
    ├── lib/                           # Integrasi pustaka eksternal & konfigurasi
    │   ├── auth/                      # Matriks Role dan Permission (RBAC)
    │   ├── constants/                 # Konstanta rute URL dan konfigurasi aplikasi
    │   └── supabase/                  # Instance Supabase client (browser, server, middleware)
    ├── types/                         # Definisi tipe global TypeScript (Database, Common, Auth)
    └── utils/                         # Fungsi helper (formatters, validators, storage helper)
```

---

## 7. Architecture Overview

Arsitektur aplikasi dibangun di atas prinsip **Feature-Driven Architecture** dengan pemisahan lapisan (layering) yang tegas:

1. **Client / UI Layer**:
   Dibangun dengan Next.js Client Components dan Bootstrap 5. Bertugas mengelola interaksi formulir, state lokal antarmuka, dan memberikan umpan balik visual secara cepat.
2. **Server Runtime Layer (Next.js Server Actions)**:
   Bertindak sebagai Application Controller & Business Logic Layer. Menerima payload formulir, melakukan verifikasi session otentikasi, validasi data menggunakan Zod, serta memanggil Data Access Service.
3. **Data Access & Security Layer (Supabase PostgreSQL)**:
   Seluruh interaksi data tunduk pada kebijakan **Row Level Security (RLS)**. Akses data oleh pengguna hanya dimungkinkan jika diizinkan oleh aturan otorisasi berbasis peran (RBAC) yang terpasang pada skema basis data.

Detail arsitektur dan diagram alur data dapat dipelajari pada [docs/architecture.md](file:///d:/GKJ_WEB/docs/architecture.md).

---

## 8. Frontend and Backend Responsibilities

Meskipun Frontend dan Backend berada dalam satu repositori monolitik Next.js, pembagian tanggung jawab didefinisikan secara tegas:

### Tanggung Jawab Tim Frontend:
- Penyusunan rute dan struktur navigasi halaman (`src/app/`).
- Desain antarmuka pengguna berbasis Bootstrap 5 yang responsif dan konsisten.
- Pembuatan dan pemeliharaan komponen UI reusable (`src/components/`).
- Pengelolaan state formulir dan validasi interaktif di sisi klien (UX) menggunakan Zod.
- Integrasi konsumsi data dari Server Actions dan penanganan status visual (loading, alert error, modal konfirmasi).

### Tanggung Jawab Tim Backend:
- Implementasi Server Actions dan alur logika bisnis (`src/features/*/actions/`).
- Pengelolaan koneksi dan query basis data Supabase (`src/features/*/services/`, `src/lib/supabase/`).
- Perancangan dan migrasi skema tabel PostgreSQL (`supabase/migrations/`).
- Penerapan aturan keamanan basis data melalui Row Level Security (RLS).
- Manajemen otentikasi session, otorisasi peran (RBAC), dan pencatatan audit trail (`activity_logs`).
- Pengelolaan file storage Supabase dan modul pembuatan dokumen resmi (PDF/Excel).

Panduan lengkap mengenai pembagian kerja tim dapat dibaca pada [docs/team-responsibilities.md](file:///d:/GKJ_WEB/docs/team-responsibilities.md).

---

## 9. Database Overview

Basis data SIM GKJ Mijen menggunakan PostgreSQL 15 yang di-host pada Supabase. Basis data mencakup 17 tabel yang dikelompokkan sesuai 6 domain modul:

- **Otorisasi & Akun**: `roles`, `profiles`, `activity_logs`.
- **Kependudukan Gerejawi**: `wilayah`, `keluarga`, `jemaat`, `riwayat_sakramen`.
- **Persuratan & Dokumen**: `jenis_surat`, `permohonan_surat`, `arsip_dokumen`.
- **Keuangan**: `kategori_keuangan`, `transaksi_keuangan`, `penghitungan_persembahan`.
- **Kegiatan & Pelayanan**: `komisi`, `anggota_komisi`, `jadwal_kegiatan`, `penugasan_petugas`.
- **Informasi Jemaat**: `warta_jemaat`, `pengumuman`.

Detail skema relasional, indeks, dan diagram ERD dapat dipelajari pada [docs/database-design.md](file:///d:/GKJ_WEB/docs/database-design.md).

---

## 10. Supabase Integration

Integrasi Supabase diimplementasikan melalui paket resmi `@supabase/ssr` dan `@supabase/supabase-js` dengan tiga jenis client:

1. **Browser Client (`src/lib/supabase/client.ts`)**:
   Digunakan di Client Component jika diperlukan interaksi langsung dari peramban web dengan batasan RLS aktif.
2. **Server Client (`src/lib/supabase/server.ts`)**:
   Digunakan pada Server Components, Server Actions, dan Route Handlers. Mengakses token JWT sesi pengguna melalui cookie HTTP-only yang aman.
3. **Admin Client (`createAdminClient()`)**:
   Menggunakan `SUPABASE_SERVICE_ROLE_KEY` khusus untuk proses backend internal / background tasks yang memerlukan bypass RLS. Tidak boleh diekspos ke sisi klien.
4. **Middleware Session Update (`src/lib/supabase/middleware.ts`)**:
   Memperbarui masa berlaku token autentikasi pada setiap navigasi rute dan mengarahkan pengguna yang belum login ke halaman login.

---

## 11. Environment Variables

Salin berkas `.env.example` menjadi `.env.local` pada root proyek:

```bash
cp .env.example .env.local
```

Berikut adalah daftar variabel lingkungan yang dibutuhkan:

```env
# ------------------------------------------------------------------------------
# 1. KONFIGURASI UMUM NEXT.JS
# ------------------------------------------------------------------------------
NEXT_PUBLIC_APP_NAME="SIM GKJ Mijen"
NEXT_PUBLIC_APP_DESCRIPTION="Sistem Informasi Manajemen Gereja Kristen Jawa Mijen"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ------------------------------------------------------------------------------
# 2. SUPABASE (CLIENT-SIDE)
# ------------------------------------------------------------------------------
# URL project instance Supabase Anda
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"

# Supabase Public Anonymous API Key (Aman diakses browser, dibatasi RLS)
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# ------------------------------------------------------------------------------
# 3. SUPABASE (SERVER-SIDE ONLY - RAHASIA)
# ------------------------------------------------------------------------------
# Service Role Key (BYPASS RLS - HANYA DI SERVER ACTIONS / BACKEND)
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# ------------------------------------------------------------------------------
# 4. KONFIGURASI STORAGE BUCKET
# ------------------------------------------------------------------------------
NEXT_PUBLIC_STORAGE_BUCKET_DOCS="documents"
NEXT_PUBLIC_STORAGE_BUCKET_WARTE="warta"
NEXT_PUBLIC_STORAGE_BUCKET_AVATARS="avatars"
```

> [!CAUTION]
> Jangan pernah melakukan commit file `.env.local` atau kredensial rahasia (`SUPABASE_SERVICE_ROLE_KEY`) ke repositori GitHub.

---

## 12. Installation and Setup

### Prasyarat Sistem:
- Node.js versi 18.18.0 atau versi 20+ LTS
- Package Manager: npm (atau pnpm / yarn)
- Akun Supabase aktif (atau Supabase CLI lokal terpasang)
- Git terpasang

### Langkah Instalasi:

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/[placeholder-org]/sim-gkj-mijen.git
   cd sim-gkj-mijen
   ```

2. **Instal Dependensi Proyek**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   Salin file `.env.example` ke `.env.local` dan lengkapi konfigurasi Supabase Anda:
   ```bash
   cp .env.example .env.local
   ```

4. **Inisialisasi Database Supabase (Opsional jika menggunakan Supabase CLI)**:
   ```bash
   # Menjalankan Supabase lokal
   npx supabase start

   # Menjalankan migrasi DDL dan seed data
   npx supabase db reset
   ```

5. **Generate TypeScript Types dari Database (Opsional)**:
   ```bash
   npm run supabase:gen-types
   ```

6. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka peramban web pada alamat [http://localhost:3000](http://localhost:3000).

---

## 13. Development Workflow

1. **Menjalankan Server Pengembangan**:
   ```bash
   npm run dev
   ```
2. **Pengecekan Tipe TypeScript**:
   Lakukan type-checking sebelum membuat pull request:
   ```bash
   npm run type-check
   ```
3. **Pengecekan Linter**:
   ```bash
   npm run lint
   ```
4. **Build Aplikasi**:
   Memverifikasi bahwa proses kompilasi produksi berhasil:
   ```bash
   npm run build
   ```

---

## 14. Git Branching and Collaboration Guidelines

Untuk menjaga integritas dan stabilitas kode, tim pengembang wajib mematuhi standar branching berikut:

### Struktur Cabang (Branches):
- **`main`**: Cabang produksi yang siap deploy. Hanya menerima merge dari `staging` melalui Pull Request (PR) yang telah disetujui.
- **`staging` / `develop`**: Cabang integrasi seluruh fitur yang sedang diuji.
- **Feature Branches**: Cabang khusus pengembangan fitur, dibuat dari `develop` dengan format penamaan:
  - `feat/jemaat-crud-form`
  - `feat/keuangan-persembahan`
  - `fix/surat-validation-bug`
  - `docs/update-architecture`

### Alur Kerja Pull Request (PR):
1. Pengembang membuat cabang baru sesuai fitur yang dikerjakan.
2. Lakukan commit secara berkala dengan pesan yang deskriptif mengikuti standar Conventional Commits:
   - `feat(jemaat): add form input validation for nomor induk`
   - `fix(keuangan): correct date formatting in transaction table`
   - `docs(readme): update environment variable documentation`
3. Pastikan `npm run type-check` dan `npm run lint` lolos tanpa error sebelum melakukan push.
4. Buat Pull Request ke cabang `develop`.
5. PR wajib direview minimal oleh 1 (satu) orang rekan tim sebelum di-merge.

---

## 15. Coding Conventions

- **Direktori**: Gunakan format `kebab-case` (contoh: `jadwal-kegiatan`, `pengguna-akses`).
- **Komponen React**: Gunakan `PascalCase` untuk nama file dan nama fungsi komponen (contoh: `JemaatTable.tsx`, `FormInput.tsx`).
- **File Utilitas / Hooks**: Gunakan `camelCase` (contoh: `formatters.ts`, `usePagination.ts`).
- **Server Actions**: Fungsi diawali kata kerja dan diakhiri kata `Action` (contoh: `createJemaatAction`).
- **Tabel & Kolom Basis Data**: Menggunakan `snake_case` (contoh: `nomor_induk`, `transaksi_keuangan`).
- **Path Alias**: Selalu gunakan alias `@/*` yang merujuk ke direktori `src/*`.

Panduan selengkapnya tercantum pada [docs/coding-standards.md](file:///d:/GKJ_WEB/docs/coding-standards.md).

---

*SIM GKJ Mijen – Membangun Pelayanan Gerejawi yang Rapi, Transparan, dan Akuntabel.*
