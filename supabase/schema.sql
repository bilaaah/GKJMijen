-- =============================================================================
-- DATABASE SCHEMA: schema.sql (SIM GKJ Mijen)
-- 4 Modul Utama: Data Jemaat, Layanan Surat, Keuangan, Jadwal & Warta
-- 2 Role: 'warga' (Warga Jemaat) & 'pengurus' (Pengurus Gereja)
-- =============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Role Pengguna Enum (2 Role)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('warga', 'pengurus');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 1. Tabel Profil Akun (Terkoneksi dengan auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'warga' NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Modul 1: Data Jemaat
CREATE TABLE IF NOT EXISTS public.jemaat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nomor_induk VARCHAR(30) NOT NULL UNIQUE,
  nama_lengkap VARCHAR(150) NOT NULL,
  jenis_kelamin CHAR(1) CHECK (jenis_kelamin IN ('L', 'P')) NOT NULL,
  tanggal_lahir DATE NOT NULL,
  alamat TEXT NOT NULL,
  status_jemaat VARCHAR(20) DEFAULT 'aktif' CHECK (status_jemaat IN ('aktif', 'titipan', 'pindah', 'meninggal')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Modul 2: Layanan Surat
CREATE TABLE IF NOT EXISTS public.permohonan_surat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nomor_permohonan VARCHAR(50) NOT NULL UNIQUE,
  jenis_surat VARCHAR(100) NOT NULL,
  jemaat_id UUID REFERENCES public.jemaat(id) ON DELETE SET NULL,
  keperluan TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'diproses', 'selesai', 'ditolak')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Modul 3: Keuangan
CREATE TABLE IF NOT EXISTS public.transaksi_keuangan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nomor_transaksi VARCHAR(50) NOT NULL UNIQUE,
  tanggal DATE NOT NULL,
  tipe VARCHAR(20) CHECK (tipe IN ('pemasukan', 'pengeluaran')) NOT NULL,
  kategori VARCHAR(100) NOT NULL,
  jumlah NUMERIC(15, 2) NOT NULL CHECK (jumlah > 0),
  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Modul 4: Jadwal dan Warta
CREATE TABLE IF NOT EXISTS public.jadwal_kegiatan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul VARCHAR(150) NOT NULL,
  waktu TIMESTAMPTZ NOT NULL,
  lokasi VARCHAR(150) NOT NULL,
  pelayan_firman VARCHAR(150),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.warta_jemaat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edisi VARCHAR(100) NOT NULL,
  tanggal_terbit DATE NOT NULL,
  tema TEXT,
  file_pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Row Level Security (RLS) Enable
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jemaat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permohonan_surat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaksi_keuangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jadwal_kegiatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warta_jemaat ENABLE ROW LEVEL SECURITY;
