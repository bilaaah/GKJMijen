-- =============================================================================
-- SEED DATA: seed.sql (SIM GKJ Mijen)
-- Contoh data awal untuk 4 modul utama
-- =============================================================================

-- 1. Data Sampel Jemaat
INSERT INTO public.jemaat (nomor_induk, nama_lengkap, jenis_kelamin, tanggal_lahir, alamat, status_jemaat)
VALUES
  ('JMT-001', 'Budi Santoso', 'L', '1985-05-12', 'Mijen RT 01 / RW 02', 'aktif'),
  ('JMT-002', 'Siti Rahayu', 'P', '1988-08-20', 'Jatisari RT 03 / RW 01', 'aktif')
ON CONFLICT (nomor_induk) DO NOTHING;

-- 2. Data Sampel Jadwal Kegiatan
INSERT INTO public.jadwal_kegiatan (judul, waktu, lokasi, pelayan_firman)
VALUES
  ('Kebaktian Minggu Pagi', NOW() + INTERVAL '3 days', 'Gedung Utama GKJ Mijen', 'Pendeta Jemaat'),
  ('Persekutuan Doa', NOW() + INTERVAL '5 days', 'Ruang Konsistori', 'Majelis')
ON CONFLICT DO NOTHING;

-- 3. Data Sampel Warta Jemaat
INSERT INTO public.warta_jemaat (edisi, tanggal_terbit, tema, file_pdf_url)
VALUES
  ('Edisi 46 - November 2026', CURRENT_DATE, 'Hidup yang Menjadi Berkat', NULL)
ON CONFLICT DO NOTHING;
