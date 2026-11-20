# Backend – Supabase (SIM GKJ Mijen)

Backend memakai **Supabase**: PostgreSQL (6 tabel sesuai ERD laporan), Auth (login/daftar/reset kata sandi), dan Storage (berkas).
Semua akses data memakai **token pengguna yang login**, sehingga **Row Level Security (RLS)** di database selalu berlaku.

## 1. Menyiapkan database (sekali saja)

| Situasi | Jalankan di Supabase → SQL Editor |
|---|---|
| Project Supabase **baru** | `supabase/schema.sql`, lalu (opsional) `supabase/seed.sql` untuk data contoh |
| Database yang sudah dibuat sebelum 20 Nov 2026 | `supabase/patch-01-poster-pdf-hapus-akun.sql` (aman diulang) |

Lalu jadikan akun pertama sebagai pengurus:

```sql
update profiles set peran = 'pengurus' where email = 'email-anda@contoh.com';
```

> Jika login selalu ditolak padahal peran sudah `pengurus`, pastikan bagian **IZIN DATA API (GRANT)** di `schema.sql` sudah dijalankan.

Pengaturan Auth di dashboard Supabase:
- **Authentication → URL Configuration**: tambahkan `http://localhost:3000/**` ke *Redirect URLs* (untuk tautan reset kata sandi & konfirmasi email).
- Selama pengembangan boleh mematikan **Confirm email** (Authentication → Sign In / Providers → Email) supaya akun baru bisa langsung login.

## 2. Menjalankan aplikasi

```
cp .env.example .env.local   # isi NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY (publishable key)
npm install
npm run dev
```

Jika `.env.local` belum diisi, aplikasi otomatis berjalan dalam **MODE DEMO** (data contoh di `src/lib/data/demo-seed.ts`),
jadi tim frontend tetap bisa bekerja tanpa database.

## 3. Alur data di kode

```
Komponen (features/*/components)
   │  const { db, setDb, user } = useData()
   ▼
src/lib/data/store.tsx  ── kunci terisi? ──► supabase-store.tsx  (data asli)
                         └─ belum ────────► demo-store.tsx      (data contoh)
```

| File | Isi |
|---|---|
| `src/lib/data/types.ts` | Tipe data tampilan (sama dengan ERD; kunci primer ditulis `id`) |
| `src/lib/data/mapping.ts` | Pemetaan kolom database ⇄ tampilan (`id_jemaat` ⇄ `id`, `null` ⇄ `''`, jam) |
| `src/lib/data/supabase-store.tsx` | Memuat data, login/daftar/logout, reset kata sandi |
| `src/lib/data/sync.ts` | Mendeteksi baris baru/berubah/terhapus dari `setDb` lalu menyimpannya ke Supabase |
| `src/lib/data/files.ts` | Unggah & buka berkas di Supabase Storage |
| `src/lib/supabase/*` | Klien Supabase (browser, server, middleware) |
| `src/types/database.types.ts` | Tipe tabel Supabase |

Komponen cukup memanggil `setDb(...)` seperti biasa. Tampilan langsung berubah, lalu perubahan dikirim ke Supabase.
Jika ditolak (misalnya oleh RLS), muncul notifikasi merah dan data dimuat ulang dari database.

## 4. Hak akses (Tabel 3 laporan)

| Data | Pengunjung | Warga | Pengurus |
|---|---|---|---|
| Kegiatan, warta terbit | lihat | lihat | CRUD |
| Data jemaat | – | lihat/ubah miliknya | CRUD |
| Permohonan surat | – | ajukan & lihat miliknya | lihat & proses |
| Keuangan, rekap | – | – | CRUD |
| Akun | – | ubah miliknya (tidak bisa ubah peran) | lihat, ubah, hapus (`hapus_akun()`) |

Panel admin (`/dashboard`, dst.) hanya bisa dibuka **pengurus**; warga yang mencoba login mendapat pesan peringatan.

## 5. Storage

| Bucket | Akses | Dipakai untuk |
|---|---|---|
| `bukti-transaksi` | privat (pengurus) | foto bukti transaksi |
| `lampiran` | privat (warga pemilik & pengurus) | lampiran permohonan surat |
| `surat` | privat (warga pemilik & pengurus) | surat final PDF, path `<id akun warga>/<berkas>` |
| `publik` | publik | poster kegiatan, PDF warta |

Bucket privat: database menyimpan **path** berkas; tampilan memakai URL bertanda tangan (berlaku 6 jam).

## 6. Belum dikerjakan

- Halaman untuk **warga** (mengajukan surat, unggah lampiran, unduh surat). Database & RLS-nya sudah siap.
- Landing page publik (jadwal & warta terbit). Bisa membaca tabel `kegiatan` dan `warta` (status `terbit`) tanpa login.
- `features/*/actions.ts` masih placeholder dan tidak dipakai; seluruh data saat ini lewat `src/lib/data`.
- Ekspor rekap ke PDF / Excel.
