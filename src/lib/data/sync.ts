/**
 * Menyimpan perbedaan antara data lama dan baru ke Supabase.
 * Dipanggil oleh SupabaseDataProvider setiap kali komponen memanggil setDb(...).
 *
 * Urutan:
 * 1. Akun (profiles): ubah nama/peran; hapus akun lewat fungsi database hapus_akun()
 * 2. Hapus baris: anak dulu (surat sebelum jemaat)
 * 3. Ubah lalu tambah baris: induk dulu (jemaat sebelum surat)
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { TABEL, URUTAN_SIMPAN, fieldBerubah, keDb } from './mapping';
import type { DB } from './types';

type Baris = { id: string } & Record<string, unknown>;
const sebagaiBaris = (rows: unknown) => rows as Baris[];

export async function simpanPerbedaan(sb: SupabaseClient, lama: DB, baru: DB): Promise<void> {
  // 1. Akun
  const profilBaru = new Map(baru.profiles.map((p) => [p.id, p]));
  for (const p of lama.profiles) {
    const n = profilBaru.get(p.id);
    if (!n) {
      const { error } = await sb.rpc('hapus_akun', { target: p.id });
      if (error) throw error;
      continue;
    }
    const patch = fieldBerubah(p, n);
    if (!patch) continue;
    const kolom: Record<string, unknown> = {};
    if (patch.nama !== undefined) kolom.nama = patch.nama;
    if (patch.peran !== undefined) kolom.peran = patch.peran;
    if (Object.keys(kolom).length) {
      const { error } = await sb.from('profiles').update(kolom).eq('id', p.id);
      if (error) throw error;
    }
  }

  // 2. Hapus baris (anak dulu)
  for (const kunci of [...URUTAN_SIMPAN].reverse()) {
    const idBaru = new Set(sebagaiBaris(baru[kunci]).map((r) => r.id));
    const dihapus = sebagaiBaris(lama[kunci])
      .filter((r) => !idBaru.has(r.id))
      .map((r) => r.id);
    if (dihapus.length) {
      const { error } = await sb.from(TABEL[kunci].table).delete().in(TABEL[kunci].pk, dihapus);
      if (error) throw error;
    }
  }

  // 3. Ubah & tambah baris (induk dulu)
  for (const kunci of URUTAN_SIMPAN) {
    const petaLama = new Map(sebagaiBaris(lama[kunci]).map((r) => [r.id, r]));
    const tambah: Record<string, unknown>[] = [];
    const ubah: { id: string; kolom: Record<string, unknown>; lepasTautan: boolean }[] = [];
    for (const r of sebagaiBaris(baru[kunci])) {
      const l = petaLama.get(r.id);
      if (!l) tambah.push(keDb(kunci, r, true));
      else {
        const patch = fieldBerubah(l, r);
        if (patch) ubah.push({ id: r.id, kolom: keDb(kunci, patch), lepasTautan: 'id_profiles' in patch && !patch.id_profiles });
      }
    }
    // Lepas tautan akun dulu agar tidak bentrok dengan aturan "1 akun = 1 jemaat" (unique)
    ubah.sort((a, b) => Number(b.lepasTautan) - Number(a.lepasTautan));
    for (const u of ubah) {
      const { error } = await sb.from(TABEL[kunci].table).update(u.kolom).eq(TABEL[kunci].pk, u.id);
      if (error) throw error;
    }
    if (tambah.length) {
      const { error } = await sb.from(TABEL[kunci].table).insert(tambah);
      if (error) throw error;
    }
  }
}
