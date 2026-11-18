'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge, ButtonLink, Card, Icon, LogoMark, StatCard } from '@/components/common';
import { useMock, JENIS_SURAT_LABEL, STATUS_SURAT_LABEL, STATUS_SURAT_TONE } from '@/lib/mock';
import { formatHariTanggal, formatJam, formatRp, formatTanggalPendek, hariIniISO, NAMA_BULAN, NAMA_HARI, parseTanggal } from '@/utils/formatters';
import { ROUTES, routeKegiatanUbah, routeSuratProses } from '@/lib/constants/routes';

const byDateTime = (a: { tanggal: string; jam: string }, b: { tanggal: string; jam: string }) => (a.tanggal + a.jam).localeCompare(b.tanggal + b.jam);

export const DashboardOverview: React.FC = () => {
  const { db, user } = useMock();
  const router = useRouter();
  const today = hariIniISO();
  const now = parseTanggal(today);

  // Rentang minggu ini: Senin–Minggu
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const weekStart = hariIniISO(monday);
  const weekEnd = hariIniISO(sunday);

  const ym = today.slice(0, 7);
  const bulanIni = db.transaksi.filter((t) => t.tanggal.startsWith(ym));
  const masuk = bulanIni.filter((t) => t.jenis_transaksi === 'pemasukan').reduce((s, t) => s + t.nominal, 0);
  const keluar = bulanIni.filter((t) => t.jenis_transaksi === 'pengeluaran').reduce((s, t) => s + t.nominal, 0);
  const saldo = db.transaksi.reduce((s, t) => s + (t.jenis_transaksi === 'pemasukan' ? t.nominal : -t.nominal), 0);

  const menunggu = db.surat.filter((s) => s.status === 'diajukan').length;
  const kegiatanMingguIni = db.kegiatan.filter((k) => k.tanggal >= weekStart && k.tanggal <= weekEnd).length;
  const ibadah = db.kegiatan.filter((k) => k.nama_kegiatan.startsWith('Ibadah Minggu') && k.tanggal >= today).sort(byDateTime).slice(0, 3);
  const terbaru = [...db.surat].sort((a, b) => b.tanggal_pengajuan.localeCompare(a.tanggal_pengajuan)).slice(0, 5);
  const mendatang = db.kegiatan.filter((k) => k.tanggal >= today).sort(byDateTime).slice(0, 5);
  const namaDepan = (user?.nama ?? '').replace(/^(Pdt|Pnt)\.\s*/, '').split(' ')[0];
  const jemaatById = new Map(db.jemaat.map((j) => [j.id, j]));

  return (
    <>
      <section className="hero-banner">
        <div className="hb-tx">
          <LogoMark />
          <div className="eyebrow eb-light">{formatHariTanggal(today)}</div>
          <h1>Selamat datang, {namaDepan}</h1>
          <p>
            Ada <b>{menunggu} permohonan surat</b> yang menunggu diperiksa.
          </p>
        </div>
        <div className="hb-act">
          <ButtonLink href={ROUTES.DASHBOARD.KEUANGAN_TAMBAH} variant="white" icon="plus-lg">
            Catat Transaksi
          </ButtonLink>
          <ButtonLink href={`${ROUTES.DASHBOARD.SURAT}?status=diajukan`} variant="outline-light">
            Proses Surat
          </ButtonLink>
        </div>
      </section>

      <div className="stats">
        <StatCard icon="people" label="Total Jemaat" value={db.jemaat.length} sub="terdata di 3 wilayah" href={ROUTES.DASHBOARD.JEMAAT} />
        <StatCard icon="file-earmark-text" label="Surat Menunggu" value={menunggu} sub="berstatus Diajukan" href={ROUTES.DASHBOARD.SURAT} />
        <StatCard icon="wallet2" label="Saldo Kas Saat Ini" value={formatRp(saldo)} sub={`per ${formatTanggalPendek(today)}`} href={ROUTES.DASHBOARD.KEUANGAN} />
        <StatCard icon="calendar3" label="Kegiatan Minggu Ini" value={kegiatanMingguIni} sub={`${formatTanggalPendek(weekStart)} – ${formatTanggalPendek(weekEnd)}`} href={ROUTES.DASHBOARD.JADWAL_WARTA} />
      </div>

      <section className="band">
        <div className="band-head">
          <div className="eyebrow eb-light">Bersekutu bersama</div>
          <h2>Jadwal Ibadah Minggu Ini</h2>
        </div>
        {ibadah.length === 0 && <div className="band-s">Belum ada jadwal ibadah Minggu yang akan datang.</div>}
        {ibadah.map((k) => (
          <div className="band-col" key={k.id}>
            <div className="band-k">{k.nama_kegiatan.replace('Ibadah ', '')}</div>
            <div className="band-v">
              {NAMA_HARI[parseTanggal(k.tanggal).getDay()]} · {formatJam(k.jam)}
            </div>
            <div className="band-s">
              {formatTanggalPendek(k.tanggal)} · {k.lokasi}
            </div>
          </div>
        ))}
      </section>

      <div className="grid-2">
        <Card
          title="Permohonan Surat Terbaru"
          aside={
            <Link className="link" href={ROUTES.DASHBOARD.SURAT}>
              Lihat semua
            </Link>
          }
        >
          <div className="tbl-wrap flat">
            <table className="tbl mini">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Pemohon</th>
                  <th>Jenis</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {terbaru.map((s) => (
                  <tr key={s.id} className="click" onClick={() => router.push(routeSuratProses(s.id))}>
                    <td className="nowrap">{formatTanggalPendek(s.tanggal_pengajuan)}</td>
                    <td>{jemaatById.get(s.id_jemaat)?.nama ?? '–'}</td>
                    <td>
                      <Badge tone="rose" dot={false}>
                        {JENIS_SURAT_LABEL[s.jenis_surat].replace('Surat ', '')}
                      </Badge>
                    </td>
                    <td>
                      <Badge tone={STATUS_SURAT_TONE[s.status]}>{STATUS_SURAT_LABEL[s.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card
          title="Kegiatan Mendatang"
          aside={
            <Link className="link" href={`${ROUTES.DASHBOARD.JADWAL_WARTA}?view=kalender`}>
              Kalender
            </Link>
          }
        >
          {mendatang.map((k) => {
            const d = parseTanggal(k.tanggal);
            return (
              <Link className="ev" key={k.id} href={routeKegiatanUbah(k.id)}>
                <div className="ev-date">
                  <b>{d.getDate()}</b>
                  <small>{NAMA_BULAN[d.getMonth()].slice(0, 3)}</small>
                </div>
                <div className="ev-tx">
                  <b>{k.nama_kegiatan}</b>
                  <small>
                    {NAMA_HARI[d.getDay()]}, {formatJam(k.jam)} · {k.lokasi}
                  </small>
                </div>
              </Link>
            );
          })}
        </Card>
      </div>

      <Card
        title={`Keuangan ${NAMA_BULAN[now.getMonth()]} ${now.getFullYear()}`}
        aside={
          <Link className="link" href={ROUTES.DASHBOARD.KEUANGAN_LAPORAN}>
            Lihat rekap
          </Link>
        }
      >
        <div className="fin">
          <div className="fin-item">
            <small>
              <Icon name="graph-up-arrow" style={{ color: 'var(--ok)' }} /> Total Pemasukan
            </small>
            <b className="amt-in">{formatRp(masuk)}</b>
          </div>
          <div className="fin-item">
            <small>
              <Icon name="graph-down-arrow" style={{ color: 'var(--bad)' }} /> Total Pengeluaran
            </small>
            <b className="amt-out">{formatRp(keluar)}</b>
          </div>
          <div className="fin-item">
            <small>
              <Icon name="wallet2" style={{ color: 'var(--maroon)' }} /> Saldo Kas
            </small>
            <b style={{ color: 'var(--maroon)' }}>{formatRp(saldo)}</b>
          </div>
        </div>
      </Card>
    </>
  );
};
