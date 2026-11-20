'use client';

/**
 * Unggah & tampilkan berkas lewat Supabase Storage.
 *
 * Bucket (dibuat oleh supabase/schema.sql):
 * - `bukti-transaksi` (privat)  → transaksi_keuangan.bukti_url
 * - `lampiran`        (privat)  → permohonan_surat.url_lampiran (diunggah warga)
 * - `surat`           (privat)  → permohonan_surat.url_surat, path: <id akun warga>/<berkas>
 * - `publik`          (publik)  → kegiatan.url_poster, warta.url_pdf
 *
 * Bucket privat: database menyimpan PATH berkas; tampilan menerima URL bertanda tangan
 * (berlaku 6 jam). Bucket publik: database langsung menyimpan URL publiknya.
 */
import type { DB } from './types';
import type { KunciTabel } from './mapping';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const MASA_BERLAKU_DETIK = 6 * 60 * 60;

interface InfoBerkas {
  bucket: 'bukti-transaksi' | 'lampiran' | 'surat' | 'publik';
  privat: boolean;
}

const FIELD_BERKAS: Partial<Record<KunciTabel, Record<string, InfoBerkas>>> = {
  transaksi: { bukti_url: { bucket: 'bukti-transaksi', privat: true } },
  surat: { url_lampiran: { bucket: 'lampiran', privat: true }, url_surat: { bucket: 'surat', privat: true } },
  kegiatan: { url_poster: { bucket: 'publik', privat: false } },
  warta: { url_pdf: { bucket: 'publik', privat: false } },
};

/** URL bertanda tangan → path aslinya di Storage (supaya yang disimpan ke database tetap path). */
const urlKePath = new Map<string, string>();

export function isFileField(kunci: KunciTabel, field: string): boolean {
  return !!FIELD_BERKAS[kunci]?.[field];
}

export function berkasKeDb(nilai: string): string {
  return urlKePath.get(nilai) ?? nilai;
}

const sudahUrl = (v: string) => /^(https?:|data:|blob:)/.test(v);

/** Ganti path berkas privat di seluruh data menjadi URL bertanda tangan agar bisa dibuka di browser. */
export async function tandatanganiBerkas(db: DB): Promise<DB> {
  const sb = createClient();
  const perBucket = new Map<string, Set<string>>();
  for (const [kunci, fields] of Object.entries(FIELD_BERKAS) as [KunciTabel, Record<string, InfoBerkas>][]) {
    for (const [field, info] of Object.entries(fields)) {
      if (!info.privat) continue;
      for (const row of db[kunci] as unknown as Record<string, string>[]) {
        const v = row[field];
        if (v && !sudahUrl(v)) {
          if (!perBucket.has(info.bucket)) perBucket.set(info.bucket, new Set());
          perBucket.get(info.bucket)!.add(v);
        }
      }
    }
  }

  const hasil = new Map<string, string>(); // `${bucket}|${path}` → url
  await Promise.all(
    [...perBucket.entries()].map(async ([bucket, paths]) => {
      const { data } = await sb.storage.from(bucket).createSignedUrls([...paths], MASA_BERLAKU_DETIK);
      for (const d of data ?? []) {
        if (d.signedUrl && d.path) {
          hasil.set(`${bucket}|${d.path}`, d.signedUrl);
          urlKePath.set(d.signedUrl, d.path);
        }
      }
    })
  );

  const salin: DB = { ...db };
  for (const [kunci, fields] of Object.entries(FIELD_BERKAS) as [KunciTabel, Record<string, InfoBerkas>][]) {
    (salin[kunci] as unknown as Record<string, string>[]) = (db[kunci] as unknown as Record<string, string>[]).map((row) => {
      let baru = row;
      for (const [field, info] of Object.entries(fields)) {
        const url = info.privat ? hasil.get(`${info.bucket}|${row[field]}`) : undefined;
        if (url) baru = { ...baru, [field]: url };
      }
      return baru;
    });
  }
  return salin;
}

export type TujuanUnggah = 'bukti' | 'poster' | 'warta' | 'surat' | 'lampiran';

const TUJUAN: Record<TujuanUnggah, InfoBerkas & { folder: string }> = {
  bukti: { bucket: 'bukti-transaksi', privat: true, folder: 'transaksi' },
  poster: { bucket: 'publik', privat: false, folder: 'poster' },
  warta: { bucket: 'publik', privat: false, folder: 'warta' },
  surat: { bucket: 'surat', privat: true, folder: 'umum' },
  lampiran: { bucket: 'lampiran', privat: true, folder: 'lampiran' },
};

function namaAman(nama: string): string {
  return nama.normalize('NFKD').replace(/[^\w.\-]+/g, '-').replace(/-+/g, '-').slice(-80);
}

function bacaDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

/**
 * Unggah satu berkas dan kembalikan URL yang bisa langsung dipakai di tampilan
 * (dan disimpan ke field berkas). Mode demo: berkas dibaca sebagai data URL.
 *
 * @param folder untuk surat: id akun warga pemilik surat, supaya warga bisa mengunduh suratnya sendiri.
 */
export async function unggahBerkas(file: File, tujuan: TujuanUnggah, folder?: string): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  if (!isSupabaseConfigured()) {
    try {
      return { ok: true, url: await bacaDataURL(file) };
    } catch {
      return { ok: false, message: 'Berkas tidak dapat dibaca.' };
    }
  }
  const info = TUJUAN[tujuan];
  const sb = createClient();
  const path = `${folder || info.folder}/${Date.now()}-${namaAman(file.name)}`;
  const { error } = await sb.storage.from(info.bucket).upload(path, file, { contentType: file.type || undefined, upsert: false });
  if (error) return { ok: false, message: `Gagal mengunggah berkas: ${error.message}` };

  if (!info.privat) return { ok: true, url: sb.storage.from(info.bucket).getPublicUrl(path).data.publicUrl };

  const { data, error: e2 } = await sb.storage.from(info.bucket).createSignedUrl(path, MASA_BERLAKU_DETIK);
  if (e2 || !data) return { ok: false, message: `Berkas terunggah tetapi tidak dapat dibuka: ${e2?.message ?? ''}` };
  urlKePath.set(data.signedUrl, path);
  return { ok: true, url: data.signedUrl };
}

/** Buka / unduh berkas di tab baru. */
export function bukaBerkas(url: string): boolean {
  if (!url || !sudahUrl(url)) return false;
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}

/** Apakah URL/nama berkas ini PDF (bukan gambar). */
export function isPdf(url: string): boolean {
  return url.startsWith('data:application/pdf') || /\.pdf($|\?)/i.test(url.split('#')[0]);
}
