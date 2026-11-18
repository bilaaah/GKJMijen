# Frontend Admin – Mode Tanpa Backend

Tampilan panel pengurus sudah bisa diklik penuh memakai **data contoh**, tanpa Supabase.
Acuan desain: `docs/prototype/`.

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Halaman login memakai akun demo `yohanes.prasetyo@gkjmijen.or.id` dengan kata sandi apa saja minimal 8 karakter (tombol **Isi otomatis** tersedia).

> Jika folder proyek berada di jalur yang mengandung karakter `&` (misalnya `Sistem Informasi & Manajemen`), `npm run dev` gagal di Windows. Jalankan `node node_modules/next/dist/bin/next dev` atau pindahkan folder ke jalur tanpa `&`.

## Cara kerja mode frontend

- **Middleware** (`src/middleware.ts`): selama `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` di `.env.local` masih kosong atau masih contoh, pemeriksaan sesi Supabase dilewati. Begitu kunci asli diisi, proteksi Supabase aktif kembali.
- **Data contoh** ada di `src/lib/mock/`:
  - `types.ts` – tipe data mengikuti ERD di laporan (profiles, jemaat, permohonan_surat, transaksi_keuangan, kegiatan, warta) ditambah `warta.url_pdf` dan `kegiatan.url_poster`.
  - `data.ts` – isi data contoh.
  - `store.tsx` – `useMock()` untuk membaca/mengubah data. Perubahan tersimpan di `sessionStorage` tab browser dan hilang saat tab ditutup.
- **Unggah berkas** (surat final PDF, foto bukti, poster PNG/JPG, warta PDF) divalidasi tipe dan ukurannya, lalu hanya disimpan sebagai pratinjau di browser.
- **Unduh / Cetak PDF / Ekspor Excel** baru menampilkan notifikasi.

## Halaman

| Rute | Isi |
|---|---|
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Autentikasi |
| `/dashboard` | Ringkasan |
| `/jemaat`, `/jemaat/tambah`, `/jemaat/[id]`, `/jemaat/[id]/ubah` | Data Jemaat |
| `/surat`, `/surat/[id]` | Permohonan Surat |
| `/keuangan`, `/keuangan/tambah`, `/keuangan/[id]`, `/keuangan/laporan` | Keuangan |
| `/jadwal-warta`, `/jadwal-warta/kegiatan/tambah`, `/jadwal-warta/kegiatan/[id]` | Kegiatan |
| `/jadwal-warta/warta`, `/jadwal-warta/warta/tulis`, `/jadwal-warta/warta/[id]` | Warta |
| `/akun`, `/profil` | Pengaturan |

`/` sementara diarahkan ke `/login` sampai landing page publik dibuat.

## Untuk tim backend

- Komponen tiap modul ada di `src/features/*/components/`. Setiap pemanggilan `useMock()` / `setDb()` adalah titik yang nanti diganti dengan Server Actions di `src/features/*/actions.ts`.
- `src/features/*/types.ts` dan `supabase/schema.sql` belum diubah. Keduanya masih berbeda dengan ERD di laporan, jadi perlu disamakan sebelum disambungkan.
- Fitur Akun Pengguna dan Profil ditempatkan di `src/features/akun/`.
