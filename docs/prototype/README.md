# Prototype UI Admin – GKJ Mijen

Rancangan tampilan bagian **Pengurus Gereja (admin)** sebagai acuan tim frontend.

## Isi folder

| File | Keterangan |
|---|---|
| `prototype-admin.html` | Prototype yang bisa diklik. Buka langsung di browser (cukup klik dua kali). Data contoh hanya tersimpan sementara dan kembali ke awal saat halaman dimuat ulang. |
| `prompt-ui-admin.md` | Prompt lengkap yang dipakai untuk menyusun prototype: palet warna, tipografi, daftar halaman, dan field per tabel. |
| `referensi-color-palette.jpeg` | Referensi tampilan landing page yang menjadi sumber palet warna. |

Aset gambar yang dipakai prototype ada di `public/images/`:

| File | Keterangan |
|---|---|
| `logo-gkj.jpeg` | Logo GKJ asli (garis abu-abu di atas latar hitam). |
| `logo-gkj-transparan.png` | Logo yang sama dengan latar transparan, untuk diwarnai lewat CSS `mask`. |
| `foto-gkj-mijen.jpeg` | Foto gedung GKJ Mijen untuk halaman login dan register. |

## Halaman di prototype

Login, Register, Lupa Kata Sandi, Atur Ulang Kata Sandi, Dashboard, Data Jemaat (daftar, form, detail), Permohonan Surat (daftar, proses), Transaksi Keuangan (daftar, form), Laporan & Rekap, Kegiatan (tabel, kalender, form dengan upload poster PNG/JPG), Warta (daftar, editor dengan upload PDF), Akun Pengguna, dan Profil Saya.

Akun demo di halaman login: `yohanes.prasetyo@gkjmijen.or.id` dengan kata sandi apa saja minimal 8 karakter.

## Palet warna

| Token | HEX | Dipakai untuk |
|---|---|---|
| Primary Maroon | `#7B2E26` | Tombol utama, menu aktif, angka penting |
| Primary Hover | `#62231C` | Hover tombol utama |
| Deep Burgundy | `#3B1512` | Sidebar, panel kiri halaman login |
| Espresso | `#291A17` | Teks judul |
| Cream | `#FAF5EF` | Latar halaman |
| Sand | `#F3EBDE` | Header tabel, area filter |
| Beige | `#EADFCB` | Border, garis pemisah |
| Warm White | `#FFFDF9` | Card, tabel, modal |
| Rose Soft | `#E8D0C4` | Lingkaran ikon, logo di latar gelap |
| Terracotta | `#B07066` | Label kecil huruf kapital |
| Text Muted | `#7A6A64` | Teks sekunder |

Font: **Cormorant Garamond** untuk judul, **Jost** untuk isi (Google Fonts).

Contoh memakai logo transparan dengan warna palet:

```css
.logo-gkj {
  width: 46px;
  height: 46px;
  background-color: #E8D0C4; /* Rose Soft di latar gelap, #7B2E26 di latar terang */
  -webkit-mask: url('/images/logo-gkj-transparan.png') center / contain no-repeat;
  mask: url('/images/logo-gkj-transparan.png') center / contain no-repeat;
}
```

## Catatan penamaan

Antarmuka tidak memakai kata "SIM" atau "Sistem Informasi Manajemen", karena web ini akan dipakai langsung oleh jemaat dan pengurus GKJ Mijen. Sebutan yang dipakai: **GKJ Mijen**, **Portal Pelayanan Jemaat**, dan **Panel Pengurus**.
