'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge, Button, PageHeader, Person, SearchInput, StatusTabs, Table } from '@/components/common';
import { FilterSelect } from '@/components/forms';
import { useMock, JENIS_SURAT_LABEL, STATUS_SURAT, STATUS_SURAT_LABEL, STATUS_SURAT_TONE, type PermohonanSurat, type StatusSurat } from '@/lib/mock';
import { formatTanggalPendek } from '@/utils/formatters';
import { routeSuratProses } from '@/lib/constants/routes';

/** Modul Layanan Surat – daftar permohonan dengan tab status dan filter. */
export const SuratList: React.FC = () => {
  const { db } = useMock();
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get('status');
  const [status, setStatus] = useState<StatusSurat | ''>(STATUS_SURAT.includes(initial as StatusSurat) ? (initial as StatusSurat) : '');
  const [q, setQ] = useState('');
  const [jenis, setJenis] = useState('');
  const [dari, setDari] = useState('');
  const [sampai, setSampai] = useState('');

  const jemaatById = useMemo(() => new Map(db.jemaat.map((j) => [j.id, j])), [db.jemaat]);
  const profileById = useMemo(() => new Map(db.profiles.map((p) => [p.id, p])), [db.profiles]);

  const base = db.surat.filter(
    (s) =>
      (!q || (jemaatById.get(s.id_jemaat)?.nama ?? '').toLowerCase().includes(q.toLowerCase())) &&
      (!jenis || s.jenis_surat === jenis) &&
      (!dari || s.tanggal_pengajuan >= dari) &&
      (!sampai || s.tanggal_pengajuan <= sampai)
  );
  const rows = base.filter((s) => !status || s.status === status).sort((a, b) => b.tanggal_pengajuan.localeCompare(a.tanggal_pengajuan));

  return (
    <>
      <PageHeader eyebrow="Pelayanan" title="Permohonan Surat" description="Periksa permohonan surat baptis, sidi, dan atestasi dari warga, lalu proses hingga surat final terunggah." />
      <div className="filters">
        <SearchInput id="q-surat" value={q} onChange={setQ} placeholder="Cari nama pemohon…" />
        <FilterSelect
          id="f-jenis"
          label="Filter jenis surat"
          value={jenis}
          onChange={setJenis}
          options={[{ value: '', label: 'Semua jenis surat' }, ...Object.entries(JENIS_SURAT_LABEL).map(([value, label]) => ({ value, label }))]}
        />
        <label className="lbl-inline">
          Dari <input className="input" type="date" id="f-dari" value={dari} onChange={(e) => setDari(e.target.value)} />
        </label>
        <label className="lbl-inline">
          Sampai <input className="input" type="date" id="f-sampai" value={sampai} onChange={(e) => setSampai(e.target.value)} />
        </label>
      </div>
      <StatusTabs<StatusSurat | ''>
        value={status}
        onChange={setStatus}
        items={[
          { value: '', label: 'Semua', count: base.length, dot: 'all' },
          ...STATUS_SURAT.map((st) => ({ value: st, label: STATUS_SURAT_LABEL[st], count: base.filter((s) => s.status === st).length, dot: STATUS_SURAT_TONE[st] })),
        ]}
      />
      <Table<PermohonanSurat>
        key={`${status}|${q}|${jenis}|${dari}|${sampai}`}
        data={rows}
        rowKey={(s) => s.id}
        columns={[
          { header: 'Tanggal Pengajuan', className: 'nowrap', cell: (s) => formatTanggalPendek(s.tanggal_pengajuan) },
          {
            header: 'Nama Pemohon',
            cell: (s) => {
              const j = jemaatById.get(s.id_jemaat);
              return <Person name={j?.nama ?? '–'} sub={j?.wilayah} />;
            },
          },
          {
            header: 'Jenis Surat',
            cell: (s) => (
              <Badge tone="rose" dot={false}>
                {JENIS_SURAT_LABEL[s.jenis_surat].replace('Surat ', '')}
              </Badge>
            ),
          },
          { header: 'Status', cell: (s) => <Badge tone={STATUS_SURAT_TONE[s.status]}>{STATUS_SURAT_LABEL[s.status]}</Badge> },
          { header: 'Diproses Oleh', cell: (s) => (s.id_pengurus ? profileById.get(s.id_pengurus)?.nama : <span className="dim">–</span>) },
          {
            header: '',
            className: 'acts',
            cell: (s) =>
              s.status === 'diajukan' || s.status === 'diproses' ? (
                <Button size="sm" onClick={() => router.push(routeSuratProses(s.id))}>
                  Proses
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => router.push(routeSuratProses(s.id))}>
                  Lihat
                </Button>
              ),
          },
        ]}
      />
    </>
  );
};
