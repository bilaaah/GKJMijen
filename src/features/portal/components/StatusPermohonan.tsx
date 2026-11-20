'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@/components/common';
import { EmptyState } from '@/components/feedback';
import { ROUTES, routePortalSurat } from '@/lib/constants/routes';
import type { PermohonanSurat } from '@/lib/mock/types';
import { formatTanggalPendek } from '@/utils/formatters';
import { usePortalData } from '../usePortalData';
import { layananDariSurat, namaLayanan } from '../layanan';
import { StatusBadge, StatusSteps } from './StatusParts';

type Filter = 'semua' | 'proses' | 'selesai' | 'ditolak';
const FILTERS: { id: Filter; label: string; cocok: (s: PermohonanSurat) => boolean }[] = [
  { id: 'semua', label: 'Semua', cocok: () => true },
  { id: 'proses', label: 'Dalam proses', cocok: (s) => s.status === 'diajukan' || s.status === 'diproses' },
  { id: 'selesai', label: 'Selesai', cocok: (s) => s.status === 'selesai' },
  { id: 'ditolak', label: 'Ditolak', cocok: (s) => s.status === 'ditolak' },
];

/** Aksi utama per status: unduh, ajukan ulang, atau lihat detail. */
const AksiSurat: React.FC<{ s: PermohonanSurat; kecil?: boolean }> = ({ s, kecil }) => {
  const cls = `btn ${kecil ? 'btn-sm' : ''}`;
  if (s.status === 'selesai')
    return (
      <Link href={routePortalSurat(s.id)} className={`${cls} btn-primary`}>
        <Icon name="download" /> Lihat &amp; unduh
      </Link>
    );
  if (s.status === 'ditolak')
    return (
      <Link href={`${ROUTES.PORTAL.AJUKAN}?layanan=${layananDariSurat(s)}&ulang=${s.id}`} className={`${cls} btn-outline-primary`}>
        <Icon name="arrow-repeat" /> Ajukan ulang
      </Link>
    );
  return (
    <Link href={routePortalSurat(s.id)} className={`${cls} btn-ghost`}>
      Detail
    </Link>
  );
};

/** Status Permohonan (UC04): daftar permohonan milik warga + riwayat langkah di panel samping. */
export const StatusPermohonan: React.FC = () => {
  const { surat } = usePortalData();
  const params = useSearchParams();
  const router = useRouter();
  const awal = (FILTERS.find((f) => f.id === params.get('filter'))?.id ?? 'semua') as Filter;
  const [filter, setFilter] = useState<Filter>(awal);
  const [pilihId, setPilihId] = useState<string | null>(null);

  const daftar = useMemo(() => surat.filter(FILTERS.find((f) => f.id === filter)!.cocok), [surat, filter]);
  const pilih = daftar.find((s) => s.id === pilihId) ?? daftar[0] ?? null;

  useEffect(() => setFilter(awal), [awal]);

  const gantiFilter = (f: Filter) => {
    setFilter(f);
    setPilihId(null);
    router.replace(f === 'semua' ? ROUTES.PORTAL.STATUS : `${ROUTES.PORTAL.STATUS}?filter=${f}`, { scroll: false });
  };

  if (surat.length === 0) {
    return (
      <div className="pt-page">
        <div className="pt-head">
          <h1>Status Permohonan</h1>
        </div>
        <div className="gk-card">
          <EmptyState
            icon="inbox"
            title="Belum ada permohonan"
            description="Permohonan surat yang Anda ajukan akan muncul di sini beserta perkembangannya."
            action={
              <Link href={ROUTES.PORTAL.AJUKAN} className="btn btn-primary">
                <Icon name="envelope-plus" /> Ajukan surat
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-page">
      <div className="pt-head row-between">
        <div>
          <h1>Status Permohonan</h1>
          <p className="muted">Pilih satu permohonan untuk melihat perkembangannya.</p>
        </div>
        <Link href={ROUTES.PORTAL.AJUKAN} className="btn btn-primary">
          <Icon name="plus-lg" /> Ajukan baru
        </Link>
      </div>

      <div className="tabs" role="tablist">
        {FILTERS.map((f) => (
          <button key={f.id} type="button" role="tab" aria-selected={filter === f.id} className={`tab ${filter === f.id ? 'active' : ''}`} onClick={() => gantiFilter(f.id)}>
            {f.label} <span className="tab-n">{surat.filter(f.cocok).length}</span>
          </button>
        ))}
      </div>

      <div className="pt-status">
        <div className="pt-tbl">
          {daftar.length === 0 ? (
            <p className="pt-tbl-empty muted">Tidak ada permohonan pada kategori ini.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Layanan</th>
                  <th>Diajukan</th>
                  <th>Status</th>
                  <th className="r">
                    <span className="visually-hidden">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {daftar.map((s) => (
                  <tr
                    key={s.id}
                    className={pilih?.id === s.id ? 'sel' : ''}
                    onClick={() => (window.innerWidth < 900 ? router.push(routePortalSurat(s.id)) : setPilihId(s.id))}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setPilihId(s.id)}
                    aria-selected={pilih?.id === s.id}
                  >
                    <td>
                      <b>{namaLayanan(s)}</b>
                      {s.nomor_surat && <small>No. {s.nomor_surat}</small>}
                    </td>
                    <td className="nowrap">{formatTanggalPendek(s.tanggal_pengajuan)}</td>
                    <td>
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="r" onClick={(e) => e.stopPropagation()}>
                      <AksiSurat s={s} kecil />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {pilih && (
          <aside className="pt-side gk-card" key={pilih.id} aria-live="polite">
            <div className="pt-side-head">
              <StatusBadge status={pilih.status} />
              <h3>{namaLayanan(pilih)}</h3>
              <small className="muted">Diajukan {formatTanggalPendek(pilih.tanggal_pengajuan)}</small>
            </div>
            <StatusSteps surat={pilih} />
            {pilih.status === 'ditolak' && pilih.catatan && (
              <div className="note bad">
                <Icon name="chat-left-text" />
                <div>
                  <b>Catatan pengurus</b>
                  <br />
                  {pilih.catatan}
                </div>
              </div>
            )}
            <div className="pt-side-acts">
              <AksiSurat s={pilih} />
              {pilih.status === 'ditolak' && (
                <Link href={routePortalSurat(pilih.id)} className="btn btn-ghost">
                  Lihat detail
                </Link>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
