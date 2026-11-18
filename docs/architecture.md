# Arsitektur Proyek – SIM GKJ Mijen

Dokumentasi arsitektur sederhana untuk **Sistem Informasi Manajemen Gereja Kristen Jawa Mijen (SIM GKJ Mijen)**.

---

## 1. Konsep & Pendekatan Arsitektur

Aplikasi menggunakan arsitektur **Modular berbasis Fitur (Feature-Based Modular Architecture)** di atas framework **Next.js (App Router)** dan **Supabase**.

Pendekatan ini memisahkan kode secara jelas berdasarkan domain fungsional gereja tanpa menambah abstraksi rumit:

```
[ Browser / Client ] 
        │
        ▼ (Bootstrap 5 UI + Form Handlers)
[ Next.js App Router (app/) ]
        │
        ▼ (Server Actions / features/*/actions.ts)
[ Backend Layer ]
        │
        ▼ (Supabase Client / lib/supabase/)
[ Supabase PostgreSQL + Auth + Storage ]
```

---

## 2. Empat Modul Utama (`src/features/`)

1. **Data Jemaat (`features/jemaat/`)**: Manajemen data sensus warga jemaat, status keanggotaan, dan identitas keluarga.
2. **Layanan Surat (`features/surat/`)**: Formulir permohonan surat gerejawi dan pelacakan status penerbitan.
3. **Keuangan (`features/keuangan/`)**: Pencatatan kas operasional pemasukan, pengeluaran, dan persembahan kebaktian.
4. **Jadwal dan Warta (`features/jadwal-warta/`)**: Kalender jadwal kebaktian serta distribusi warta jemaat mingguan.

Setiap modul memiliki struktur seragam:
- `components/`: Komponen UI khusus modul (Tanggung jawab **Frontend**).
- `actions.ts`: Server Actions mutasi data (Tanggung jawab **Backend**).
- `types.ts`: Definisi interface TypeScript (Kontrak data bersama).
- `index.ts`: Barrel export modul.

---

## 3. Sistem Peran Pengguna (Role-Based Access)

Sistem memiliki dua peran (*role*):
1. **Warga Jemaat (`warga`)**:
   - Melihat data profil diri.
   - Mengajukan permohonan surat gerejawi.
   - Melihat jadwal ibadah dan mengunduh warta jemaat.
2. **Pengurus Gereja (`pengurus`)**:
   - Mengelola master data jemaat (tambah/edit/hapus).
   - Memproses dan menerbitkan surat permohonan.
   - Mencatat dan mengelola pembukuan keuangan.
   - Mengunggah jadwal kegiatan dan menerbitkan file warta.

---

## 4. Pembagian Kerja Tim

- **Tim Frontend**: Berfokus pada halaman di `src/app/`, komponen UI bersama di `src/components/`, styling Bootstrap 5, serta form input di `src/features/*/components/`.
- **Tim Backend**: Berfokus pada integrasi Supabase di `src/lib/supabase/`, penulisan Server Actions di `src/features/*/actions.ts`, autentikasi sesi, dan aturan keamanan database (RLS).
