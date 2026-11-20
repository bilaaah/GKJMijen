import type { DB } from './types';
import { WILAYAH } from './constants';

/**
 * Data contoh untuk MODE DEMO (dipakai saat kunci Supabase belum diisi di .env.local).
 * Saat Supabase aktif, data diambil dari database dan file ini tidak dipakai.
 */

function samplePoster(eyebrow: string, title: string[], when: string, where: string, bg: string, fg: string): string {
  const lines = title
    .map((t, i) => `<text x="300" y="${380 + i * 72}" text-anchor="middle" font-family="Georgia,serif" font-size="64" fill="${fg}">${t}</text>`)
    .join('');
  const y = 420 + title.length * 72;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800"><rect width="600" height="800" fill="${bg}"/><rect x="30" y="30" width="540" height="740" fill="none" stroke="${fg}" stroke-opacity=".35"/><path d="M300 120v90M270 150h60" stroke="${fg}" stroke-width="8" stroke-linecap="round"/><text x="300" y="290" text-anchor="middle" font-family="Georgia,serif" font-size="22" letter-spacing="6" fill="${fg}" fill-opacity=".8">${eyebrow}</text>${lines}<line x1="220" y1="${y}" x2="380" y2="${y}" stroke="${fg}" stroke-opacity=".5"/><text x="300" y="${y + 60}" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" fill="${fg}">${when}</text><text x="300" y="${y + 100}" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="${fg}" fill-opacity=".75">${where}</text><text x="300" y="730" text-anchor="middle" font-family="Georgia,serif" font-size="24" fill="${fg}">GKJ Mijen Semarang</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export const SEED: DB = {
  profiles: [
    { id: 'p1', nama: 'Yohanes Prasetyo', email: 'yohanes.prasetyo@gkjmijen.or.id', peran: 'pengurus', created_at: '2026-08-03' },
    { id: 'p2', nama: 'Ruth Wulandari', email: 'ruth.wulandari@gkjmijen.or.id', peran: 'pengurus', created_at: '2026-08-03' },
    { id: 'p3', nama: 'Pdt. Daniel Kurniawan', email: 'daniel.kurniawan@gkjmijen.or.id', peran: 'pengurus', created_at: '2026-08-04' },
    { id: 'p4', nama: 'Maria Setyaningsih', email: 'maria.setya@gmail.com', peran: 'pengurus', created_at: '2026-08-10' },
    { id: 'p5', nama: 'Bambang Sutrisno', email: 'bambang.sutrisno@gmail.com', peran: 'warga', created_at: '2026-09-01' },
    { id: 'p6', nama: 'Sri Rahayu', email: 'srirahayu62@gmail.com', peran: 'warga', created_at: '2026-09-02' },
    { id: 'p7', nama: 'Yosua Adi Nugroho', email: 'yosua.adi@gmail.com', peran: 'warga', created_at: '2026-09-15' },
    { id: 'p8', nama: 'Lestari Handayani', email: 'lestari.h@yahoo.co.id', peran: 'warga', created_at: '2026-10-02' },
    { id: 'p9', nama: 'Agus Widodo', email: 'aguswidodo@gmail.com', peran: 'warga', created_at: '2026-10-11' },
    { id: 'p10', nama: 'Kristina Dewi', email: 'kristinadewi@gmail.com', peran: 'warga', created_at: '2026-11-05' },
  ],
  jemaat: [
    { id: 'j1', id_profiles: 'p5', nama: 'Bambang Sutrisno', no_hp: '0812-2534-7781', alamat: 'Jl. Raya Mijen No. 14, Mijen, Semarang', data_keluarga: 'Istri: Endang Sutrisno\nAnak: Yosua Adi Nugroho\nAnak: Rina Sutrisno', wilayah: WILAYAH[0], status_baptis: true, status_sidi: true },
    { id: 'j2', id_profiles: 'p6', nama: 'Sri Rahayu', no_hp: '0857-4012-3365', alamat: 'Perum Bukit Jatisari Blok C-7, Mijen', data_keluarga: 'Suami: Hadi Purnomo (alm.)', wilayah: WILAYAH[0], status_baptis: true, status_sidi: true },
    { id: 'j3', id_profiles: 'p7', nama: 'Yosua Adi Nugroho', no_hp: '0821-3377-9012', alamat: 'Jl. Raya Mijen No. 14, Mijen, Semarang', data_keluarga: 'Ayah: Bambang Sutrisno\nIbu: Endang Sutrisno', wilayah: WILAYAH[0], status_baptis: true, status_sidi: false },
    { id: 'j4', id_profiles: 'p8', nama: 'Lestari Handayani', no_hp: '0813-9045-2210', alamat: 'Jl. Jatibarang Raya No. 31, Mijen', data_keluarga: 'Suami: Agus Widodo\nAnak: Gabriel Widodo', wilayah: WILAYAH[1], status_baptis: true, status_sidi: true },
    { id: 'j5', id_profiles: 'p9', nama: 'Agus Widodo', no_hp: '0813-9045-1187', alamat: 'Jl. Jatibarang Raya No. 31, Mijen', data_keluarga: 'Istri: Lestari Handayani\nAnak: Gabriel Widodo', wilayah: WILAYAH[1], status_baptis: true, status_sidi: true },
    { id: 'j6', id_profiles: null, nama: 'Gabriel Widodo', no_hp: '', alamat: 'Jl. Jatibarang Raya No. 31, Mijen', data_keluarga: 'Ayah: Agus Widodo\nIbu: Lestari Handayani', wilayah: WILAYAH[1], status_baptis: true, status_sidi: false },
    { id: 'j7', id_profiles: null, nama: 'Endang Sutrisno', no_hp: '0812-2534-7790', alamat: 'Jl. Raya Mijen No. 14, Mijen, Semarang', data_keluarga: 'Suami: Bambang Sutrisno\nAnak: Yosua Adi Nugroho\nAnak: Rina Sutrisno', wilayah: WILAYAH[0], status_baptis: true, status_sidi: true },
    { id: 'j8', id_profiles: null, nama: 'Paulus Santoso', no_hp: '0878-3310-5524', alamat: 'Dusun Wonoplumbon RT 03/RW 02, Mijen', data_keluarga: 'Istri: Theresia Murni\nAnak: Natalia Putri Santoso', wilayah: WILAYAH[2], status_baptis: true, status_sidi: true },
    { id: 'j9', id_profiles: null, nama: 'Theresia Murni', no_hp: '0878-3310-6640', alamat: 'Dusun Wonoplumbon RT 03/RW 02, Mijen', data_keluarga: 'Suami: Paulus Santoso\nAnak: Natalia Putri Santoso', wilayah: WILAYAH[2], status_baptis: true, status_sidi: false },
    { id: 'j10', id_profiles: null, nama: 'Natalia Putri Santoso', no_hp: '0895-2201-4478', alamat: 'Dusun Wonoplumbon RT 03/RW 02, Mijen', data_keluarga: 'Ayah: Paulus Santoso\nIbu: Theresia Murni', wilayah: WILAYAH[2], status_baptis: false, status_sidi: false },
    { id: 'j11', id_profiles: null, nama: 'Hadi Susanto', no_hp: '0819-6672-0035', alamat: 'Jl. Kedungpane No. 8, Mijen', data_keluarga: 'Istri: Sumarni', wilayah: WILAYAH[1], status_baptis: true, status_sidi: false },
    { id: 'j12', id_profiles: null, nama: 'Rina Sutrisno', no_hp: '0822-4150-8863', alamat: 'Jl. Raya Mijen No. 14, Mijen, Semarang', data_keluarga: 'Ayah: Bambang Sutrisno\nIbu: Endang Sutrisno', wilayah: WILAYAH[0], status_baptis: true, status_sidi: true },
  ],
  surat: [
    { id: 's1', id_jemaat: 'j3', id_pengurus: null, jenis_surat: 'sidi', tanggal_pengajuan: '2026-11-17', status: 'diajukan', catatan: '', nomor_surat: '', url_lampiran: 'lampiran/akta-baptis-yosua.pdf', url_surat: '' },
    { id: 's2', id_jemaat: 'j10', id_pengurus: null, jenis_surat: 'baptis', tanggal_pengajuan: '2026-11-16', status: 'diajukan', catatan: '', nomor_surat: '', url_lampiran: 'lampiran/akta-kelahiran-natalia.pdf', url_surat: '' },
    { id: 's3', id_jemaat: 'j11', id_pengurus: null, jenis_surat: 'atestasi', tanggal_pengajuan: '2026-11-15', status: 'diajukan', catatan: '', nomor_surat: '', url_lampiran: 'lampiran/surat-pengantar-hadi.pdf', url_surat: '' },
    { id: 's4', id_jemaat: 'j6', id_pengurus: 'p1', jenis_surat: 'baptis', tanggal_pengajuan: '2026-11-12', status: 'diproses', catatan: 'Menunggu tanda tangan Pdt. Daniel Kurniawan.', nomor_surat: '014/GKJ-MJN/BPT/XI/2026', url_lampiran: 'lampiran/akta-kelahiran-gabriel.pdf', url_surat: '' },
    { id: 's5', id_jemaat: 'j8', id_pengurus: 'p1', jenis_surat: 'atestasi', tanggal_pengajuan: '2026-11-10', status: 'diproses', catatan: '', nomor_surat: '', url_lampiran: 'lampiran/surat-pindah-paulus.pdf', url_surat: '' },
    { id: 's6', id_jemaat: 'j1', id_pengurus: 'p1', jenis_surat: 'atestasi', tanggal_pengajuan: '2026-11-03', status: 'selesai', catatan: '', nomor_surat: '011/GKJ-MJN/ATS/XI/2026', url_lampiran: 'lampiran/permohonan-bambang.pdf', url_surat: 'surat-final/011-ATS-XI-2026.pdf' },
    { id: 's7', id_jemaat: 'j4', id_pengurus: 'p3', jenis_surat: 'baptis', tanggal_pengajuan: '2026-10-28', status: 'selesai', catatan: '', nomor_surat: '010/GKJ-MJN/BPT/X/2026', url_lampiran: 'lampiran/akta-lestari.pdf', url_surat: 'surat-final/010-BPT-X-2026.pdf' },
    { id: 's8', id_jemaat: 'j9', id_pengurus: 'p1', jenis_surat: 'sidi', tanggal_pengajuan: '2026-10-20', status: 'ditolak', catatan: 'Lampiran akta baptis tidak terbaca. Mohon unggah ulang dalam format PDF yang jelas.', nomor_surat: '', url_lampiran: 'lampiran/foto-akta-theresia.pdf', url_surat: '' },
    { id: 's9', id_jemaat: 'j2', id_pengurus: 'p1', jenis_surat: 'atestasi', tanggal_pengajuan: '2026-10-14', status: 'selesai', catatan: '', nomor_surat: '009/GKJ-MJN/ATS/X/2026', url_lampiran: 'lampiran/permohonan-sri.pdf', url_surat: 'surat-final/009-ATS-X-2026.pdf' },
    { id: 's10', id_jemaat: 'j12', id_pengurus: 'p3', jenis_surat: 'sidi', tanggal_pengajuan: '2026-10-05', status: 'selesai', catatan: '', nomor_surat: '008/GKJ-MJN/SDI/X/2026', url_lampiran: 'lampiran/akta-baptis-rina.pdf', url_surat: 'surat-final/008-SDI-X-2026.pdf' },
  ],
  transaksi: [
    { id: 't1', id_profiles: 'p2', tanggal: '2026-10-01', jenis_transaksi: 'pemasukan', kategori: 'Lainnya', nominal: 12500000, keterangan: 'Saldo kas pindahan dari buku kas lama (per 30 Sep 2026)', bukti_url: 'bukti/saldo-awal.jpg' },
    { id: 't2', id_profiles: 'p2', tanggal: '2026-10-04', jenis_transaksi: 'pemasukan', kategori: 'Persembahan', nominal: 4850000, keterangan: 'Persembahan Ibadah Minggu, 4 Oktober', bukti_url: 'bukti/pers-0410.jpg' },
    { id: 't3', id_profiles: 'p2', tanggal: '2026-10-11', jenis_transaksi: 'pemasukan', kategori: 'Persembahan', nominal: 5120000, keterangan: 'Persembahan Ibadah Minggu, 11 Oktober', bukti_url: 'bukti/pers-1110.jpg' },
    { id: 't4', id_profiles: 'p2', tanggal: '2026-10-12', jenis_transaksi: 'pengeluaran', kategori: 'Operasional', nominal: 1350000, keterangan: 'Tagihan listrik dan air bulan Oktober', bukti_url: 'bukti/listrik-okt.jpg' },
    { id: 't5', id_profiles: 'p2', tanggal: '2026-10-18', jenis_transaksi: 'pemasukan', kategori: 'Persepuluhan', nominal: 7400000, keterangan: 'Persepuluhan jemaat bulan Oktober', bukti_url: '' },
    { id: 't6', id_profiles: 'p2', tanggal: '2026-10-22', jenis_transaksi: 'pengeluaran', kategori: 'Diakonia', nominal: 2000000, keterangan: 'Bantuan sembako lansia Wilayah 3', bukti_url: 'bukti/sembako.jpg' },
    { id: 't7', id_profiles: 'p2', tanggal: '2026-10-25', jenis_transaksi: 'pemasukan', kategori: 'Persembahan', nominal: 4675000, keterangan: 'Persembahan Ibadah Minggu, 25 Oktober', bukti_url: 'bukti/pers-2510.jpg' },
    { id: 't8', id_profiles: 'p2', tanggal: '2026-10-29', jenis_transaksi: 'pengeluaran', kategori: 'Pembangunan', nominal: 3800000, keterangan: 'Perbaikan talang atap gedung gereja', bukti_url: 'bukti/talang.jpg' },
    { id: 't9', id_profiles: 'p2', tanggal: '2026-11-01', jenis_transaksi: 'pemasukan', kategori: 'Persembahan', nominal: 5230000, keterangan: 'Persembahan Ibadah Minggu, 1 November', bukti_url: 'bukti/pers-0111.jpg' },
    { id: 't10', id_profiles: 'p2', tanggal: '2026-11-03', jenis_transaksi: 'pengeluaran', kategori: 'Operasional', nominal: 1420000, keterangan: 'Tagihan listrik dan air bulan November', bukti_url: 'bukti/listrik-nov.jpg' },
    { id: 't11', id_profiles: 'p2', tanggal: '2026-11-08', jenis_transaksi: 'pemasukan', kategori: 'Persembahan', nominal: 4980000, keterangan: 'Persembahan Ibadah Minggu, 8 November', bukti_url: 'bukti/pers-0811.jpg' },
    { id: 't12', id_profiles: 'p2', tanggal: '2026-11-09', jenis_transaksi: 'pengeluaran', kategori: 'Diakonia', nominal: 1500000, keterangan: 'Kunjungan dan bantuan jemaat sakit', bukti_url: '' },
    { id: 't13', id_profiles: 'p2', tanggal: '2026-11-12', jenis_transaksi: 'pemasukan', kategori: 'Persepuluhan', nominal: 6900000, keterangan: 'Persepuluhan jemaat bulan November', bukti_url: '' },
    { id: 't14', id_profiles: 'p1', tanggal: '2026-11-14', jenis_transaksi: 'pengeluaran', kategori: 'Operasional', nominal: 650000, keterangan: 'Konsumsi rapat majelis', bukti_url: 'bukti/konsumsi.jpg' },
    { id: 't15', id_profiles: 'p2', tanggal: '2026-11-15', jenis_transaksi: 'pemasukan', kategori: 'Persembahan', nominal: 5105000, keterangan: 'Persembahan Ibadah Minggu, 15 November', bukti_url: 'bukti/pers-1511.jpg' },
    { id: 't16', id_profiles: 'p2', tanggal: '2026-11-16', jenis_transaksi: 'pemasukan', kategori: 'Lainnya', nominal: 2500000, keterangan: 'Donasi alat musik dari keluarga Santoso', bukti_url: 'bukti/donasi.jpg' },
    { id: 't17', id_profiles: 'p2', tanggal: '2026-11-17', jenis_transaksi: 'pengeluaran', kategori: 'Lainnya', nominal: 875000, keterangan: 'Senar dan perawatan alat musik', bukti_url: 'bukti/senar.jpg' },
  ],
  kegiatan: [
    { id: 'k1', id_profiles: 'p1', nama_kegiatan: 'Ibadah Minggu Pagi (Bahasa Jawa)', tanggal: '2026-11-22', jam: '06:30', lokasi: 'Gedung Gereja GKJ Mijen', petugas: 'Pengkhotbah: Pdt. Daniel Kurniawan\nPamuji: Bambang Sutrisno\nPemusik: Yosua Adi Nugroho', url_poster: '' },
    { id: 'k2', id_profiles: 'p1', nama_kegiatan: 'Ibadah Minggu Umum', tanggal: '2026-11-22', jam: '08:30', lokasi: 'Gedung Gereja GKJ Mijen', petugas: 'Pengkhotbah: Pdt. Daniel Kurniawan\nLiturgos: Agus Widodo\nPemusik: Rina Sutrisno\nPaduan Suara: Komisi Pemuda', url_poster: '' },
    { id: 'k3', id_profiles: 'p1', nama_kegiatan: 'Ibadah Minggu Sore', tanggal: '2026-11-22', jam: '17:00', lokasi: 'Gedung Gereja GKJ Mijen', petugas: 'Pengkhotbah: Pnt. Paulus Santoso\nLiturgos: Lestari Handayani\nPemusik: Yosua Adi Nugroho', url_poster: '' },
    { id: 'k4', id_profiles: 'p4', nama_kegiatan: 'Persekutuan Doa Wilayah 1', tanggal: '2026-11-19', jam: '19:00', lokasi: 'Rumah Kel. Sutrisno, Jl. Raya Mijen 14', petugas: 'Pemimpin: Bambang Sutrisno\nRenungan: Pdt. Daniel Kurniawan', url_poster: '' },
    { id: 'k5', id_profiles: 'p4', nama_kegiatan: 'Latihan Paduan Suara', tanggal: '2026-11-20', jam: '19:00', lokasi: 'Gedung Gereja GKJ Mijen', petugas: 'Pelatih: Rina Sutrisno\nPemusik: Yosua Adi Nugroho', url_poster: samplePoster('KOMISI MUSIK GEREJA', ['Latihan', 'Paduan Suara'], 'Jumat, 20 November 2026 · 19.00', 'Gedung Gereja GKJ Mijen', '#F3EBDE', '#3B1512') },
    { id: 'k6', id_profiles: 'p4', nama_kegiatan: 'Persekutuan Pemuda', tanggal: '2026-11-21', jam: '18:30', lokasi: 'Ruang Serbaguna', petugas: 'Pemimpin: Maria Setyaningsih\nPemusik: Yosua Adi Nugroho', url_poster: '' },
    { id: 'k7', id_profiles: 'p4', nama_kegiatan: 'Sekolah Minggu', tanggal: '2026-11-22', jam: '08:30', lokasi: 'Ruang Serbaguna', petugas: 'Guru: Lestari Handayani\nGuru: Natalia Putri Santoso', url_poster: '' },
    { id: 'k8', id_profiles: 'p1', nama_kegiatan: 'Rapat Majelis', tanggal: '2026-11-25', jam: '19:00', lokasi: 'Ruang Konsistori', petugas: 'Pemimpin: Pdt. Daniel Kurniawan\nNotulis: Yohanes Prasetyo', url_poster: '' },
    { id: 'k9', id_profiles: 'p4', nama_kegiatan: 'Persekutuan Doa Wilayah 3', tanggal: '2026-11-26', jam: '19:00', lokasi: 'Rumah Kel. Santoso, Wonoplumbon', petugas: 'Pemimpin: Paulus Santoso\nRenungan: Pdt. Daniel Kurniawan', url_poster: '' },
    { id: 'k10', id_profiles: 'p4', nama_kegiatan: 'Latihan Drama Natal', tanggal: '2026-11-28', jam: '15:00', lokasi: 'Ruang Serbaguna', petugas: 'Sutradara: Maria Setyaningsih', url_poster: samplePoster('PERSIAPAN NATAL 2026', ['Latihan', 'Drama Natal'], 'Sabtu, 28 November 2026 · 15.00', 'Ruang Serbaguna', '#7B2E26', '#FAF5EF') },
    { id: 'k11', id_profiles: 'p1', nama_kegiatan: 'Ibadah Minggu Umum', tanggal: '2026-11-15', jam: '08:30', lokasi: 'Gedung Gereja GKJ Mijen', petugas: 'Pengkhotbah: Pdt. Daniel Kurniawan\nLiturgos: Bambang Sutrisno', url_poster: '' },
    { id: 'k12', id_profiles: 'p1', nama_kegiatan: 'Ibadah Minggu Umum', tanggal: '2026-11-29', jam: '08:30', lokasi: 'Gedung Gereja GKJ Mijen', petugas: 'Pengkhotbah: Pdt. Tamu (GKJ Ngaliyan)\nLiturgos: Agus Widodo', url_poster: '' },
  ],
  warta: [
    { id: 'w1', id_profiles: 'p1', judul: 'Warta Jemaat Minggu, 22 November 2026', isi: '<h3>Pokok Doa</h3><ul><li>Jemaat yang sedang sakit: Ibu Sri Rahayu.</li><li>Persiapan perayaan Natal 2026.</li></ul><h3>Pengumuman</h3><p>Persekutuan Doa Wilayah 3 diadakan Kamis, 26 November 2026 pukul 19.00 di rumah Kel. Santoso.</p>', status: 'draf', tanggal_terbit: '', url_pdf: '' },
    { id: 'w2', id_profiles: 'p1', judul: 'Warta Jemaat Minggu, 15 November 2026', isi: '<h3>Pengumuman</h3><p>Persembahan Minggu lalu sebesar <b>Rp 4.980.000</b>. Terima kasih atas kesetiaan jemaat.</p><p>Latihan paduan suara setiap Jumat pukul 19.00.</p>', status: 'terbit', tanggal_terbit: '2026-11-14', url_pdf: 'warta/warta-jemaat-15-november-2026.pdf' },
    { id: 'w3', id_profiles: 'p4', judul: 'Undangan Persiapan Perayaan Natal 2026', isi: '<p>Seluruh komisi diundang dalam rapat persiapan Natal pada Sabtu, 21 November 2026 pukul 16.00 di Ruang Serbaguna.</p>', status: 'terbit', tanggal_terbit: '2026-11-12', url_pdf: '' },
    { id: 'w4', id_profiles: 'p2', judul: 'Laporan Persembahan Bulan Oktober 2026', isi: '<p>Total pemasukan bulan Oktober sebesar Rp 34.545.000 dan pengeluaran Rp 7.150.000. Rincian dapat dilihat di papan pengumuman.</p>', status: 'terbit', tanggal_terbit: '2026-11-06', url_pdf: 'warta/laporan-persembahan-oktober-2026.pdf' },
    { id: 'w5', id_profiles: 'p1', judul: 'Warta Jemaat Minggu, 8 November 2026', isi: '<p>Ibadah Perjamuan Kudus akan dilaksanakan pada Minggu, 6 Desember 2026.</p>', status: 'terbit', tanggal_terbit: '2026-11-07', url_pdf: '' },
    { id: 'w6', id_profiles: 'p3', judul: 'Pendaftaran Katekisasi Sidi Angkatan 2027', isi: '<p>Pendaftaran katekisasi sidi dibuka hingga 31 Desember 2026. Silakan menghubungi sekretariat gereja.</p>', status: 'draf', tanggal_terbit: '', url_pdf: '' },
    { id: 'w7', id_profiles: 'p1', judul: 'Warta Jemaat Minggu, 1 November 2026', isi: '<p>Selamat datang kepada jemaat dan tamu yang beribadah bersama kami.</p>', status: 'terbit', tanggal_terbit: '2026-10-31', url_pdf: '' },
    { id: 'w8', id_profiles: 'p4', judul: 'Kerja Bakti Bersih Gereja', isi: '<p>Kerja bakti membersihkan lingkungan gereja pada Sabtu, 24 Oktober 2026 pukul 07.00.</p>', status: 'terbit', tanggal_terbit: '2026-10-24', url_pdf: '' },
  ],
};
