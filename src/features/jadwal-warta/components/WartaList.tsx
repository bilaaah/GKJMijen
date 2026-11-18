'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, ButtonLink, IconButton, PageHeader, SearchInput, StatusTabs, Table } from '@/components/common';
import { useConfirm, useToast } from '@/components/feedback';
import { useMock, type StatusWarta, type Warta } from '@/lib/mock';
import { formatTanggalPendek, hariIniISO, namaBerkas } from '@/utils/formatters';
import { ROUTES, routeWartaUbah } from '@/lib/constants/routes';
import { WartaPreview } from './WartaPreview';

/** Daftar warta (draf dan terbit). */
export const WartaList: React.FC = () => {
  const { db, setDb } = useMock();
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<StatusWarta | ''>('');
  const [preview, setPreview] = useState<Warta | null>(null);
  const profileById = useMemo(() => new Map(db.profiles.map((p) => [p.id, p])), [db.profiles]);

  const base = db.warta.filter((w) => !q || w.judul.toLowerCase().includes(q.toLowerCase()));
  const rows = base
    .filter((w) => !status || w.status === status)
    .sort((a, b) => (a.status === b.status ? (b.tanggal_terbit || '').localeCompare(a.tanggal_terbit || '') : a.status === 'draf' ? -1 : 1));

  const hapus = (w: Warta) =>
    confirm({
      title: 'Hapus warta?',
      message: (
        <>
          <b style={{ color: 'var(--espresso)' }}>{w.judul}</b> akan dihapus permanen.
        </>
      ),
      onConfirm: () => {
        setDb((d) => ({ ...d, warta: d.warta.filter((x) => x.id !== w.id) }));
        toast('Warta berhasil dihapus.');
      },
    });

  return (
    <>
      <PageHeader
        eyebrow="Jadwal & Warta"
        title="Warta"
        description="Tulis warta sebagai draf, lalu terbitkan agar tampil di landing page dan halaman warta."
        actions={
          <ButtonLink href={ROUTES.DASHBOARD.WARTA_TULIS} icon="pencil-square">
            Tulis Warta
          </ButtonLink>
        }
      />
      <div className="filters">
        <SearchInput id="q-warta" value={q} onChange={setQ} placeholder="Cari judul warta…" />
      </div>
      <StatusTabs<StatusWarta | ''>
        value={status}
        onChange={setStatus}
        items={[
          { value: '', label: 'Semua', count: base.length, dot: 'all' },
          { value: 'draf', label: 'Draf', count: base.filter((w) => w.status === 'draf').length, dot: 'neu' },
          { value: 'terbit', label: 'Terbit', count: base.filter((w) => w.status === 'terbit').length, dot: 'ok' },
        ]}
      />
      <Table<Warta>
        key={`${q}|${status}`}
        data={rows}
        rowKey={(w) => w.id}
        columns={[
          {
            header: 'Judul',
            cell: (w) => (
              <>
                <b style={{ fontWeight: 500 }}>{w.judul}</b>
                {w.url_pdf && (
                  <span className="att-badge" title={namaBerkas(w.url_pdf)}>
                    <i className="bi bi-paperclip" aria-hidden="true" />
                    PDF
                  </span>
                )}
                <br />
                <small className="muted">
                  {w.isi
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()
                    .slice(0, 80)}
                  …
                </small>
              </>
            ),
          },
          { header: 'Penulis', className: 'nowrap', cell: (w) => profileById.get(w.id_profiles)?.nama ?? '–' },
          { header: 'Status', cell: (w) => (w.status === 'terbit' ? <Badge tone="ok">Terbit</Badge> : <Badge tone="neu">Draf</Badge>) },
          { header: 'Tanggal Terbit', className: 'nowrap', cell: (w) => formatTanggalPendek(w.tanggal_terbit) },
          {
            header: '',
            className: 'acts',
            cell: (w) => (
              <>
                <IconButton icon="eye" label="Pratinjau" onClick={() => setPreview(w)} />
                <IconButton icon="pencil" label="Ubah" onClick={() => router.push(routeWartaUbah(w.id))} />
                <IconButton icon="trash3" label="Hapus" danger onClick={() => hapus(w)} />
              </>
            ),
          },
        ]}
      />
      <WartaPreview
        open={!!preview}
        onClose={() => setPreview(null)}
        judul={preview?.judul ?? ''}
        isi={preview?.isi ?? ''}
        tanggal={preview?.tanggal_terbit || hariIniISO()}
        penulis={(preview && profileById.get(preview.id_profiles)?.nama) ?? ''}
        pdf={preview?.url_pdf ?? ''}
      />
    </>
  );
};
