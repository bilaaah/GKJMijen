# SIM GKJ Mijen (Sistem Informasi Manajemen GKJ Mijen)

Aplikasi berbasis web untuk mengintegrasikan pengelolaan administrasi, sensus jemaat, pelayanan surat, keuangan, dan publikasi warta di lingkungan Gereja Kristen Jawa (GKJ) Mijen.

---

## 1. Deskripsi Proyek
**SIM GKJ Mijen** adalah sistem informasi manajemen gereja yang dirancang untuk mempermudah operasional pelayanan gerejawi secara digital, terintegrasi, dan transparan. Sistem ini memfasilitasi kebutuhan administrasi warga jemaat maupun pengurus gereja dalam satu platform web yang responsif.

---

## 2. Tujuan Aplikasi
1. Menyediakan basis data warga jemaat yang akurat, terpusat, dan mudah diperbarui.
2. Mempermudah warga jemaat dalam mengajukan permohonan surat gerejawi secara online.
3. Menciptakan transparansi dan akuntabilitas dalam pencatatan keuangan dan persembahan ibadah.
4. Mempermudah publikasi jadwal kegiatan ibadah dan distribusi warta jemaat mingguan.
5. Mendukung efisiensi koordinasi pelayanan antara Majelis/Pengurus Gereja dan Warga Jemaat.

---

