'use client';

/**
 * Data milik warga yang sedang login: profil, data jemaat tertaut, dan permohonan suratnya.
 * Sesuai aturan hak akses (Tabel 3): warga hanya melihat data miliknya sendiri.
 *
 * Sumber data: SupabaseDataProvider memuat data warga (jemaat where id_profiles = auth.uid(),
 * permohonan_surat miliknya). RLS di PostgreSQL tetap menjadi penjaga utama.
 */
import { useMemo } from 'react';
import { useData } from '@/lib/data';

export function usePortalData() {
  const { db, user, ready, setDb } = useData();

  const jemaat = useMemo(() => (user ? db.jemaat.find((j) => j.id_profiles === user.id) ?? null : null), [db.jemaat, user]);

  const surat = useMemo(
    () =>
      jemaat
        ? db.surat
            .filter((s) => s.id_jemaat === jemaat.id)
            .sort((a, b) => (a.tanggal_pengajuan < b.tanggal_pengajuan ? 1 : a.tanggal_pengajuan > b.tanggal_pengajuan ? -1 : 0))
        : [],
    [db.surat, jemaat]
  );

  const hitung = useMemo(
    () => ({
      diajukan: surat.filter((s) => s.status === 'diajukan').length,
      diproses: surat.filter((s) => s.status === 'diproses').length,
      selesai: surat.filter((s) => s.status === 'selesai').length,
      ditolak: surat.filter((s) => s.status === 'ditolak').length,
      total: surat.length,
    }),
    [surat]
  );

  return { ready, user, jemaat, surat, hitung, setDb };
}
