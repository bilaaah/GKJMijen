'use client';

import React, { useState } from 'react';
import { Button, Card, PageHeader } from '@/components/common';
import { FilterSelect } from '@/components/forms';
import { useToast } from '@/components/feedback';
import { useData, KATEGORI_TRANSAKSI, STATUS_SURAT, STATUS_SURAT_LABEL, STATUS_SURAT_TONE, type JenisTransaksi } from '@/lib/data';
import { formatRp, hariIniISO, NAMA_BULAN } from '@/utils/formatters';

/** Laporan & rekap kas bulanan (dihitung otomatis dari transaksi). */
export const LaporanRekap: React.FC = () => {
  const { db } = useData();
  const toast = useToast();
  const today = hariIniISO();
  const [bulan, setBulan] = useState(String(Number(today.slice(5, 7))));
  const [tahun, setTahun] = useState(today.slice(0, 4));

  const y = Number(tahun);
  const m = Number(bulan);
  const ym = `${tahun}-${String(m).padStart(2, '0')}`;
  const start = `${ym}-01`;
  const lastDay = new Date(y, m, 0).getDate();
  const periode = `${NAMA_BULAN[m - 1]} ${y}`;

  const awal = db.transaksi.filter((t) => t.tanggal < start).reduce((s, t) => s + (t.jenis_transaksi === 'pemasukan' ? t.nominal : -t.nominal), 0);
  const tr = db.transaksi.filter((t) => t.tanggal.startsWith(ym));
  const perKategori = (j: JenisTransaksi) =>
    KATEGORI_TRANSAKSI.map((k) => [k, tr.filter((t) => t.jenis_transaksi === j && t.kategori === k).reduce((s, t) => s + t.nominal, 0)] as const).filter(([, v]) => v > 0);
  const pin = perKategori('pemasukan');
  const pout = perKategori('pengeluaran');
  const tin = pin.reduce((s, [, v]) => s + v, 0);
  const tout = pout.reduce((s, [, v]) => s + v, 0);
  const akhir = awal + tin - tout;
  const surat = db.surat.filter((s) => s.tanggal_pengajuan.startsWith(ym));
  const tahunOpsi = Array.from(new Set([today.slice(0, 4), ...db.transaksi.map((t) => t.tanggal.slice(0, 4))])).sort().reverse();

  return (
    <>
      <PageHeader
        eyebrow="Keuangan"
        title="Laporan & Rekap"
        description="Rekap bulanan dihitung otomatis dari transaksi yang tercatat dan dapat dicetak atau diekspor."
        actions={
          <>
            <Button variant="outline" icon="printer" onClick={() => toast(`Rekap ${periode} disiapkan sebagai PDF. Unduhan aktif setelah backend tersambung.`, 'info')}>
              Cetak PDF
            </Button>
            <Button icon="file-earmark-spreadsheet" onClick={() => toast(`Rekap ${periode} diekspor ke Excel. Unduhan aktif setelah backend tersambung.`, 'info')}>
              Ekspor Excel
            </Button>
          </>
        }
      />
      <div className="period">
        <span className="muted" style={{ fontSize: 14 }}>
          Periode
        </span>
        <FilterSelect id="lap-bulan" label="Bulan" value={bulan} onChange={setBulan} options={NAMA_BULAN.map((b, i) => ({ value: String(i + 1), label: b }))} />
        <FilterSelect id="lap-tahun" label="Tahun" value={tahun} onChange={setTahun} options={tahunOpsi.map((t) => ({ value: t, label: t }))} />
      </div>
      <div className="grid-lap">
        <Card title={`Rekap Kas ${periode}`} aside={<span className="sub">{tr.length} transaksi</span>}>
          <div className="tbl-wrap flat">
            <table className="tbl rekap">
              <tbody>
                <tr className="r-open">
                  <td>
                    Saldo awal (1 {NAMA_BULAN[m - 1]} {y})
                  </td>
                  <td className="r num">{formatRp(awal)}</td>
                </tr>
                <tr className="r-head">
                  <td colSpan={2}>Pemasukan</td>
                </tr>
                {pin.length ? (
                  pin.map(([k, v]) => (
                    <tr className="r-sub" key={k}>
                      <td>{k}</td>
                      <td className="r num">{formatRp(v)}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="r-sub">
                    <td className="muted">Tidak ada pemasukan</td>
                    <td className="r">–</td>
                  </tr>
                )}
                <tr className="r-total">
                  <td>Total pemasukan</td>
                  <td className="r num amt-in">{formatRp(tin)}</td>
                </tr>
                <tr className="r-head">
                  <td colSpan={2}>Pengeluaran</td>
                </tr>
                {pout.length ? (
                  pout.map(([k, v]) => (
                    <tr className="r-sub" key={k}>
                      <td>{k}</td>
                      <td className="r num">{formatRp(v)}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="r-sub">
                    <td className="muted">Tidak ada pengeluaran</td>
                    <td className="r">–</td>
                  </tr>
                )}
                <tr className="r-total">
                  <td>Total pengeluaran</td>
                  <td className="r num amt-out">{formatRp(tout)}</td>
                </tr>
                <tr className="r-grand">
                  <td>
                    Saldo akhir ({lastDay} {NAMA_BULAN[m - 1]} {y})
                  </td>
                  <td className="r num">{formatRp(akhir)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        <div className="stack">
          <Card>
            <div className="eyebrow">Saldo akhir</div>
            <div className="big-saldo" style={{ margin: '8px 0 14px' }}>
              {formatRp(akhir)}
            </div>
            <div className="kv">
              <span className="muted">Saldo awal</span>
              <b>{formatRp(awal)}</b>
            </div>
            <div className="kv">
              <span className="muted">Pemasukan</span>
              <b className="amt-in">+ {formatRp(tin)}</b>
            </div>
            <div className="kv">
              <span className="muted">Pengeluaran</span>
              <b className="amt-out">− {formatRp(tout)}</b>
            </div>
          </Card>
          <Card title="Permohonan Surat" aside={<span className="sub">{periode}</span>}>
            <div className="st-grid">
              {STATUS_SURAT.map((st) => (
                <div className="st-box" key={st}>
                  <small>
                    <span className={`dot dot-${STATUS_SURAT_TONE[st]}`} />
                    {STATUS_SURAT_LABEL[st]}
                  </small>
                  <b>{surat.filter((s) => s.status === st).length}</b>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};
