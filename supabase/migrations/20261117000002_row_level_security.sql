-- =============================================================================
-- MIGRATION: 20261117000002_row_level_security.sql
-- DESKRIPSI: Kebijakan Keamanan Row Level Security (RLS) SIM GKJ Mijen
-- =============================================================================

-- 1. Enable RLS pada seluruh tabel publik
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wilayah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keluarga ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jemaat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riwayat_sakramen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jenis_surat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permohonan_surat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arsip_dokumen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kategori_keuangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaksi_keuangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.penghitungan_persembahan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.komisi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anggota_komisi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jadwal_kegiatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.penugasan_petugas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warta_jemaat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengumuman ENABLE ROW LEVEL SECURITY;

-- 2. Helper function untuk mengambil role pengguna aktif
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 3. Policy Contoh Scaffolding: User dapat membaca profile sendiri
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- 4. Policy Contoh Scaffolding: Super Admin memiliki akses penuh ke profiles
CREATE POLICY "Super admin has full access to profiles"
  ON public.profiles
  FOR ALL
  USING (public.current_user_role() = 'super_admin');

-- Catatan: Backend Team akan melengkapi spesifikasi granular RLS untuk masing-masing tabel
-- sesuai dokumen docs/team-responsibilities.md dan docs/database-design.md
