# Frontend Sisi Jemaat (Landing Page + Portal Warga)

## Rute baru
| Rute | Isi | Login? |
|---|---|---|
| `/` | Landing page: hero + ibadah berikutnya, mengenal GKJ, jadwal & agenda 7 hari, warta, siaran, renungan | Tidak |
| `/portal` | Dashboard warga | Warga |
| `/portal/ajukan` | Ajukan surat (`?layanan=sidi`, `?ulang=<id surat ditolak>`) | Warga |
| `/portal/status` | Status permohonan (`?filter=proses\|selesai\|ditolak`) | Warga |
| `/portal/status/[id]` | Detail, riwayat, unduh surat | Warga |

Akun demo warga: `bambang.sutrisno@gmail.com`, kata sandi apa saja (min. 8 karakter).

## Arsip siaran otomatis (YouTube)
- Endpoint `GET /api/siaran` (`src/app/api/siaran/route.ts`) mengambil siaran terbaru kanal **@gkjmijensemarang7380** (ID `UC9yDMX-0sadi5-PV2U-GilQ`), di-cache 30 menit, batas tunggu 6 detik.
- **Tanpa kunci**: memakai feed RSS kanal (15 video terakhir), disaring judul berisi "ibadah/live".
- **Lebih akurat (opsional)**: isi `YOUTUBE_API_KEY=...` di `.env.local` (YouTube Data API v3 dari Google Cloud Console). Hanya siaran live yang tampil, termasuk penanda **LIVE** saat ibadah sedang tayang dan **Akan tayang**.
- Bila YouTube gagal, landing memakai arsip cadangan di `features/landing/content.ts`.
- `src/middleware.ts`: `api/siaran` dikecualikan dari pemeriksaan sesi supaya bisa diakses pengunjung tanpa login.

## Foto "Mengenal GKJ Mijen"
Simpan foto di `public/images/gkjmijen.png`. Selama berkas belum ada, foto gedung dipakai otomatis.

## Alur login
- Navbar landing → tombol **Login** → `/login` (halaman tim auth).
- Klik **Layanan Surat** saat belum login → popup "Login diperlukan" → `/login?next=/portal/ajukan`.
- Setelah login: warga → `/portal` (atau `next`), pengurus → `/dashboard`.
- Warga yang membuka panel pengurus dialihkan ke `/portal`; pengurus yang membuka `/portal` dialihkan ke `/dashboard`.

## Perubahan kecil di file tim lain
- `lib/mock/store.tsx`: akun warga boleh login (hapus 1 baris penolakan).
- `app/(auth)/login/page.tsx`: arahkan sesuai peran + dukung `?next=` + contoh akun demo warga.
- `app/(auth)/layout.tsx`: logo kembali ke `/`.
- `components/layouts/AppShell.tsx`: warga dialihkan ke `/portal`; menu "landing page" di header sekarang membuka `/`.
- `lib/constants/routes.ts`: `ROUTES.PORTAL` + `routePortalSurat()`.
- `middleware.ts`: tambah pengecualian `api/siaran` di matcher.
- `lib/mock/types.ts`, `constants.ts`, `data.ts`: kolom opsional `keterangan`, `DEMO_WARGA_EMAIL`, 2 data contoh (s11, s12).

## Untuk tim backend
1. **Kolom baru `permohonan_surat.keterangan` (text, nullable)**: isian formulir warga, baris `Label: isi`. Kolom `catatan` tetap untuk catatan pengurus.
2. Layanan di formulir: Baptis Anak & Baptis Dewasa (→ `jenis_surat = 'baptis'`), Sidi, Atestasi. Pilihan disimpan di baris pertama `keterangan` (`Layanan: Baptis Anak`).
3. Titik sambung (cari `TODO [Backend]`):
   - `features/portal/usePortalData.ts`: query jemaat milik `auth.uid()` + permohonannya.
   - `features/portal/components/AjukanSurat.tsx` → `kirim()`: unggah lampiran ke Storage + insert.
   - `features/portal/components/DetailSurat.tsx` → `unduh()`: unduh `url_surat` (signed URL). Sekarang mencetak pratinjau surat.
   - `features/landing/components/WartaSection.tsx`: tombol unduh PDF warta.
4. Landing hanya menampilkan warta `status = 'terbit'` dan semua kegiatan; RLS perlu mengizinkan `select` publik untuk keduanya.

## Konten yang bisa diubah tanpa menyentuh komponen
`features/landing/content.ts`: alamat, kontak, sosmed, jadwal rutin, arsip siaran (ganti `href` dengan link video asli), renungan.
