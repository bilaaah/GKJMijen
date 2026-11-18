'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge, Button, ButtonLink, IconButton, Modal, PageHeader, SearchInput, Table } from '@/components/common';
import { Segmented } from '@/components/forms';
import { Alert, useConfirm, useToast } from '@/components/feedback';
import { useMock, type Kegiatan } from '@/lib/mock';
import { formatHariTanggal, formatJam, formatTanggalPendek, hariIniISO, NAMA_BULAN, NAMA_HARI, parseTanggal } from '@/utils/formatters';
import { ROUTES, routeKegiatanUbah } from '@/lib/constants/routes';

const byDateTime = (a: Kegiatan, b: Kegiatan) => (a.tanggal + a.jam).localeCompare(b.tanggal + b.jam);

const Kalender: React.FC<{ kegiatan: Kegiatan[]; today: string; onOpen: (k: Kegiatan) => void }> = ({ kegiatan, today, onOpen }) => {
  const [bulan, setBulan] = useState(today.slice(0, 7));
  const [y, m] = bulan.split('-').map(Number);
  const first = new Date(y, m - 1, 1);
  const start = (first.getDay() + 6) % 7;
  const days = new Date(y, m, 0).getDate();
  const cells = Math.ceil((start + days) / 7) * 7;
  const geser = (d: number) => {
    const dt = new Date(y, m - 1 + d, 1);
    setBulan(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`);
  };

  return (
    <div className="cal-wrap">
      <div className="cal-head">
        <IconButton icon="chevron-left" label="Bulan sebelumnya" onClick={() => geser(-1)} />
        <h3>
          {NAMA_BULAN[m - 1]} {y}
        </h3>
        <IconButton icon="chevron-right" label="Bulan berikutnya" onClick={() => geser(1)} />
      </div>
      <div className="cal">
        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((d) => (
          <div className="cal-dow" key={d}>
            {d}
          </div>
        ))}
        {Array.from({ length: cells }, (_, i) => {
          const dt = new Date(y, m - 1, i - start + 1);
          const iso = hariIniISO(dt);
          const ev = kegiatan.filter((k) => k.tanggal === iso).sort(byDateTime);
          return (
            <div key={iso} className={`cal-cell ${dt.getMonth() !== m - 1 ? 'out' : ''} ${iso === today ? 'today' : ''}`}>
              <span className="cal-d">{dt.getDate()}</span>
              {ev.map((k) => (
                <button key={k.id} type="button" className={`cal-ev ${k.nama_kegiatan.startsWith('Ibadah') ? 'ibadah' : ''}`} title={`${k.nama_kegiatan} · ${formatJam(k.jam)}`} onClick={() => onOpen(k)}>
                  {formatJam(k.jam)} {k.nama_kegiatan}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Modul Jadwal & Warta – daftar kegiatan (tabel atau kalender). */
export const KegiatanList: React.FC = () => {
  const { db, setDb } = useMock();
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const confirm = useConfirm();
  const today = hariIniISO();
  const [view, setView] = useState<'tabel' | 'kalender'>(params.get('view') === 'kalender' ? 'kalender' : 'tabel');
  const [q, setQ] = useState('');
  const [poster, setPoster] = useState<Kegiatan | null>(null);

  const profileById = useMemo(() => new Map(db.profiles.map((p) => [p.id, p])), [db.profiles]);
  const rows = db.kegiatan.filter((k) => !q || `${k.nama_kegiatan} ${k.lokasi} ${k.petugas}`.toLowerCase().includes(q.toLowerCase())).sort(byDateTime);

  const hapus = (k: Kegiatan) =>
    confirm({
      title: 'Hapus kegiatan?',
      message: (
        <>
          <b style={{ color: 'var(--espresso)' }}>
            {k.nama_kegiatan} ({formatTanggalPendek(k.tanggal)})
          </b>{' '}
          akan dihapus permanen dan tidak tampil lagi di landing page.
        </>
      ),
      onConfirm: () => {
        setDb((d) => ({ ...d, kegiatan: d.kegiatan.filter((x) => x.id !== k.id) }));
        toast('Kegiatan berhasil dihapus.');
      },
    });

  return (
    <>
      <PageHeader
        eyebrow="Jadwal & Warta"
        title="Kegiatan"
        description="Jadwal ibadah dan kegiatan gereja beserta petugasnya."
        actions={
          <ButtonLink href={ROUTES.DASHBOARD.KEGIATAN_TAMBAH} icon="plus-lg">
            Tambah Kegiatan
          </ButtonLink>
        }
      />
      <Alert icon="globe2" style={{ marginBottom: 16 }}>
        Kegiatan otomatis tampil di landing page publik dan dapat dilihat warga tanpa login.
      </Alert>
      <div className="filters">
        <Segmented<'tabel' | 'kalender'>
          label="Tampilan"
          value={view}
          onChange={setView}
          options={[
            { value: 'tabel', label: 'Tabel', icon: 'list-ul' },
            { value: 'kalender', label: 'Kalender', icon: 'calendar3' },
          ]}
        />
        {view === 'tabel' && <SearchInput id="q-kegiatan" value={q} onChange={setQ} placeholder="Cari kegiatan, lokasi, atau petugas…" />}
      </div>
      {view === 'kalender' ? (
        <Kalender kegiatan={db.kegiatan} today={today} onOpen={(k) => router.push(routeKegiatanUbah(k.id))} />
      ) : (
        <Table<Kegiatan>
          key={q}
          data={rows}
          rowKey={(k) => k.id}
          rowClassName={(k) => (k.tanggal < today ? 'past' : '')}
          columns={[
            {
              header: 'Nama Kegiatan',
              cell: (k) => (
                <>
                  <b style={{ fontWeight: 500 }}>{k.nama_kegiatan}</b>
                  {k.url_poster && (
                    <button type="button" className="att-badge" onClick={() => setPoster(k)} title="Lihat poster">
                      <i className="bi bi-image" aria-hidden="true" />
                      Poster
                    </button>
                  )}
                  {k.tanggal < today && (
                    <>
                      {' '}
                      <Badge tone="neu">Selesai</Badge>
                    </>
                  )}
                </>
              ),
            },
            { header: 'Tanggal', className: 'nowrap', cell: (k) => `${NAMA_HARI[parseTanggal(k.tanggal).getDay()]}, ${formatTanggalPendek(k.tanggal)}` },
            { header: 'Jam', className: 'num', cell: (k) => formatJam(k.jam) },
            { header: 'Lokasi', cell: (k) => k.lokasi },
            {
              header: 'Petugas',
              cell: (k) => {
                const l = k.petugas.split('\n').filter(Boolean);
                return (
                  <>
                    {l[0] ?? '–'}
                    {l.length > 1 && (
                      <>
                        <br />
                        <small className="muted">+{l.length - 1} petugas lain</small>
                      </>
                    )}
                  </>
                );
              },
            },
            { header: 'Dibuat Oleh', className: 'nowrap', cell: (k) => profileById.get(k.id_profiles)?.nama ?? '–' },
            {
              header: '',
              className: 'acts',
              cell: (k) => (
                <>
                  <IconButton icon="pencil" label="Ubah" onClick={() => router.push(routeKegiatanUbah(k.id))} />
                  <IconButton icon="trash3" label="Hapus" danger onClick={() => hapus(k)} />
                </>
              ),
            },
          ]}
        />
      )}

      <Modal
        isOpen={!!poster}
        onClose={() => setPoster(null)}
        title={poster?.nama_kegiatan}
        subtitle={poster ? `${formatHariTanggal(poster.tanggal)} · ${formatJam(poster.jam)} · ${poster.lokasi}` : ''}
        footer={
          <>
            <Button variant="outline" onClick={() => setPoster(null)}>
              Tutup
            </Button>
            <Button icon="pencil" onClick={() => poster && router.push(routeKegiatanUbah(poster.id))}>
              Ubah Kegiatan
            </Button>
          </>
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {poster && <img className="poster-view" src={poster.url_poster} alt={`Poster ${poster.nama_kegiatan}`} />}
      </Modal>
    </>
  );
};
