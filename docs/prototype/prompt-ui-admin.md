# Prompt UI Admin — GKJ Mijen

> Salin seluruh isi di bawah garis ke tool prototyping (Figma Make, v0, Lovable, dsb.).
> - **Color palette & gaya visual** diambil dari file `Referensi Color Palette Website.jpeg` (landing page GKJ Mijen: maroon, cokelat tua, krem). Kode HEX diukur langsung dari gambar tersebut.
> - **Struktur data** diambil dari ERD di laporan *Tahap Perancangan Proses Usulan, Basis Data, dan Laporan*.
> - Kalau tool-nya bisa menerima gambar, **lampirkan juga file referensi .jpeg** bersama prompt ini agar hasilnya lebih mirip.

---

Buatkan **prototype UI web bagian Admin (Pengurus Gereja)** untuk aplikasi web **GKJ Mijen** (Gereja Kristen Jawa Mijen, Semarang) yang akan dipakai sungguhan oleh jemaat dan pengurus. **Jangan pernah menulis kata "SIM" atau "Sistem Informasi Manajemen" di antarmuka**, lengkap dengan halaman **Login, Register, dan Lupa Kata Sandi**. Semua teks antarmuka dalam **Bahasa Indonesia**. Desain harus **satu bahasa visual dengan landing page publik GKJ Mijen** (lihat gambar referensi): hangat, elegan, bernuansa gereja klasik dengan warna maroon–cokelat–krem, tetapi tetap praktis dan mudah dipakai pengurus gereja yang tidak terlalu paham teknologi. Harus **responsif** (desktop 1440px dan ponsel 375px). Struktur komponen mengikuti **Bootstrap 5** (grid, card, table, form, badge, modal), karena aplikasi aslinya dibangun dengan Next.js + Bootstrap 5 + Supabase.

## 1. Konteks Sistem

- Sistem hanya punya **2 peran**: `warga` (Warga Jemaat) dan `pengurus` (Pengurus Gereja: sekretaris, bendahara, pendeta/majelis, pengurus komisi). Prototype ini fokus ke tampilan **pengurus/admin**.
- Ada 4 modul utama: **Data Jemaat, Layanan Surat, Keuangan, Jadwal & Warta**, ditambah **Akun Pengguna** dan **Laporan/Rekap**.
- Fitur yang **tidak** perlu dibuat (ditunda): notifikasi petugas, cek jadwal bentrok, surat otomatis dari templat, log aktivitas, dashboard grafik, PDF warta. Jadi dashboard cukup pakai kartu ringkasan dan tabel, **tanpa grafik**.

## 2. Color Palette

Gunakan **hanya** warna berikut (diambil dari landing page referensi):

| Token | HEX | Asal di referensi | Penggunaan di admin |
|---|---|---|---|
| Primary Maroon | `#7B2E26` | Tombol "Lihat Jadwal Ibadah", banner ajakan | Tombol utama, link aktif, angka penting, ikon aktif |
| Primary Hover | `#62231C` | (lebih gelap dari Primary) | Hover/pressed tombol utama |
| Deep Burgundy | `#3B1512` | Pita "Jadwal Ibadah" | **Sidebar**, panel kiri halaman login/register |
| Espresso | `#291A17` | Footer | Teks judul, teks utama gelap, topbar ponsel |
| Cream | `#FAF5EF` | Latar hero & section | **Latar halaman** admin |
| Sand | `#F3EBDE` | Latar section "Pelayanan" | Latar header tabel, baris filter, area sekunder |
| Beige | `#EADFCB` | Kotak peta lokasi | Border, divider, placeholder gambar, skeleton |
| Warm White | `#FFFDF9` | Kartu pelayanan & warta | Card, tabel, modal, input |
| Rose Soft | `#E8D0C4` | Lingkaran ikon kartu pelayanan, badge kategori | Lingkaran ikon modul, item menu aktif, badge netral |
| Terracotta | `#B07066` | Label kecil huruf kapital ("WARTA & AGENDA") | Eyebrow label, garis aksen, ikon sekunder |
| Text Muted | `#7A6A64` | Paragraf deskripsi | Teks sekunder, keterangan, placeholder |

