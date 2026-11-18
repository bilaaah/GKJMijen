'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Button, ButtonLink, IconButton, Modal, PageHeader, StatCard, Table } from '@/components/common';
import { FilterSelect } from '@/components/forms';
import { useConfirm, useToast } from '@/components/feedback';
import { useMock, KATEGORI_TRANSAKSI, type TransaksiKeuangan } from '@/lib/mock';
import { formatRp, formatTanggalPendek, hariIniISO, NAMA_BULAN, namaBerkas, parseTanggal } from '@/utils/formatters';
import { ROUTES, routeTransaksiUbah } from '@/lib/constants/routes';

/** Modul Keuangan – daftar transaksi, ringkasan saldo, dan filter periode. */
export const KeuanganList: React.FC = () => {
  const { db, setDb } = useMock();
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const today = hariIniISO();
  const [bulan, setBulan] = useState(String(parseTanggal(today).getMonth() + 1));
  const [tahun, setTahun] = useState(today.slice(0, 4));
  const [jenis, setJenis] = useState('');
  const [kategori, setKategori] = useState('');
  const [bukti, setBukti] = useState<TransaksiKeuangan | null>(null);

  const ym = today.slice(0, 7);
  const saldo = db.transaksi.reduce((s, t) => s + (t.jenis_transaksi === 'pemasukan' ? t.nominal : -t.nominal), 0);
  const bulanIni = db.transaksi.filter((t) => t.tanggal.startsWith(ym));
  const masukBulanIni = bulanIni.filter((t) => t.jenis_transaksi === 'pemasukan').reduce((s, t) => s + t.nominal, 0);
  const keluarBulanIni = bulanIni.filter((t) => t.jenis_transaksi === 'pengeluaran').reduce((s, t) => s + t.nominal, 0);
  const labelBulanIni = `${NAMA_BULAN[parseTanggal(today).getMonth()]} ${today.slice(0, 4)}`;

  const tahunOpsi = useMemo(() => Array.from(new Set([today.slice(0, 4), ...db.transaksi.map((t) => t.tanggal.slice(0, 4))])).sort().reverse(), [db.transaksi, today]);
  const profileById = useMemo(() => new Map(db.profiles.map((p) => [p.id, p])), [db.profiles]);

  const rows = db.transaksi
    .filter((t) => t.tanggal.startsWith(tahun) && (!bulan || Number(t.tanggal.slice(5, 7)) === Number(bulan)) && (!jenis || t.jenis_transaksi === jenis) && (!kategori || t.kategori === kategori))
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  const tin = rows.filter((t) => t.jenis_transaksi === 'pemasukan').reduce((s, t) => s + t.nominal, 0);
  const tout = rows.filter((t) => t.jenis_transaksi === 'pengeluaran').reduce((s, t) => s + t.nominal, 0);

  const hapus = (t: TransaksiKeuangan) =>
    confirm({
      title: 'Hapus transaksi?',
      message: (
        <>
          <b style={{ color: 'var(--espresso)' }}>{t.keterangan}</b> ({formatRp(t.nominal)}) akan dihapus permanen dan saldo dihitung ulang.
        </>
      ),
      onConfirm: () => {
        setDb((d) => ({ ...d, transaksi: d.transaksi.filter((x) => x.id !== t.id) }));
        toast('Transaksi berhasil dihapus.');
      },
    });

  return (
    <>
      <PageHeader
        eyebrow="Keuangan"
        title="Transaksi Keuangan"
        description="Catat pemasukan dan pengeluaran gereja. Saldo dan rekap dihitung otomatis dari transaksi."
        actions={
          <>
            <ButtonLink href={ROUTES.DASHBOARD.KEUANGAN_LAPORAN} variant="outline" icon="bar-chart">
              Lihat Rekap
            </ButtonLink>
            <ButtonLink href={ROUTES.DASHBOARD.KEUANGAN_TAMBAH} icon="plus-lg">
              Catat Transaksi
            </ButtonLink>
          </>
        }
      />
      <div className="stats three">
        <StatCard icon="wallet2" label="Saldo Saat Ini" value={formatRp(saldo)} sub="dihitung otomatis" />
        <StatCard icon="graph-up-arrow" tone="ok" label="Pemasukan Bulan Ini" value={formatRp(masukBulanIni)} sub={labelBulanIni} />
        <StatCard icon="graph-down-arrow" tone="bad" label="Pengeluaran Bulan Ini" value={formatRp(keluarBulanIni)} sub={labelBulanIni} />
      </div>
      <div className="filters">
        <FilterSelect id="f-bulan" label="Filter bulan" value={bulan} onChange={setBulan} options={[{ value: '', label: 'Semua bulan' }, ...NAMA_BULAN.map((m, i) => ({ value: String(i + 1), label: m }))]} />
        <FilterSelect id="f-tahun" label="Filter tahun" value={tahun} onChange={setTahun} options={tahunOpsi.map((y) => ({ value: y, label: y }))} />
        <FilterSelect id="f-jenis" label="Filter jenis" value={jenis} onChange={setJenis} options={[{ value: '', label: 'Semua jenis' }, { value: 'pemasukan', label: 'Pemasukan' }, { value: 'pengeluaran', label: 'Pengeluaran' }]} />
        <FilterSelect id="f-kategori" label="Filter kategori" value={kategori} onChange={setKategori} options={[{ value: '', label: 'Semua kategori' }, ...KATEGORI_TRANSAKSI.map((k) => ({ value: k, label: k }))]} />
      </div>
      <Table<TransaksiKeuangan>
        key={`${bulan}|${tahun}|${jenis}|${kategori}`}
        data={rows}
        rowKey={(t) => t.id}
        columns={[
          { header: 'Tanggal', className: 'nowrap', cell: (t) => formatTanggalPendek(t.tanggal) },
          { header: 'Jenis', cell: (t) => (t.jenis_transaksi === 'pemasukan' ? <Badge tone="ok">Pemasukan</Badge> : <Badge tone="bad">Pengeluaran</Badge>) },
          {
            header: 'Kategori',
            hideMd: true,
            cell: (t) => (
              <Badge tone="rose" dot={false}>
                {t.kategori}
              </Badge>
            ),
          },
          { header: 'Keterangan', primary: true, cell: (t) => t.keterangan },
          {
            header: 'Nominal',
            className: 'r nowrap num',
            cell: (t) => (t.jenis_transaksi === 'pemasukan' ? <span className="amt-in">+ {formatRp(t.nominal)}</span> : <span className="amt-out">− {formatRp(t.nominal)}</span>),
          },
          { header: 'Bukti', cell: (t) => (t.bukti_url ? <IconButton icon="image" label="Lihat bukti" onClick={() => setBukti(t)} /> : <span className="dim">–</span>) },
          { header: 'Dicatat Oleh', className: 'nowrap', hideMd: true, cell: (t) => profileById.get(t.id_profiles)?.nama ?? '–' },
          {
            header: '',
            className: 'acts',
            cell: (t) => (
              <>
                <IconButton icon="pencil" label="Ubah" onClick={() => router.push(routeTransaksiUbah(t.id))} />
                <IconButton icon="trash3" label="Hapus" danger onClick={() => hapus(t)} />
              </>
            ),
          },
        ]}
      />
      {rows.length > 0 && (
        <div className="sum-strip">
          <span>
            Total pemasukan: <b className="amt-in">{formatRp(tin)}</b>
          </span>
          <span>
            Total pengeluaran: <b className="amt-out">{formatRp(tout)}</b>
          </span>
          <span>
            Selisih periode: <b>{formatRp(tin - tout)}</b>
          </span>
        </div>
      )}

      <Modal
        isOpen={!!bukti}
        onClose={() => setBukti(null)}
        title="Bukti Transaksi"
        subtitle={bukti ? `${bukti.keterangan} · ${formatTanggalPendek(bukti.tanggal)}` : ''}
        footer={
          <Button variant="outline" onClick={() => setBukti(null)}>
            Tutup
          </Button>
        }
      >
        {bukti?.bukti_url.startsWith('data:') ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bukti.bukti_url} alt="Bukti transaksi" style={{ maxWidth: '100%', borderRadius: 12, display: 'block', margin: 'auto' }} />
        ) : (
          bukti && (
            <div className="doc-prev">
              <div className="doc-page" style={{ maxWidth: 300, aspectRatio: '3 / 4', fontFamily: 'ui-monospace, Consolas, monospace' }}>
                <div className="dt" style={{ fontSize: 12 }}>
                  {bukti.jenis_transaksi === 'pemasukan' ? 'TANDA TERIMA' : 'NOTA PEMBAYARAN'}
                </div>
                <div style={{ textAlign: 'center' }}>{formatTanggalPendek(bukti.tanggal)}</div>
                <div className="doc-line" />
                <div>{bukti.keterangan}</div>
                <div className="doc-line" style={{ width: '60%' }} />
                <div className="doc-line" style={{ width: '80%' }} />
                <div style={{ marginTop: 'auto', borderTop: '1px dashed #999', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <b>TOTAL</b>
                  <b>{formatRp(bukti.nominal)}</b>
                </div>
                <small className="muted" style={{ textAlign: 'center' }}>
                  {namaBerkas(bukti.bukti_url)}
                </small>
              </div>
            </div>
          )
        )}
      </Modal>
    </>
  );
};
