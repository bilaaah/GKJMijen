/**
 * Tipe data yang dipakai seluruh tampilan.
 * Mengikuti ERD di laporan perancangan basis data. Satu-satunya perbedaan dengan
 * tabel Supabase: kunci primer selalu bernama `id` di sini (di database
 * id_jemaat, id_permohonan, dst.). Pemetaannya ada di src/lib/data/mapping.ts.
 */

export type Peran = 'warga' | 'pengurus';

export interface Profile {
  id: string;
  nama: string;
  email: string;
  peran: Peran;
  created_at: string;
}

export interface Jemaat {
  id: string;
  id_profiles: string | null;
  nama: string;
  no_hp: string;
  alamat: string;
  data_keluarga: string;
  wilayah: string;
  status_baptis: boolean;
  status_sidi: boolean;
}

export type JenisSurat = 'baptis' | 'sidi' | 'atestasi';
export type StatusSurat = 'diajukan' | 'diproses' | 'selesai' | 'ditolak';

export interface PermohonanSurat {
  id: string;
  id_jemaat: string;
  id_pengurus: string | null;
  jenis_surat: JenisSurat;
  tanggal_pengajuan: string;
  status: StatusSurat;
  catatan: string;
  nomor_surat: string;
  url_lampiran: string;
  url_surat: string;
}

export type JenisTransaksi = 'pemasukan' | 'pengeluaran';

export interface TransaksiKeuangan {
  id: string;
  id_profiles: string;
  tanggal: string;
  jenis_transaksi: JenisTransaksi;
  kategori: string;
  nominal: number;
  keterangan: string;
  bukti_url: string;
}

export interface Kegiatan {
  id: string;
  id_profiles: string;
  nama_kegiatan: string;
  tanggal: string;
  jam: string;
  lokasi: string;
  petugas: string;
  url_poster: string;
}

export type StatusWarta = 'draf' | 'terbit';

export interface Warta {
  id: string;
  id_profiles: string;
  judul: string;
  isi: string;
  status: StatusWarta;
  tanggal_terbit: string;
  url_pdf: string;
}

export interface DB {
  profiles: Profile[];
  jemaat: Jemaat[];
  surat: PermohonanSurat[];
  transaksi: TransaksiKeuangan[];
  kegiatan: Kegiatan[];
  warta: Warta[];
}

/** @deprecated nama lama, pakai DB */
export type MockDB = DB;
