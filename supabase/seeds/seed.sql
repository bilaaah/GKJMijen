-- =============================================================================
-- SEED DATA: seed.sql
-- Inisialisasi data awal peran (roles), wilayah percontohan, & kategori keuangan
-- =============================================================================

-- Master Roles
INSERT INTO public.roles (name, description) VALUES
  ('super_admin', 'Administrator sistem dengan hak akses tak terbatas'),
  ('pendeta', 'Gembala jemaat dengan akses data jemaat, sakramen, dan warta'),
  ('majelis', 'Penatua dan Diaken dengan hak pemantauan pelayanan jemaat'),
  ('tata_usaha', 'Sekretariat gereja pengelola administrasi surat dan jemaat'),
  ('bendahara', 'Pengelola pembukuan transaksi dan persembahan kebaktian'),
  ('warga', 'Warga jemaat terdaftar dengan akses permohonan surat dan informasi')
ON CONFLICT (name) DO NOTHING;

-- Wilayah Percontohan
INSERT INTO public.wilayah (kode_wilayah, nama_wilayah, keterangan) VALUES
  ('WIL-01', 'Wilayah 1 - Mijen Krajan', 'Area pusat Mijen sekitar gedung gereja'),
  ('WIL-02', 'Wilayah 2 - Jatisari', 'Area perumahan dan perkampungan Jatisari'),
  ('WIL-03', 'Wilayah 3 - Cangkiran', 'Area lingkar selatan Cangkiran')
ON CONFLICT (kode_wilayah) DO NOTHING;

-- Master Jenis Surat
INSERT INTO public.jenis_surat (kode_surat, nama_surat, template_content) VALUES
  ('SRT-BAP', 'Surat Keterangan Baptis', 'Surat keterangan pelaksanaan sakramen baptis.'),
  ('SRT-SID', 'Surat Keterangan Sidi', 'Surat keterangan peneguhan sidi jemaat.'),
  ('SRT-ATT', 'Surat Atestasi Pindah', 'Surat atestasi kepindahan warga jemaat ke gereja lain.')
ON CONFLICT (kode_surat) DO NOTHING;

-- Master Pos Kategori Keuangan
INSERT INTO public.kategori_keuangan (tipe, kode, nama_kategori, deskripsi) VALUES
  ('pemasukan', 'IN-01', 'Persembahan Kebaktian Minggu', 'Pundi kantong merah dan hitam mingguan'),
  ('pemasukan', 'IN-02', 'Persembahan Perpuluhan / Bulanan', 'Persembahan syukur bulanan jemaat'),
  ('pengeluaran', 'OUT-01', 'Operasional Listrik & Air', 'Tagihan rutin utilitas gereja'),
  ('pengeluaran', 'OUT-02', 'Pelayanan Firman', 'Biaya operasional pelayan firman kebaktian')
ON CONFLICT (kode) DO NOTHING;