Warna status (diredam agar serasi dengan palet hangat):

| Status | HEX teks / latar badge | Dipakai untuk |
|---|---|---|
| Success | `#4F7A4A` / `#E4EDDF` | Selesai, Terbit, Pemasukan |
| Warning | `#B7802A` / `#F6EAD3` | Diproses |
| Info | `#4A6B8A` / `#E1E8EF` | Diajukan |
| Danger | `#A3271F` / `#F4DEDA` | Ditolak, Pengeluaran, tombol hapus |
| Netral | `#7A6A64` / `#EFE7DF` | Draf, data kosong |

**Gaya visual (ikuti referensi):**
- **Tipografi**: judul memakai font serif elegan **Cormorant Garamond** (semibold, mis. judul halaman 32px, judul card 22px); isi, tabel, dan form memakai sans-serif geometris **Jost** (14–16px). Label kecil di atas judul (*eyebrow*) huruf kapital, 11–12px, letter-spacing lebar, warna Terracotta, diawali garis pendek — seperti "— GEREJA KRISTEN JAWA" di referensi.
- **Tombol**: bentuk **pill** (radius penuh). Utama = isi Maroon + teks putih; sekunder = outline Maroon tipis + teks Maroon di atas krem.
- **Card**: latar Warm White, radius 14–16px, border tipis Beige, bayangan sangat halus; ikon modul di dalam **lingkaran Rose Soft** dengan ikon garis Maroon (seperti kartu "Ibadah & Liturgi", "Diakonia" di referensi).
- **Badge**: pill kecil dengan latar lembut (mis. Rose Soft untuk kategori, warna status di atas).
- Banyak ruang kosong (whitespace), ikon garis tipis (Lucide / Bootstrap Icons), ornamen salib kecil boleh dipakai sebagai aksen di halaman auth dan logo.
- Logo: gunakan logo asli `Logo GKJ Mijen.jpeg` (lambang GKJ: tetesan, burung merpati, tangan berdoa, pita "Gereja-Gereja Kristen Jawa"), diwarnai ulang sesuai palet: Rose Soft `#E8D0C4` di atas latar Burgundy, Maroon `#7B2E26` di atas latar krem. Di sampingnya teks "GKJ Mijen" (serif) dan "SEMARANG" kecil.
- Pastikan kontras teks memenuhi WCAG AA (teks putih hanya di atas Maroon/Burgundy/Espresso).

## 3. Halaman Autentikasi

Tata letak **split screen**: kiri panel **Deep Burgundy `#3B1512`** berisi **foto asli** `Foto GKJ Mijen.jpeg` (bukan ilustrasi, tanpa animasi) dalam bingkai **lengkung atas (arch)** dengan overlay gelap tipis, logo "GKJ Mijen", eyebrow "PORTAL PELAYANAN JEMAAT", dan tagline serif besar berwarna krem *"Satu keluarga dalam kasih Kristus"*. Kanan: latar Cream `#FAF5EF` dengan form di atas card Warm White, judul serif (mis. "Masuk ke Akun Anda"), tombol pill Maroon lebar penuh. Di ponsel, panel kiri berubah jadi header Burgundy kecil berisi logo.

1. **Login** — field: Email, Kata Sandi (ikon tampil/sembunyi), checkbox "Ingat saya", tombol **Masuk**, link "Lupa kata sandi?", link "Belum punya akun? Daftar". Tampilkan contoh state error ("Email atau kata sandi salah").
2. **Register** — field sesuai tabel `profiles`: Nama Lengkap (`nama`), Email (`email`), Kata Sandi, Konfirmasi Kata Sandi, checkbox persetujuan. Tombol **Daftar**. Beri catatan info: *"Akun baru terdaftar sebagai Warga. Peran Pengurus diberikan oleh admin melalui menu Akun Pengguna."* Tampilkan validasi (kata sandi minimal 8 karakter, konfirmasi tidak cocok).
3. **Lupa Kata Sandi** — field Email + tombol "Kirim Tautan Reset", lalu state sukses "Tautan reset telah dikirim ke email Anda".
4. **Atur Ulang Kata Sandi** — Kata Sandi Baru + Konfirmasi.

