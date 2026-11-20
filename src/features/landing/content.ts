/**
 * Konten tetap di landing page (bukan dari basis data).
 * Jadwal kegiatan & warta TIDAK di sini: keduanya diambil dari data yang diisi pengurus.
 * Ubah teks di file ini bila ada informasi gereja yang berubah.
 */

export const GEREJA = {
  nama: 'Gereja Kristen Jawa Mijen',
  kota: 'Semarang',
  alamat: 'Jl. Raya Semarang-Boja, Mijen, Kec. Mijen, Kota Semarang, Jawa Tengah 50215',
  telp: '(024) 7711150',
  email: 'gkjmijensemarang@gmail.com',
  jumlahUmat: 5000,
  sosmed: [
    { label: 'Instagram @gkj_mijensemarang', icon: 'instagram', href: 'https://www.instagram.com/gkj_mijensemarang' },
    { label: 'Facebook GKJ Mijen Semarang', icon: 'facebook', href: 'https://www.facebook.com/search/top?q=GKJ%20Mijen%20Semarang' },
    { label: 'YouTube GKJ Mijen Semarang', icon: 'youtube', href: 'https://www.youtube.com/@gkjmijensemarang7380' },
    { label: 'gkjmijensemarang.blogspot.com', icon: 'globe2', href: 'https://gkjmijensemarang.blogspot.com' },
  ],
};

/**
 * Bagian "Mengenal GKJ Mijen".
 * Foto: simpan berkas di public/images/gkjmijen.png. Selama belum ada, foto gedung dipakai sebagai cadangan.
 */
export const TENTANG = {
  foto: '/images/gkjmijen.png',
  fotoCadangan: '/images/foto-gkj-mijen.jpeg',
  tahun: '1997',
  induk: 'GKJ Karangayu',
  motto: 'Menjadi Gereja yang Berakar',
  paragraf: [
    'Gereja Kristen Jawa (GKJ) Mijen merupakan bagian dari persekutuan Sinode Gereja-gereja Kristen Jawa di lingkup Klasis Semarang Barat yang telah bertumbuh sejak didewasakan dari GKJ Karangayu pada tahun 1997. Hadir sebagai rumah bersama bagi umat untuk bertumbuh dalam iman, kasih, dan pengharapan kepada Tuhan Yesus Kristus, GKJ Mijen merangkul setiap generasi, mulai dari anak, remaja dan pemuda (Korempa), dewasa, hingga adiyuswo, dalam kehangatan keluarga Allah.',
    'Berlandaskan semangat "Menjadi Gereja yang Berakar", kehidupan bergereja dihidupi melalui ibadah yang berpusat pada Firman Tuhan, kebersamaan Persekutuan Blok dan pepanthan, hingga berbagai pelayanan diakonia dan aksi sosial. Dengan tangan terbuka, GKJ Mijen terus berkomitmen menghadirkan gereja yang harmonis, peduli terhadap keutuhan ciptaan, serta menjadi berkat nyata bagi jemaat dan masyarakat sekitar.',
  ],
};

/** Jadwal ibadah rutin mingguan. hari: 0 = Minggu, 1 = Senin, dst. */
export const IBADAH_RUTIN = [
  { hari: 0, label: 'Minggu', items: [
    { mulai: '06:30', selesai: '08:00', nama: 'Ibadah Minggu Pagi (Bahasa Jawa)' },
    { mulai: '08:30', selesai: '10:00', nama: 'Ibadah Minggu Umum' },
    { mulai: '17:00', selesai: '18:30', nama: 'Ibadah Minggu Sore' },
  ] },
  { hari: 1, label: 'Senin', items: [{ mulai: '09:00', selesai: '15:00', nama: 'Pelayanan Sekretariat' }] },
];

export const JAM_PELAYANAN = ['Minggu 07.00–12.00', 'Senin 09.00–15.00'];

/**
 * Arsip CADANGAN: hanya tampil jika siaran terbaru dari YouTube gagal dimuat (lihat /api/siaran).
 */
const KANAL = 'https://www.youtube.com/@gkjmijensemarang7380/streams';
export const SIARAN = [
  { tanggal: '2026-11-15', tema: 'Setia dalam Terang Keadilan Allah', bacaan: 'Matius 25:14–30', pengkhotbah: 'Pdt. Denny I.', durasi: '1.05.15', href: KANAL, warna: 'malam' },
  { tanggal: '2026-11-08', tema: 'Tansah Siyaga', bacaan: 'Matius 25:1–13', pengkhotbah: 'Pdt. Em. Imanuel Agus Purwadi', durasi: '1.48.10', href: KANAL, warna: 'kayu' },
  { tanggal: '2026-11-01', tema: 'Menguasai Diri dalam Kerendahan Hati dan Melayani', bacaan: 'Matius 23:1–12', pengkhotbah: 'Pdt. Denny I.', durasi: '1.41.25', href: KANAL, warna: 'fajar' },
  { tanggal: '2026-10-25', tema: 'Meneladankan Kasih, Mewariskan Iman', bacaan: 'Matius 22:34–46', pengkhotbah: 'Pdt. Denny I.', durasi: '1.46.42', href: KANAL, warna: 'batu' },
  { tanggal: '2026-10-18', tema: 'Menghadap Tuhan, Menegakkan Altar Keluarga', bacaan: 'Matius 22:15–22', pengkhotbah: 'Pdt. Em. Wiworo Adi K.S.', durasi: '1.52.01', href: KANAL, warna: 'daun' },
  { tanggal: '2026-10-11', tema: 'Nampik Brahala, Milih Setya', bacaan: 'Matius 22:1–14', pengkhotbah: 'Pdt. Timotius Purwanto', durasi: '1.41.34', href: KANAL, warna: 'pasir' },
] as const;

/**
 * Renungan singkat untuk slider. Tulisan sendiri (bukan kutipan ayat utuh),
 * dengan rujukan ayat agar jemaat bisa membaca langsung di Alkitab.
 * TODO: pengurus bisa mengganti isinya sesuai tema bulan berjalan.
 */
export const RENUNGAN = [
  { teks: 'Iman, pengharapan, dan kasih tinggal tetap. Yang paling besar di antaranya ialah kasih.', rujukan: 'Bdk. 1 Korintus 13:13' },
  { teks: 'Bertekun bersama dalam pengajaran, persekutuan, dan doa membuat jemaat bertumbuh setiap hari.', rujukan: 'Bdk. Kisah Para Rasul 2:42' },
  { teks: 'Saling menanggung beban adalah cara sederhana untuk hidup menurut hukum Kristus.', rujukan: 'Bdk. Galatia 6:2' },
  { teks: 'Datanglah dengan hati yang tenang; Tuhan memelihara mereka yang berharap kepada-Nya.', rujukan: 'Bdk. Mazmur 62:2' },
];