## 3. Teknologi yang Digunakan
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Database & Backend Services**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
- **UI Framework**: [Bootstrap 5](https://getbootstrap.com/)
- **Version Control**: Git & GitHub

---

## 4. Modul Sistem & Hak Akses

### Empat Modul Utama:
1. **Data Jemaat (`features/jemaat`)**: Pencatatan biodata warga jemaat, status keanggotaan, dan data keluarga.
2. **Layanan Surat (`features/surat`)**: Pengajuan permohonan surat (baptis, sidi, atestasi, dll.) dan pemantauan status proses surat.
3. **Keuangan (`features/keuangan`)**: Pencatatan kas pemasukan, pengeluaran operasional, dan penghitungan persembahan ibadah.
4. **Jadwal dan Warta (`features/jadwal-warta`)**: Jadwal kegiatan ibadah/rapat gereja dan arsip buletin warta jemaat (PDF).

### Dua Peran Pengguna (Roles):
- **Warga Jemaat**: Mengakses informasi jadwal & warta, melihat profil jemaat pribadi, dan mengajukan permohonan surat.
- **Pengurus Gereja**: Mengelola master data jemaat, memproses dan menyetujui permohonan surat, mencatat transaksi keuangan, serta mempublikasikan jadwal dan warta.

---

## 5. Struktur Folder Proyek

```text
sim-gkj-mijen/
├── .env.example              # Template variabel lingkungan Supabase
├── .gitignore                 # File yang diabaikan Git
├── next.config.mjs           # Konfigurasi Next.js
├── package.json              # Dependensi dan skrip proyek
├── tsconfig.json             # Konfigurasi TypeScript dan path alias (@/*)
├── README.md                 # Dokumentasi utama proyek
│
├── docs/                     # Dokumentasi teknis proyek
│   └── architecture.md       # Penjelasan arsitektur dan alur data
│
├── public/                   # Aset gambar dan berkas statis
│   ├── docs/
│   └── images/
│
├── supabase/                 # Kebutuhan skrip basis data Supabase
│   ├── schema.sql            # Skrip DDL tabel dan RLS 4 modul utama
│   └── seed.sql              # Data awal/sampel pengujian
│
└── src/                      # Kode sumber aplikasi
    ├── middleware.ts         # Middleware otentikasi sesi Supabase
    │
    ├── app/                  # Halaman dan routing Next.js (App Router)
    │   ├── layout.tsx        # Root layout (Bootstrap 5 CSS)
    │   ├── page.tsx          # Beranda awal sistem
    │   ├── (auth)/           # Halaman login & lupa password
    │   └── (dashboard)/      # Halaman area sistem terproteksi
    │       ├── layout.tsx    # Layout dashboard (Navbar, Sidebar, Content)
    │       ├── page.tsx      # Halaman utama ringkasan dashboard
    │       ├── jemaat/       # Halaman modul Data Jemaat
    │       ├── surat/        # Halaman modul Layanan Surat
    │       ├── keuangan/     # Halaman modul Keuangan
    │       └── jadwal-warta/ # Halaman modul Jadwal & Warta
    │
    ├── components/           # Komponen UI bersama (Reusable UI)
    │   ├── common/           # Button, Modal, Table, Badge
    │   ├── forms/            # FormInput, FormSelect
    │   ├── feedback/         # Alert, LoadingSpinner, EmptyState
    │   └── layouts/          # Header, Sidebar, Footer
    │
    ├── features/             # Pengelompokan 4 modul utama
    │   ├── jemaat/           # Modul 1: Data Jemaat (components, actions.ts, types.ts)
    │   ├── surat/            # Modul 2: Layanan Surat (components, actions.ts, types.ts)
    │   ├── keuangan/         # Modul 3: Keuangan (components, actions.ts, types.ts)
    │   └── jadwal-warta/     # Modul 4: Jadwal & Warta (components, actions.ts, types.ts)
    │
    ├── lib/                  # Konfigurasi Supabase & konstanta
    │   ├── supabase/         # Client (browser, server, middleware)
    │   ├── auth/             # Definisi 2 role pengguna (warga & pengurus)
    │   └── constants/        # Definisi rute navigasi aplikasi
    │
    ├── types/                # Definisi tipe global TypeScript
    └── utils/                # Fungsi pembantu (format tanggal, rupiah, dll.)
```

---

## 6. Penjelasan Fungsi Setiap Folder

- **`src/app/`**: Mengatur routing halaman web. Halaman di dalam `(dashboard)/` memuat rute untuk masing-masing modul.
- **`src/components/`**: Berisi komponen antarmuka umum (tombol, input formulir, modal, navbar, sidebar) berbasis Bootstrap 5.
- **`src/features/`**: Inti logika modular. Setiap modul mengisolasi komponen UI (`components/`), Server Actions (`actions.ts`), dan tipe data (`types.ts`).
- **`src/lib/`**: Konfigurasi koneksi Supabase (browser client dan server client dengan proteksi cookie) serta otorisasi role.
- **`src/types/`**: Kontrak data TypeScript untuk tabel database, sesi pengguna, dan pagination.
- **`src/utils/`**: Utilitas umum seperti pemformat mata uang Rupiah dan tanggal Indonesia.
- **`public/`**: Tempat menyimpan file statis seperti logo gereja dan favicon.
- **`supabase/`**: Menyimpan skrip SQL (`schema.sql` dan `seed.sql`) untuk konfigurasi database Supabase.
- **`docs/`**: Dokumentasi teknis arsitektur proyek.

---

## 7. Pembagian Tanggung Jawab Frontend dan Backend

Frontend dan Backend berada dalam satu repositori Next.js yang sama, dengan pemisahan tugas secara logis:

### Tim Frontend:
- Mengembangkan tampilan halaman di `src/app/`.
- Membangun layout dan navigasi (`Sidebar.tsx`, `Header.tsx`).
- Membuat komponen antarmuka yang dapat digunakan kembali di `src/components/`.
- Mengimplementasikan formulir dan tampilan data di `src/features/*/components/`.
- Menghubungkan form klien dengan Server Actions.

### Tim Backend:
- Mengonfigurasi dan mengelola integrasi Supabase di `src/lib/supabase/`.
- Mengimplementasikan logika Server Actions di `src/features/*/actions.ts`.
- Mengelola otentikasi Supabase Auth dan pembatasan hak akses 2 role (`warga` vs `pengurus`).
- Merancang dan menjalankan skema database PostgreSQL (`supabase/schema.sql`) serta Row Level Security (RLS).
- Mengelola bucket Supabase Storage (arsip warta PDF dan lampiran berkas).

---

## 8. Konfigurasi Environment Supabase

Salin file `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Isi dua variabel berikut sesuai project Supabase (Project Settings → API Keys):

```env
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_..."   # publishable key, aman di browser (dibatasi RLS)
```

- **Jangan** memakai secret / service_role key, dan **jangan** commit `.env.local`.
- Jika `.env.local` belum diisi, aplikasi berjalan dalam **mode demo** dengan data contoh.
- Skema database, data contoh, dan penjelasan backend lengkap: lihat [`docs/backend.md`](docs/backend.md).

---

## 9. Cara Instalasi dan Menjalankan Proyek

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/bilaaah/GKJMijen.git
   cd GKJMijen
   ```

2. **Beralih ke Branch `dev`**:
   ```bash
   git checkout dev
   ```

3. **Instal Dependensi**:
   ```bash
   npm install
   ```

4. **Siapkan Environment**:
   Salin `.env.example` ke `.env.local` dan masukkan kunci Supabase Anda.

5. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Akses aplikasi melalui browser di **[http://localhost:3000](http://localhost:3000)**.

6. **Pengecekan Tipe TypeScript**:
   ```bash
   npm run type-check
   ```

---

## 10. Panduan Kolaborasi GitHub

1. **Branch Utama**:
   - `main`: Branch produksi yang stabil.
   - `dev`: Branch utama pengembangan (*default working branch*). Seluruh anggota tim bekerja berbasis branch `dev`.
2. **Feature Branching**:
   Buat branch baru dari `dev` untuk setiap tugas baru:
   - Frontend: `git checkout -b feat/fe-jemaat-form dev`
   - Backend: `git checkout -b feat/be-surat-actions dev`
3. **Commit Message**:
   Gunakan pesan commit yang jelas, contoh:
   - `feat(jemaat): buat komponen form input jemaat`
   - `feat(keuangan): buat server action pencatatan kas`
   - `fix(surat): perbaiki validasi status permohonan`
4. **Pull Request (PR)**:
   Ajukan PR ke branch `dev` untuk direview oleh rekan tim sebelum dimerge.
