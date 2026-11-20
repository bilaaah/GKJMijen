-- =============================================================================
-- SEED DATA: seed.sql (SIM GKJ Mijen) - data contoh sesuai ERD
-- Jalankan SETELAH schema.sql. Aman dijalankan ulang (baris yang sama dilewati).
-- Catatan: akun (profiles) tidak di-seed karena harus dibuat lewat Supabase Auth,
-- jadi kolom id_profiles / id_pengurus dikosongkan dan berkas contoh tidak disertakan.
-- =============================================================================

-- 1. Jemaat
insert into jemaat (id_jemaat, nama, no_hp, alamat, data_keluarga, wilayah, status_baptis, status_sidi) values
  (md5('gkj-seed-j1')::uuid, 'Bambang Sutrisno', '0812-2534-7781', 'Jl. Raya Mijen No. 14, Mijen, Semarang', 'Istri: Endang Sutrisno
Anak: Yosua Adi Nugroho
Anak: Rina Sutrisno', 'Wilayah 1 – Mijen', true, true),
  (md5('gkj-seed-j2')::uuid, 'Sri Rahayu', '0857-4012-3365', 'Perum Bukit Jatisari Blok C-7, Mijen', 'Suami: Hadi Purnomo (alm.)', 'Wilayah 1 – Mijen', true, true),
  (md5('gkj-seed-j3')::uuid, 'Yosua Adi Nugroho', '0821-3377-9012', 'Jl. Raya Mijen No. 14, Mijen, Semarang', 'Ayah: Bambang Sutrisno
Ibu: Endang Sutrisno', 'Wilayah 1 – Mijen', true, false),
  (md5('gkj-seed-j4')::uuid, 'Lestari Handayani', '0813-9045-2210', 'Jl. Jatibarang Raya No. 31, Mijen', 'Suami: Agus Widodo
Anak: Gabriel Widodo', 'Wilayah 2 – Jatibarang', true, true),
  (md5('gkj-seed-j5')::uuid, 'Agus Widodo', '0813-9045-1187', 'Jl. Jatibarang Raya No. 31, Mijen', 'Istri: Lestari Handayani
Anak: Gabriel Widodo', 'Wilayah 2 – Jatibarang', true, true),
  (md5('gkj-seed-j6')::uuid, 'Gabriel Widodo', null, 'Jl. Jatibarang Raya No. 31, Mijen', 'Ayah: Agus Widodo
Ibu: Lestari Handayani', 'Wilayah 2 – Jatibarang', true, false),
  (md5('gkj-seed-j7')::uuid, 'Endang Sutrisno', '0812-2534-7790', 'Jl. Raya Mijen No. 14, Mijen, Semarang', 'Suami: Bambang Sutrisno
Anak: Yosua Adi Nugroho
Anak: Rina Sutrisno', 'Wilayah 1 – Mijen', true, true),
  (md5('gkj-seed-j8')::uuid, 'Paulus Santoso', '0878-3310-5524', 'Dusun Wonoplumbon RT 03/RW 02, Mijen', 'Istri: Theresia Murni
Anak: Natalia Putri Santoso', 'Wilayah 3 – Wonoplumbon', true, true),
  (md5('gkj-seed-j9')::uuid, 'Theresia Murni', '0878-3310-6640', 'Dusun Wonoplumbon RT 03/RW 02, Mijen', 'Suami: Paulus Santoso
Anak: Natalia Putri Santoso', 'Wilayah 3 – Wonoplumbon', true, false),
  (md5('gkj-seed-j10')::uuid, 'Natalia Putri Santoso', '0895-2201-4478', 'Dusun Wonoplumbon RT 03/RW 02, Mijen', 'Ayah: Paulus Santoso
Ibu: Theresia Murni', 'Wilayah 3 – Wonoplumbon', false, false),
  (md5('gkj-seed-j11')::uuid, 'Hadi Susanto', '0819-6672-0035', 'Jl. Kedungpane No. 8, Mijen', 'Istri: Sumarni', 'Wilayah 2 – Jatibarang', true, false),
  (md5('gkj-seed-j12')::uuid, 'Rina Sutrisno', '0822-4150-8863', 'Jl. Raya Mijen No. 14, Mijen, Semarang', 'Ayah: Bambang Sutrisno
Ibu: Endang Sutrisno', 'Wilayah 1 – Mijen', true, true)
on conflict (id_jemaat) do nothing;

-- 2. Permohonan surat
insert into permohonan_surat (id_permohonan, id_jemaat, jenis_surat, tanggal_pengajuan, status, catatan, nomor_surat) values
  (md5('gkj-seed-s1')::uuid, md5('gkj-seed-j3')::uuid, 'sidi', '2026-11-17', 'diajukan', null, null),
  (md5('gkj-seed-s2')::uuid, md5('gkj-seed-j10')::uuid, 'baptis', '2026-11-16', 'diajukan', null, null),
  (md5('gkj-seed-s3')::uuid, md5('gkj-seed-j11')::uuid, 'atestasi', '2026-11-15', 'diajukan', null, null),
  (md5('gkj-seed-s4')::uuid, md5('gkj-seed-j6')::uuid, 'baptis', '2026-11-12', 'diproses', 'Menunggu tanda tangan Pdt. Daniel Kurniawan.', '014/GKJ-MJN/BPT/XI/2026'),
  (md5('gkj-seed-s5')::uuid, md5('gkj-seed-j8')::uuid, 'atestasi', '2026-11-10', 'diproses', null, null),
  (md5('gkj-seed-s6')::uuid, md5('gkj-seed-j1')::uuid, 'atestasi', '2026-11-03', 'selesai', null, '011/GKJ-MJN/ATS/XI/2026'),
  (md5('gkj-seed-s7')::uuid, md5('gkj-seed-j4')::uuid, 'baptis', '2026-10-28', 'selesai', null, '010/GKJ-MJN/BPT/X/2026'),
  (md5('gkj-seed-s8')::uuid, md5('gkj-seed-j9')::uuid, 'sidi', '2026-10-20', 'ditolak', 'Lampiran akta baptis tidak terbaca. Mohon unggah ulang dalam format PDF yang jelas.', null),
  (md5('gkj-seed-s9')::uuid, md5('gkj-seed-j2')::uuid, 'atestasi', '2026-10-14', 'selesai', null, '009/GKJ-MJN/ATS/X/2026'),
  (md5('gkj-seed-s10')::uuid, md5('gkj-seed-j12')::uuid, 'sidi', '2026-10-05', 'selesai', null, '008/GKJ-MJN/SDI/X/2026')
on conflict (id_permohonan) do nothing;

-- 3. Transaksi keuangan
insert into transaksi_keuangan (id_transaksi, tanggal, jenis_transaksi, kategori, nominal, keterangan) values
  (md5('gkj-seed-t1')::uuid, '2026-10-01', 'pemasukan', 'Lainnya', 12500000, 'Saldo kas pindahan dari buku kas lama (per 30 Sep 2026)'),
  (md5('gkj-seed-t2')::uuid, '2026-10-04', 'pemasukan', 'Persembahan', 4850000, 'Persembahan Ibadah Minggu, 4 Oktober'),
  (md5('gkj-seed-t3')::uuid, '2026-10-11', 'pemasukan', 'Persembahan', 5120000, 'Persembahan Ibadah Minggu, 11 Oktober'),
  (md5('gkj-seed-t4')::uuid, '2026-10-12', 'pengeluaran', 'Operasional', 1350000, 'Tagihan listrik dan air bulan Oktober'),
  (md5('gkj-seed-t5')::uuid, '2026-10-18', 'pemasukan', 'Persepuluhan', 7400000, 'Persepuluhan jemaat bulan Oktober'),
  (md5('gkj-seed-t6')::uuid, '2026-10-22', 'pengeluaran', 'Diakonia', 2000000, 'Bantuan sembako lansia Wilayah 3'),
  (md5('gkj-seed-t7')::uuid, '2026-10-25', 'pemasukan', 'Persembahan', 4675000, 'Persembahan Ibadah Minggu, 25 Oktober'),
  (md5('gkj-seed-t8')::uuid, '2026-10-29', 'pengeluaran', 'Pembangunan', 3800000, 'Perbaikan talang atap gedung gereja'),
  (md5('gkj-seed-t9')::uuid, '2026-11-01', 'pemasukan', 'Persembahan', 5230000, 'Persembahan Ibadah Minggu, 1 November'),
  (md5('gkj-seed-t10')::uuid, '2026-11-03', 'pengeluaran', 'Operasional', 1420000, 'Tagihan listrik dan air bulan November'),
  (md5('gkj-seed-t11')::uuid, '2026-11-08', 'pemasukan', 'Persembahan', 4980000, 'Persembahan Ibadah Minggu, 8 November'),
  (md5('gkj-seed-t12')::uuid, '2026-11-09', 'pengeluaran', 'Diakonia', 1500000, 'Kunjungan dan bantuan jemaat sakit'),
  (md5('gkj-seed-t13')::uuid, '2026-11-12', 'pemasukan', 'Persepuluhan', 6900000, 'Persepuluhan jemaat bulan November'),
  (md5('gkj-seed-t14')::uuid, '2026-11-14', 'pengeluaran', 'Operasional', 650000, 'Konsumsi rapat majelis'),
  (md5('gkj-seed-t15')::uuid, '2026-11-15', 'pemasukan', 'Persembahan', 5105000, 'Persembahan Ibadah Minggu, 15 November'),
  (md5('gkj-seed-t16')::uuid, '2026-11-16', 'pemasukan', 'Lainnya', 2500000, 'Donasi alat musik dari keluarga Santoso'),
  (md5('gkj-seed-t17')::uuid, '2026-11-17', 'pengeluaran', 'Lainnya', 875000, 'Senar dan perawatan alat musik')
on conflict (id_transaksi) do nothing;

-- 4. Kegiatan
insert into kegiatan (id_kegiatan, nama_kegiatan, tanggal, jam, lokasi, petugas) values
  (md5('gkj-seed-k1')::uuid, 'Ibadah Minggu Pagi (Bahasa Jawa)', '2026-11-22', '06:30', 'Gedung Gereja GKJ Mijen', 'Pengkhotbah: Pdt. Daniel Kurniawan
Pamuji: Bambang Sutrisno
Pemusik: Yosua Adi Nugroho'),
  (md5('gkj-seed-k2')::uuid, 'Ibadah Minggu Umum', '2026-11-22', '08:30', 'Gedung Gereja GKJ Mijen', 'Pengkhotbah: Pdt. Daniel Kurniawan
Liturgos: Agus Widodo
Pemusik: Rina Sutrisno
Paduan Suara: Komisi Pemuda'),
  (md5('gkj-seed-k3')::uuid, 'Ibadah Minggu Sore', '2026-11-22', '17:00', 'Gedung Gereja GKJ Mijen', 'Pengkhotbah: Pnt. Paulus Santoso
Liturgos: Lestari Handayani
Pemusik: Yosua Adi Nugroho'),
  (md5('gkj-seed-k4')::uuid, 'Persekutuan Doa Wilayah 1', '2026-11-19', '19:00', 'Rumah Kel. Sutrisno, Jl. Raya Mijen 14', 'Pemimpin: Bambang Sutrisno
Renungan: Pdt. Daniel Kurniawan'),
  (md5('gkj-seed-k5')::uuid, 'Latihan Paduan Suara', '2026-11-20', '19:00', 'Gedung Gereja GKJ Mijen', 'Pelatih: Rina Sutrisno
Pemusik: Yosua Adi Nugroho'),
  (md5('gkj-seed-k6')::uuid, 'Persekutuan Pemuda', '2026-11-21', '18:30', 'Ruang Serbaguna', 'Pemimpin: Maria Setyaningsih
Pemusik: Yosua Adi Nugroho'),
  (md5('gkj-seed-k7')::uuid, 'Sekolah Minggu', '2026-11-22', '08:30', 'Ruang Serbaguna', 'Guru: Lestari Handayani
Guru: Natalia Putri Santoso'),
  (md5('gkj-seed-k8')::uuid, 'Rapat Majelis', '2026-11-25', '19:00', 'Ruang Konsistori', 'Pemimpin: Pdt. Daniel Kurniawan
Notulis: Yohanes Prasetyo'),
  (md5('gkj-seed-k9')::uuid, 'Persekutuan Doa Wilayah 3', '2026-11-26', '19:00', 'Rumah Kel. Santoso, Wonoplumbon', 'Pemimpin: Paulus Santoso
Renungan: Pdt. Daniel Kurniawan'),
  (md5('gkj-seed-k10')::uuid, 'Latihan Drama Natal', '2026-11-28', '15:00', 'Ruang Serbaguna', 'Sutradara: Maria Setyaningsih'),
  (md5('gkj-seed-k11')::uuid, 'Ibadah Minggu Umum', '2026-11-15', '08:30', 'Gedung Gereja GKJ Mijen', 'Pengkhotbah: Pdt. Daniel Kurniawan
Liturgos: Bambang Sutrisno'),
  (md5('gkj-seed-k12')::uuid, 'Ibadah Minggu Umum', '2026-11-29', '08:30', 'Gedung Gereja GKJ Mijen', 'Pengkhotbah: Pdt. Tamu (GKJ Ngaliyan)
Liturgos: Agus Widodo')
on conflict (id_kegiatan) do nothing;

-- 5. Warta
insert into warta (id_warta, judul, isi, status, tanggal_terbit) values
  (md5('gkj-seed-w1')::uuid, 'Warta Jemaat Minggu, 22 November 2026', '<h3>Pokok Doa</h3><ul><li>Jemaat yang sedang sakit: Ibu Sri Rahayu.</li><li>Persiapan perayaan Natal 2026.</li></ul><h3>Pengumuman</h3><p>Persekutuan Doa Wilayah 3 diadakan Kamis, 26 November 2026 pukul 19.00 di rumah Kel. Santoso.</p>', 'draf', null),
  (md5('gkj-seed-w2')::uuid, 'Warta Jemaat Minggu, 15 November 2026', '<h3>Pengumuman</h3><p>Persembahan Minggu lalu sebesar <b>Rp 4.980.000</b>. Terima kasih atas kesetiaan jemaat.</p><p>Latihan paduan suara setiap Jumat pukul 19.00.</p>', 'terbit', '2026-11-14'),
  (md5('gkj-seed-w3')::uuid, 'Undangan Persiapan Perayaan Natal 2026', '<p>Seluruh komisi diundang dalam rapat persiapan Natal pada Sabtu, 21 November 2026 pukul 16.00 di Ruang Serbaguna.</p>', 'terbit', '2026-11-12'),
  (md5('gkj-seed-w4')::uuid, 'Laporan Persembahan Bulan Oktober 2026', '<p>Total pemasukan bulan Oktober sebesar Rp 34.545.000 dan pengeluaran Rp 7.150.000. Rincian dapat dilihat di papan pengumuman.</p>', 'terbit', '2026-11-06'),
  (md5('gkj-seed-w5')::uuid, 'Warta Jemaat Minggu, 8 November 2026', '<p>Ibadah Perjamuan Kudus akan dilaksanakan pada Minggu, 6 Desember 2026.</p>', 'terbit', '2026-11-07'),
  (md5('gkj-seed-w6')::uuid, 'Pendaftaran Katekisasi Sidi Angkatan 2027', '<p>Pendaftaran katekisasi sidi dibuka hingga 31 Desember 2026. Silakan menghubungi sekretariat gereja.</p>', 'draf', null),
  (md5('gkj-seed-w7')::uuid, 'Warta Jemaat Minggu, 1 November 2026', '<p>Selamat datang kepada jemaat dan tamu yang beribadah bersama kami.</p>', 'terbit', '2026-10-31'),
  (md5('gkj-seed-w8')::uuid, 'Kerja Bakti Bersih Gereja', '<p>Kerja bakti membersihkan lingkungan gereja pada Sabtu, 24 Oktober 2026 pukul 07.00.</p>', 'terbit', '2026-10-24')
on conflict (id_warta) do nothing;
