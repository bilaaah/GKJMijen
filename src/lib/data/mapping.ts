/**
 * Pemetaan antara baris tabel Supabase (sesuai ERD) dan tipe data tampilan.
 *
 * Perbedaan yang ditangani di sini:
 * - kunci primer: database `id_jemaat`, `id_permohonan`, ... ⇄ tampilan `id`
 * - nilai kosong: database `null` ⇄ tampilan '' (string kosong)
 * - jam: database '08:30:00' ⇄ tampilan '08:30'
 * - berkas privat: database menyimpan path di Storage ⇄ tampilan memakai URL bertanda tangan
 */
import type { DB, Jemaat, Kegiatan, PermohonanSurat, Profile, TransaksiKeuangan, Warta } from './types';
import { berkasKeDb, isFileField } from './files';

/** Nama tabel tampilan (kunci di DB) → tabel Supabase + nama kolom kunci primer. */
export const TABEL = {
  jemaat: { table: 'jemaat', pk: 'id_jemaat' },
  surat: { table: 'permohonan_surat', pk: 'id_permohonan' },
  transaksi: { table: 'transaksi_keuangan', pk: 'id_transaksi' },
  kegiatan: { table: 'kegiatan', pk: 'id_kegiatan' },
  warta: { table: 'warta', pk: 'id_warta' },
} as const;

export type KunciTabel = keyof typeof TABEL;

/** Urutan simpan: induk dulu (jemaat sebelum surat). Hapus memakai urutan terbalik. */
export const URUTAN_SIMPAN: KunciTabel[] = ['jemaat', 'surat', 'transaksi', 'kegiatan', 'warta'];

/** Kolom yang di database boleh null: string kosong di tampilan disimpan sebagai null. */
const KOLOM_NULLABLE = new Set([
  'id_profiles',
  'id_pengurus',
  'no_hp',
  'alamat',
  'data_keluarga',
  'wilayah',
  'catatan',
  'nomor_surat',
  'url_lampiran',
  'url_surat',
  'keterangan',
  'bukti_url',
  'jam',
  'lokasi',
  'petugas',
  'url_poster',
  'isi',
  'tanggal_terbit',
  'url_pdf',
]);

type Row = Record<string, unknown>;

const s = (v: unknown): string => (v === null || v === undefined ? '' : String(v));

/* ------------------------------ database → tampilan ------------------------------ */

export function profileDariDb(r: Row): Profile {
  return { id: s(r.id), nama: s(r.nama), email: s(r.email), peran: r.peran === 'pengurus' ? 'pengurus' : 'warga', created_at: s(r.created_at).slice(0, 10) };
}

export function jemaatDariDb(r: Row): Jemaat {
  return {
    id: s(r.id_jemaat),
    id_profiles: (r.id_profiles as string | null) ?? null,
    nama: s(r.nama),
    no_hp: s(r.no_hp),
    alamat: s(r.alamat),
    data_keluarga: s(r.data_keluarga),
    wilayah: s(r.wilayah),
    status_baptis: !!r.status_baptis,
    status_sidi: !!r.status_sidi,
  };
}

export function suratDariDb(r: Row): PermohonanSurat {
  return {
    id: s(r.id_permohonan),
    id_jemaat: s(r.id_jemaat),
    id_pengurus: (r.id_pengurus as string | null) ?? null,
    jenis_surat: r.jenis_surat as PermohonanSurat['jenis_surat'],
    tanggal_pengajuan: s(r.tanggal_pengajuan),
    status: r.status as PermohonanSurat['status'],
    catatan: s(r.catatan),
    nomor_surat: s(r.nomor_surat),
    url_lampiran: s(r.url_lampiran),
    url_surat: s(r.url_surat),
  };
}

export function transaksiDariDb(r: Row): TransaksiKeuangan {
  return {
    id: s(r.id_transaksi),
    id_profiles: s(r.id_profiles),
    tanggal: s(r.tanggal),
    jenis_transaksi: r.jenis_transaksi as TransaksiKeuangan['jenis_transaksi'],
    kategori: s(r.kategori),
    nominal: Number(r.nominal) || 0,
    keterangan: s(r.keterangan),
    bukti_url: s(r.bukti_url),
  };
}

export function kegiatanDariDb(r: Row): Kegiatan {
  return {
    id: s(r.id_kegiatan),
    id_profiles: s(r.id_profiles),
    nama_kegiatan: s(r.nama_kegiatan),
    tanggal: s(r.tanggal),
    jam: s(r.jam).slice(0, 5),
    lokasi: s(r.lokasi),
    petugas: s(r.petugas),
    url_poster: s(r.url_poster),
  };
}

export function wartaDariDb(r: Row): Warta {
  return {
    id: s(r.id_warta),
    id_profiles: s(r.id_profiles),
    judul: s(r.judul),
    isi: s(r.isi),
    status: r.status === 'terbit' ? 'terbit' : 'draf',
    tanggal_terbit: s(r.tanggal_terbit),
    url_pdf: s(r.url_pdf),
  };
}

/* ------------------------------ tampilan → database ------------------------------ */

/**
 * Ubah (sebagian) baris tampilan menjadi kolom database.
 * `id` dibuang (atau diganti nama kolom PK bila `sertakanPk`), '' → null untuk kolom nullable,
 * dan URL berkas privat dikembalikan menjadi path Storage.
 */
export function keDb(kunci: KunciTabel, data: Record<string, unknown>, sertakanPk = false): Row {
  const out: Row = {};
  for (const [k, v] of Object.entries(data)) {
    if (k === 'id') {
      if (sertakanPk) out[TABEL[kunci].pk] = v;
      continue;
    }
    let nilai = v;
    if (isFileField(kunci, k) && typeof nilai === 'string') nilai = berkasKeDb(nilai);
    if (nilai === '' && KOLOM_NULLABLE.has(k)) nilai = null;
    out[k] = nilai;
  }
  return out;
}

/** Field yang nilainya berbeda antara dua baris (untuk UPDATE seperlunya). */
export function fieldBerubah<T extends { id: string }>(lama: T, baru: T): Partial<T> | null {
  const patch: Partial<T> = {};
  let ada = false;
  for (const k of Object.keys(baru) as (keyof T)[]) {
    if (k === 'id') continue;
    if (lama[k] !== baru[k]) {
      patch[k] = baru[k];
      ada = true;
    }
  }
  return ada ? patch : null;
}

export const DB_KOSONG: DB = { profiles: [], jemaat: [], surat: [], transaksi: [], kegiatan: [], warta: [] };
