-- =============================================================================
-- MIGRATION: 20261117000001_initial_schema.sql
-- DESKRIPSI: Skema awal tabel SIM GKJ Mijen (Modul A - F)
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Peran Pengguna
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'super_admin',
    'pendeta',
    'majelis',
    'tata_usaha',
    'bendahara',
    'warga'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- MODUL F: PENGGUNA DAN HAK AKSES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name user_role NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Profiles (Terkoneksi dengan auth.users Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  jemaat_id UUID,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'warga' NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- -----------------------------------------------------------------------------
-- MODUL A: DATA JEMAAT
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wilayah (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode_wilayah VARCHAR(10) NOT NULL UNIQUE,
  nama_wilayah VARCHAR(100) NOT NULL,
  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.keluarga (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nomor_kk VARCHAR(30) NOT NULL UNIQUE,
  nama_kepala_keluarga VARCHAR(150) NOT NULL,
  wilayah_id UUID NOT NULL REFERENCES public.wilayah(id) ON DELETE RESTRICT,
  alamat TEXT NOT NULL,
  rt_rw VARCHAR(20),
  telepon VARCHAR(25),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.jemaat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nomor_induk VARCHAR(30) NOT NULL UNIQUE,
  keluarga_id UUID NOT NULL REFERENCES public.keluarga(id) ON DELETE RESTRICT,
  wilayah_id UUID NOT NULL REFERENCES public.wilayah(id) ON DELETE RESTRICT,
  nama_lengkap VARCHAR(150) NOT NULL,
  nama_panggilan VARCHAR(50),
  jenis_kelamin CHAR(1) CHECK (jenis_kelamin IN ('L', 'P')) NOT NULL,
  tempat_lahir VARCHAR(100) NOT NULL,
  tanggal_lahir DATE NOT NULL,
  status_dalam_keluarga VARCHAR(50) NOT NULL,
  status_pernikahan VARCHAR(50) NOT NULL,
  golongan_darah VARCHAR(5),
  pendidikan_terakhir VARCHAR(50),
  pekerjaan VARCHAR(100),
  status_jemaat VARCHAR(20) DEFAULT 'aktif' CHECK (status_jemaat IN ('aktif', 'titipan', 'pindah', 'meninggal')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Foreign key jemaat_id di profiles
ALTER TABLE public.profiles
  ADD CONSTRAINT fk_profiles_jemaat
  FOREIGN KEY (jemaat_id)
  REFERENCES public.jemaat(id)
  ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.riwayat_sakramen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jemaat_id UUID NOT NULL REFERENCES public.jemaat(id) ON DELETE CASCADE,
  jenis_sakramen VARCHAR(30) CHECK (jenis_sakramen IN ('baptis_anak', 'baptis_dewasa', 'sidi', 'pernikahan')) NOT NULL,
  nomor_piagam VARCHAR(100),
  tanggal_pelaksanaan DATE NOT NULL,
  tempat_pelaksanaan VARCHAR(150) NOT NULL,
  pelayan_firman VARCHAR(150) NOT NULL,
  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- -----------------------------------------------------------------------------
-- MODUL B: LAYANAN SURAT DAN ARSIP
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jenis_surat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kode_surat VARCHAR(20) NOT NULL UNIQUE,
  nama_surat VARCHAR(100) NOT NULL,
  template_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.permohonan_surat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nomor_permohonan VARCHAR(50) NOT NULL UNIQUE,
  jenis_surat_id UUID NOT NULL REFERENCES public.jenis_surat(id) ON DELETE RESTRICT,
  jemaat_id UUID NOT NULL REFERENCES public.jemaat(id) ON DELETE RESTRICT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'diproses', 'selesai', 'ditolak')) NOT NULL,
  keperluan TEXT NOT NULL,
  catatan TEXT,
  file_arsip_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.arsip_dokumen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul_dokumen VARCHAR(200) NOT NULL,
  kategori VARCHAR(100) NOT NULL,
  nomor_dokumen VARCHAR(100),
  file_url TEXT NOT NULL,
  file_size INT,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- -----------------------------------------------------------------------------
-- MODUL C: KEUANGAN
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.kategori_keuangan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipe VARCHAR(20) CHECK (tipe IN ('pemasukan', 'pengeluaran')) NOT NULL,
  kode VARCHAR(30) NOT NULL UNIQUE,
  nama_kategori VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.transaksi_keuangan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nomor_transaksi VARCHAR(50) NOT NULL UNIQUE,
  kategori_id UUID NOT NULL REFERENCES public.kategori_keuangan(id) ON DELETE RESTRICT,
  tanggal DATE NOT NULL,
  tipe VARCHAR(20) CHECK (tipe IN ('pemasukan', 'pengeluaran')) NOT NULL,
  jumlah NUMERIC(15, 2) NOT NULL CHECK (jumlah > 0),
  keterangan TEXT,
  bukti_transaksi_url TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.penghitungan_persembahan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tanggal_kebaktian DATE NOT NULL,
  jenis_kebaktian VARCHAR(100) NOT NULL,
  kantong_merah NUMERIC(15, 2) DEFAULT 0 NOT NULL,
  kantong_hitam NUMERIC(15, 2) DEFAULT 0 NOT NULL,
  persembahan_khusus NUMERIC(15, 2) DEFAULT 0 NOT NULL,
  total_persembahan NUMERIC(15, 2) NOT NULL,
  petugas_penghitung TEXT[],
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- -----------------------------------------------------------------------------
-- MODUL D: JADWAL DAN KEGIATAN
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.komisi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_komisi VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  periode VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.anggota_komisi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  komisi_id UUID NOT NULL REFERENCES public.komisi(id) ON DELETE CASCADE,
  jemaat_id UUID NOT NULL REFERENCES public.jemaat(id) ON DELETE CASCADE,
  jabatan VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(komisi_id, jemaat_id)
);

CREATE TABLE IF NOT EXISTS public.jadwal_kegiatan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul_kegiatan VARCHAR(150) NOT NULL,
  komisi_id UUID REFERENCES public.komisi(id) ON DELETE SET NULL,
  waktu_mulai TIMESTAMPTZ NOT NULL,
  waktu_selesai TIMESTAMPTZ,
  lokasi VARCHAR(150) NOT NULL,
  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.penugasan_petugas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jadwal_kegiatan_id UUID NOT NULL REFERENCES public.jadwal_kegiatan(id) ON DELETE CASCADE,
  jemaat_id UUID NOT NULL REFERENCES public.jemaat(id) ON DELETE CASCADE,
  peran_petugas VARCHAR(100) NOT NULL,
  status_konfirmasi VARCHAR(20) DEFAULT 'menunggu' CHECK (status_konfirmasi IN ('menunggu', 'bersedia', 'berhalangan')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- -----------------------------------------------------------------------------
-- MODUL E: WARTA DAN PENGUMUMAN
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.warta_jemaat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edisi VARCHAR(100) NOT NULL,
  tanggal_terbit DATE NOT NULL,
  tema TEXT,
  pdf_url TEXT,
  status_publikasi VARCHAR(20) DEFAULT 'draft' CHECK (status_publikasi IN ('draft', 'dipublikasikan', 'diarsipkan')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pengumuman (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul VARCHAR(200) NOT NULL,
  konten TEXT NOT NULL,
  kategori VARCHAR(100) NOT NULL,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