## 4. Layout Admin

- **Sidebar kiri** berwarna **Deep Burgundy `#3B1512`** (bisa diciutkan; di ponsel jadi offcanvas/hamburger). Logo GKJ Mijen di atas, teks menu krem `#FAF5EF` dengan opasitas 75%; item aktif memakai latar Maroon `#7B2E26` + teks putih dan garis aksen kiri Rose Soft. Menu dikelompokkan dengan eyebrow label kecil:
  - UTAMA: Dashboard
  - PELAYANAN: Data Jemaat · Permohonan Surat
  - KEUANGAN: Transaksi · Laporan & Rekap
  - JADWAL & WARTA: Kegiatan · Warta
  - PENGATURAN: Akun Pengguna · Profil Saya · Keluar
  Beri badge angka (pill Maroon/Rose Soft) pada "Permohonan Surat" untuk permohonan berstatus *Diajukan*.
- **Topbar** latar Cream dengan border bawah Beige: breadcrumb, kolom pencarian global (pill), nama + avatar pengurus dengan dropdown (Profil Saya, Lihat Landing Page, Keluar).
- **Judul setiap halaman** mengikuti gaya referensi: eyebrow Terracotta (mis. "— PELAYANAN") lalu judul serif besar (mis. "Data Jemaat") dan deskripsi singkat warna Text Muted.
- Setiap halaman daftar memakai pola sama: judul + tombol **+ Tambah**, baris filter, tabel dengan pagination, aksi per baris (Lihat, Ubah, Hapus), empty state, dan **modal konfirmasi hapus**. Tampilkan toast sukses setelah simpan.

## 5. Halaman Admin (sesuai ERD)

### 5.1 Dashboard
- Banner sapaan berlatar Maroon `#7B2E26` (seperti banner "Kami menantikan kehadiran Anda" di referensi) dengan ikon salib kecil, teks serif "Selamat datang, [nama]" + tanggal hari ini, dan 2 tombol pill (putih: "+ Catat Transaksi", outline krem: "Proses Surat").
- 4 kartu ringkasan Warm White dengan ikon di lingkaran Rose Soft: Total Jemaat, Permohonan Surat Menunggu, Saldo Kas Saat Ini, Kegiatan Minggu Ini. Angka besar memakai font serif warna Maroon.
- Pita "Jadwal Ibadah Minggu Ini" berlatar Deep Burgundy dengan 3 kolom (nama ibadah + hari/jam), meniru pita jadwal di referensi.
- Tabel "Permohonan Surat Terbaru" (5 baris) dan daftar "Kegiatan Mendatang".
- Kartu ringkasan keuangan bulan ini: Total Pemasukan, Total Pengeluaran, Saldo (angka saja, tanpa grafik).

### 5.2 Data Jemaat — tabel `jemaat`
Kolom ERD: `id_jemaat`, `id_profiles` (UNIQUE, opsional), `nama`, `no_hp`, `alamat`, `data_keluarga`, `wilayah`, `status_baptis`, `status_sidi`.
- **Daftar**: kolom Nama, No. HP, Wilayah, Status Baptis (badge Sudah/Belum), Status Sidi (badge Sudah/Belum), Akun Tertaut (ikon centang jika punya `id_profiles`). Filter: Wilayah (dropdown), Status Baptis, Status Sidi, pencarian nama.
- **Form Tambah/Ubah**: Nama, No. HP, Alamat (textarea), Wilayah (dropdown), Data Keluarga (textarea / daftar anggota keluarga), Status Baptis (toggle), Status Sidi (toggle), Tautkan ke Akun (select akun `profiles` peran warga yang belum tertaut).
- **Detail Jemaat**: profil lengkap + riwayat permohonan surat milik jemaat tersebut.

