'use client';

/**
 * Data milik warga yang sedang login: profil, data jemaat tertaut, dan permohonan suratnya.
 * Sesuai aturan hak akses (Tabel 3): warga hanya melihat data miliknya sendiri.
 *
 * TODO [Backend]: ganti isi hook ini dengan query Supabase
 *   - jemaat  : select * from jemaat where id_profiles = auth.uid()
 *   - surat   : select * from permohonan_surat where id_jemaat = <id jemaat di atas>
 *   RLS di PostgreSQL tetap menjadi penjaga utama.
 */
import { useMemo } from 'react';
import { useMock } from '@/lib/mock/store';

export function usePortalData() {
  const { db, user, ready, setDb } = useMock();

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
