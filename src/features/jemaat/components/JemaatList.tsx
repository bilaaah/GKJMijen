'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ButtonLink, Icon, IconButton, PageHeader, Person, SearchInput, Table, YesNoBadge } from '@/components/common';
import { FilterSelect } from '@/components/forms';
import { Alert, useConfirm, useToast } from '@/components/feedback';
import { useMock, WILAYAH, type Jemaat } from '@/lib/mock';
import { ROUTES, routeJemaatDetail, routeJemaatUbah } from '@/lib/constants/routes';

/**
 * Modul Data Jemaat – daftar jemaat dengan pencarian dan filter.
 * Mode frontend: data dari useMock(); hapus data langsung di memori.
 */
export const JemaatList: React.FC = () => {
  const { db, setDb, jemaatQuery, setJemaatQuery } = useMock();
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [wilayah, setWilayah] = useState('');
  const [baptis, setBaptis] = useState('');
  const [sidi, setSidi] = useState('');

  const rows = useMemo(() => {
    const q = jemaatQuery.toLowerCase();
    return db.jemaat
      .filter(
        (j) =>
          (!q || `${j.nama} ${j.no_hp}`.toLowerCase().includes(q)) &&
          (!wilayah || j.wilayah === wilayah) &&
          (baptis === '' || String(+j.status_baptis) === baptis) &&
          (sidi === '' || String(+j.status_sidi) === sidi)
      )
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [db.jemaat, jemaatQuery, wilayah, baptis, sidi]);

  const hapus = (j: Jemaat) => {
    const n = db.surat.filter((s) => s.id_jemaat === j.id).length;
    confirm({
      title: 'Hapus data jemaat?',
      message: (
        <>
          <b style={{ color: 'var(--espresso)' }}>{j.nama}</b> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
        </>
      ),
      extra: n ? <Alert tone="warn">{n} riwayat permohonan surat milik jemaat ini juga akan terhapus.</Alert> : undefined,
      onConfirm: () => {
        setDb((d) => ({ ...d, jemaat: d.jemaat.filter((x) => x.id !== j.id), surat: d.surat.filter((s) => s.id_jemaat !== j.id) }));
        toast('Data jemaat berhasil dihapus.');
      },
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Pelayanan"
        title="Data Jemaat"
        description="Data pribadi, keluarga, wilayah, serta status baptis dan sidi seluruh jemaat GKJ Mijen."
        actions={
          <ButtonLink href={ROUTES.DASHBOARD.JEMAAT_TAMBAH} icon="plus-lg">
            Tambah Jemaat
          </ButtonLink>
        }
      />
      <div className="filters">
        <SearchInput id="q-jemaat" value={jemaatQuery} onChange={setJemaatQuery} placeholder="Cari nama atau no. HP…" />
        <FilterSelect id="f-wilayah" label="Filter wilayah" value={wilayah} onChange={setWilayah} options={[{ value: '', label: 'Semua wilayah' }, ...WILAYAH.map((w) => ({ value: w, label: w }))]} />
        <FilterSelect id="f-baptis" label="Filter status baptis" value={baptis} onChange={setBaptis} options={[{ value: '', label: 'Baptis: semua' }, { value: '1', label: 'Sudah baptis' }, { value: '0', label: 'Belum baptis' }]} />
        <FilterSelect id="f-sidi" label="Filter status sidi" value={sidi} onChange={setSidi} options={[{ value: '', label: 'Sidi: semua' }, { value: '1', label: 'Sudah sidi' }, { value: '0', label: 'Belum sidi' }]} />
      </div>
      <Table<Jemaat>
        key={`${jemaatQuery}|${wilayah}|${baptis}|${sidi}`}
        data={rows}
        rowKey={(j) => j.id}
        columns={[
          { header: 'Nama', cell: (j) => <Person name={j.nama} sub={j.alamat} /> },
          { header: 'No. HP', className: 'nowrap num', cell: (j) => j.no_hp || <span className="dim">–</span> },
          { header: 'Wilayah', cell: (j) => j.wilayah },
          { header: 'Baptis', cell: (j) => <YesNoBadge value={j.status_baptis} /> },
          { header: 'Sidi', cell: (j) => <YesNoBadge value={j.status_sidi} /> },
          {
            header: 'Akun Tertaut',
            hideMd: true,
            cell: (j) =>
              j.id_profiles ? (
                <span className="linked" title={db.profiles.find((p) => p.id === j.id_profiles)?.email}>
                  <Icon name="check-circle-fill" /> Tertaut
                </span>
              ) : (
                <span className="dim">–</span>
              ),
          },
          {
            header: '',
            className: 'acts',
            cell: (j) => (
              <>
                <IconButton icon="eye" label="Lihat detail" onClick={() => router.push(routeJemaatDetail(j.id))} />
                <IconButton icon="pencil" label="Ubah" onClick={() => router.push(routeJemaatUbah(j.id))} />
                <IconButton icon="trash3" label="Hapus" danger onClick={() => hapus(j)} />
              </>
            ),
          },
        ]}
      />
    </>
  );
};
