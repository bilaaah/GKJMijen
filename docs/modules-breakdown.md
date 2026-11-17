# Rincian Modul Sistem – SIM GKJ Mijen

Aplikasi SIM GKJ Mijen terbagi menjadi **6 (enam) kelompok modul fungsional utama**. Seluruh modul diorganisasikan ke dalam direktori `src/features/<feature-name>/`.

---

## 1. Modul A: Data Jemaat (`src/features/jemaat/`)

### Lingkup Fungsional:
- **Data Jemaat**: Pencatatan identitas lengkap anggota gereja (Nomor Induk, status perkawinan, golongan darah, pendidikan, pekerjaan, status keanggotaan aktif/titipan/pindah/meninggal).
- **Data Keluarga**: Pengelompokan anggota jemaat berdasarkan Kartu Keluarga (KK), nomor KK gerejawi, alamat, dan kepala keluarga.
- **Data Wilayah / Blok**: Pemetaan jemaat berdasarkan blok wilayah pelayanan pastoral gereja.
- **Riwayat Sakramen**: Dokumentasi pelaksanaan sakramen Baptis Anak, Baptis Dewasa, Peneguhan Sidi, dan Pernikahan Kudus beserta nomor piagam dan pelayan firman.

### Entitas Terkait:
- `jemaat`, `keluarga`, `wilayah`, `riwayat_sakramen`

---

## 2. Modul B: Layanan Surat dan Arsip (`src/features/surat-arsip/`)

### Lingkup Fungsional:
- **Permohonan Surat**: Formulir pengajuan surat oleh warga jemaat (surat keterangan baptis, sidi, atestasi pindah, pengantar pernikahan).
- **Jenis Surat**: Master template format surat resmi gereja.
- **Pembuatan Surat**: Alur kerja persetujuan dan penerbitan dokumen surat resmi gereja.
- **Arsip Dokumen**: Pengelolaan repositori berkas digital, penomoran dokumen, dan integrasi penyimpanan di Supabase Storage.

### Entitas Terkait:
- `jenis_surat`, `permohonan_surat`, `arsip_dokumen`

---

## 3. Modul C: Keuangan (`src/features/keuangan/`)

### Lingkup Fungsional:
- **Kategori Keuangan**: Kode akun pos penerimaan dan pengeluaran gereja.
- **Penghitungan Persembahan**: Formulir pencatatan persembahan kantong merah, hitam, dan persembahan khusus setiap kebaktian beserta daftar petugas penghitung.
- **Transaksi Keuangan**: Pencatatan kas operasional harian (pemasukan & pengeluaran) dilengkapi unggah bukti transfer/nota.
- **Laporan Keuangan**: Rekapitulasi kas bulanan, buku kas umum, dan laporan pertanggungjawaban komisi.

### Entitas Terkait:
- `kategori_keuangan`, `transaksi_keuangan`, `penghitungan_persembahan`

---

## 4. Modul D: Jadwal dan Kegiatan (`src/features/jadwal-kegiatan/`)

### Lingkup Fungsional:
- **Data Komisi**: Master komisi pelayanan (Komisi Anak, Remaja, Pemuda, Dewasa, Adiyuswa, Diakonia, Musik, dll.).
- **Anggota Komisi**: Struktur kepengurusan komisi dan periode masa bakti.
- **Jadwal Kegiatan**: Kalender agenda peribadatan rutin, persekutuan doa, latihan musik, dan rapat gerejawi.
- **Penugasan Petugas**: Plotting pelayan firman (pendeta/pengkhotbah), liturgos, pemusik, proyektor, dan kolektan serta konfirmasi kehadiran.

### Entitas Terkait:
- `komisi`, `anggota_komisi`, `jadwal_kegiatan`, `penugasan_petugas`

---

## 5. Modul E: Warta dan Pengumuman (`src/features/warta-pengumuman/`)

### Lingkup Fungsional:
- **Warta Jemaat**: Manajemen edisi buletin warta mingguan, tema khotbah, dan ringkasan warta.
- **Publikasi Warta**: Workflow draft, review, dan publikasi warta gereja.
- **Arsip PDF Warta**: Unggah dan distribusi file PDF warta mingguan untuk dapat diunduh jemaat.
- **Pengumuman**: Pengumuman cepat terkait berita sukacita (kelahiran, pernikahan) atau dukacita.

### Entitas Terkait:
- `warta_jemaat`, `pengumuman`

---

## 6. Modul F: Pengguna dan Hak Akses (`src/features/pengguna-akses/`)

### Lingkup Fungsional:
- **Roles (RBAC)**: Definisi peran pengguna sistem (`super_admin`, `pendeta`, `majelis`, `tata_usaha`, `bendahara`, `warga`).
- **Profiles**: Profil akun yang tertaut dengan tabel `auth.users` Supabase dan tabel `jemaat`.
- **Log Aktivitas**: Audit trail pencatatan aktivitas pengguna saat membuat, mengubah, atau menghapus data penting.
- **Manajemen Hak Akses**: Pembatasan menu navigasi dan proteksi aksi berdasarkan matriks izin.

### Entitas Terkait:
- `roles`, `profiles`, `activity_logs`