### 5.3 Permohonan Surat — tabel `permohonan_surat`
Kolom ERD: `id_permohonan`, `id_jemaat`, `id_pengurus` (profiles), `jenis_surat` (baptis/sidi/atestasi), `tanggal_pengajuan`, `status`, `catatan`, `nomor_surat`, `url_lampiran`, `url_surat`.
- **Daftar** dengan tab status: Semua · Diajukan (biru) · Diproses (kuning) · Selesai (hijau) · Ditolak (merah). Kolom: Tanggal Pengajuan, Nama Pemohon (jemaat), Jenis Surat, Status, Diproses Oleh, Aksi "Proses". Filter jenis surat dan rentang tanggal.
- **Detail / Proses Permohonan** (halaman 2 kolom):
  - Kiri: data pemohon (ringkas dari tabel jemaat: nama, wilayah, status baptis/sidi) + pratinjau/unduh lampiran (`url_lampiran`).
  - Kanan: panel aksi — ubah Status (Diajukan → Diproses → Selesai, atau Ditolak), input **Nomor Surat**, **Unggah Surat Final (PDF)** (`url_surat`, drag & drop), textarea **Catatan** (wajib diisi jika Ditolak), tombol **Simpan**.
  - Tampilkan timeline status (Diajukan → Diproses → Selesai) di bagian atas.

### 5.4 Keuangan — tabel `transaksi_keuangan`
Kolom ERD: `id_transaksi`, `id_profiles` (pencatat), `tanggal`, `jenis_transaksi` (pemasukan/pengeluaran), `kategori`, `nominal`, `keterangan`, `bukti_url`.
- **Header ringkasan**: Saldo Saat Ini, Pemasukan Bulan Ini, Pengeluaran Bulan Ini.
- **Daftar Transaksi**: Tanggal, Jenis (badge hijau Pemasukan / merah Pengeluaran), Kategori, Keterangan, Nominal (format `Rp 1.250.000`, hijau/merah), Bukti (ikon lihat gambar), Dicatat Oleh. Filter bulan, tahun, jenis, kategori.
- **Form Tambah/Ubah Transaksi**: Tanggal, Jenis Transaksi (segmented button Pemasukan/Pengeluaran), Kategori (dropdown: Persembahan, Persepuluhan, Diakonia, Operasional, Pembangunan, Lainnya), Nominal (input Rupiah), Keterangan, Unggah Foto Bukti (preview gambar).

### 5.5 Laporan & Rekap
- Pilih periode (bulan & tahun) → tabel **Rekap Bulanan**: saldo awal, total pemasukan per kategori, total pengeluaran per kategori, saldo akhir.
- Tombol **Cetak PDF** dan **Ekspor Excel**.
- Tampilkan juga ringkasan jumlah permohonan surat per status pada periode tersebut.

### 5.6 Kegiatan — tabel `kegiatan`
Kolom ERD: `id_kegiatan`, `id_profiles` (pembuat), `nama_kegiatan`, `tanggal`, `jam`, `lokasi`, `petugas`, `url_poster` (kolom tambahan).
- Tampilan **Daftar** (tabel) dan toggle **Kalender bulanan**. Kolom: Nama Kegiatan, Tanggal, Jam, Lokasi, Petugas, Dibuat Oleh.
- **Form**: Nama Kegiatan, Tanggal (date picker), Jam (time picker), Lokasi, Petugas (input tag/multi-baris, mis. "Pengkhotbah: Pdt. …, Liturgos: …, Pemusik: …").
- **Upload Poster / Pamflet** (opsional): dropzone khusus PNG atau JPG maks. 5 MB, pratinjau gambar setelah dipilih, tombol Ganti dan Hapus. Poster tampil di landing page bersama info kegiatan; di tabel kegiatan muncul label kecil "Poster" yang bisa diklik untuk melihatnya.
- Info kecil: "Kegiatan otomatis tampil di landing page publik."

### 5.7 Warta — tabel `warta`
Kolom ERD: `id_warta`, `id_profiles` (penulis), `judul`, `isi`, `status` (draf/terbit), `tanggal_terbit`, `url_pdf` (kolom tambahan).
- **Daftar**: Judul, Penulis, Status (badge abu "Draf" / hijau "Terbit"), Tanggal Terbit. Tab: Semua · Draf · Terbit.
- **Editor Warta**: input Judul, rich text editor untuk Isi (bold, italic, list, heading), panel samping berisi Status, Tanggal Terbit, tombol **Simpan Draf** dan **Terbitkan**, serta tombol **Pratinjau** yang menampilkan warta seperti di landing page.
- **Upload Warta versi PDF** (opsional) di bawah editor: dropzone khusus PDF maks. 10 MB, setelah dipilih tampil nama berkas + ukuran dengan tombol Ganti dan Hapus. Di daftar warta muncul label "PDF", dan di pratinjau landing page muncul tombol "Unduh PDF".

### 5.8 Akun Pengguna — tabel `profiles`
Kolom ERD: `id` (UUID, Auth user), `nama`, `email`, `peran` (warga/pengurus).
- **Daftar**: Nama, Email, Peran (badge), Jemaat Tertaut (nama jemaat atau "–"), Tanggal Daftar. Filter peran + pencarian.
- **Aksi Ubah**: modal untuk mengubah Nama dan **Peran** (warga ↔ pengurus), serta menautkan/melepas tautan ke data jemaat (relasi 1 : 0..1).
- Admin tidak bisa menghapus akunnya sendiri (tampilkan tombol nonaktif + tooltip).

### 5.9 Pengaturan Profil
- Ubah Nama, lihat Email (read-only), Ubah Kata Sandi (lama, baru, konfirmasi).

## 6. Relasi Data yang Harus Terlihat di UI
- `profiles` 1 : 0..1 `jemaat` → kolom "Akun Tertaut" di Data Jemaat dan "Jemaat Tertaut" di Akun Pengguna.
- `jemaat` 1 : N `permohonan_surat` → riwayat surat di Detail Jemaat; nama pemohon di daftar permohonan.
- `profiles` 1 : N `permohonan_surat` (memproses) → kolom "Diproses Oleh".
- `profiles` 1 : N `transaksi_keuangan` / `kegiatan` / `warta` → kolom "Dicatat Oleh" / "Dibuat Oleh" / "Penulis".

## 7. Data Contoh
Isi semua tabel dengan data dummy yang realistis bernuansa gereja Jawa di Mijen, Semarang: nama jemaat Indonesia/Jawa, wilayah "Wilayah 1 – Mijen", "Wilayah 2 – Jatibarang", "Wilayah 3 – Wonoplumbon", nominal Rupiah, nomor surat seperti `012/GKJ-MJN/BPT/XI/2026`, kegiatan seperti "Ibadah Minggu Pagi", "Persekutuan Doa Wilayah", "Latihan Paduan Suara", dan warta mingguan. Minimal 8 baris per tabel.

## 8. Output yang Diharapkan
Hasilkan layar-layar berikut (desktop, plus versi ponsel untuk Login, Dashboard, dan satu halaman daftar):
1. Login 2. Register 3. Lupa Kata Sandi 4. Atur Ulang Kata Sandi 5. Dashboard 6. Daftar Jemaat 7. Form Jemaat 8. Detail Jemaat 9. Daftar Permohonan Surat 10. Proses Permohonan Surat 11. Daftar Transaksi Keuangan 12. Form Transaksi 13. Laporan & Rekap 14. Daftar Kegiatan (tabel + kalender) 15. Form Kegiatan 16. Daftar Warta 17. Editor Warta 18. Akun Pengguna (+ modal ubah peran) 19. Pengaturan Profil 20. Modal konfirmasi hapus & toast sukses.

Hubungkan semua layar menjadi **prototype yang bisa diklik** (menu sidebar berpindah halaman, tombol Tambah membuka form, Login masuk ke Dashboard, Keluar kembali ke Login).
