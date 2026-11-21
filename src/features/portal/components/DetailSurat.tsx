'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Icon, LogoMark } from '@/components/common';
import { EmptyState, useToast } from '@/components/feedback';
import { ROUTES } from '@/lib/constants/routes';
import { bukaBerkas, type Jemaat, type PermohonanSurat } from '@/lib/data';
import { formatHariTanggal, formatTanggalPendek, namaBerkas } from '@/utils/formatters';
import { usePortalData } from '../usePortalData';
import { STATUS_WARGA, tampilIsi, bacaKeterangan, layananDariSurat, namaLayanan } from '../layanan';
import { StatusBadge, StatusSteps } from './StatusParts';
import { GEREJA } from '@/features/landing/content';
import { PENANDATANGAN } from '@/features/surat/kop-surat';

const JUDUL: Record<PermohonanSurat['jenis_surat'], string> = { baptis: 'Surat Baptis', sidi: 'Surat Sidi', atestasi: 'Surat Atestasi' };

function isi(s: PermohonanSurat, j: Jemaat) {
  const k = Object.fromEntries(bacaKeterangan(s).map((x) => [x.label, x.isi]));
  if (s.jenis_surat === 'baptis') {
    const nama = k['Nama anak'] ?? j.nama;
    return (
      <>
        Majelis GKJ Mijen menerangkan bahwa <b>{nama}</b>
        {k['Nama anak'] ? `, anak dari keluarga ${j.nama},` : ','} telah menerima Sakramen Baptis Kudus dan tercatat sebagai warga GKJ Mijen, {j.wilayah}.
      </>
    );
  }
  if (s.jenis_surat === 'sidi')
    return (
      <>
        Majelis GKJ Mijen menerangkan bahwa <b>{j.nama}</b> telah mengaku percaya (sidi) di hadapan jemaat dan tercatat sebagai warga dewasa GKJ Mijen, {j.wilayah}.
      </>
    );
  return (
    <>
      Majelis GKJ Mijen menerangkan bahwa <b>{j.nama}</b> adalah warga GKJ Mijen, {j.wilayah}, dan dengan surat ini keanggotaannya dipindahkan ke{' '}
      <b>{k['Gereja tujuan'] && k['Gereja tujuan'] !== '-' ? k['Gereja tujuan'] : 'gereja tujuan'}</b>.
    </>
  );
}

/** Kertas surat: pratinjau surat yang sudah terbit (juga dipakai saat dicetak / disimpan PDF). */
const SuratKertas: React.FC<{ s: PermohonanSurat; j: Jemaat }> = ({ s, j }) => (
  <div className="pt-paper" id="surat-cetak">
    <header>
      <LogoMark tone="maroon" />
      <div>
        <b>GEREJA KRISTEN JAWA MIJEN</b>
        <small>{GEREJA.alamat}</small>
      </div>
    </header>
    <h2>{JUDUL[s.jenis_surat].toUpperCase()}</h2>
    <p className="pt-paper-no">No. {s.nomor_surat || '–'}</p>
    <p className="pt-paper-body">{isi(s, j)}</p>
    <p className="pt-paper-body">Demikian surat ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
    <div className="pt-paper-sign">
      <span>Mijen, {formatHariTanggal(s.tanggal_pengajuan).split(', ')[1]}</span>
      <span>Atas nama Majelis GKJ Mijen</span>
      <span className="pt-paper-ttd">(tanda tangan)</span>
      <b>{PENANDATANGAN.nama}</b>
    </div>
  </div>
);

/** Kertas kosong untuk surat yang belum terbit. */
const SuratBelum: React.FC<{ s: PermohonanSurat }> = ({ s }) => (
  <div className="pt-paper pending" aria-label="Surat belum terbit">
    <div className="pt-paper-wm">{s.status === 'ditolak' ? 'Ditolak' : 'Belum terbit'}</div>
    <span className="doc-line" style={{ width: '60%', margin: '0 auto' }} />
    <span className="doc-line" style={{ width: '40%', margin: '0 auto 24px' }} />
    {[92, 100, 85, 96, 70].map((w, i) => (
      <span key={i} className="doc-line" style={{ width: `${w}%` }} />
    ))}
    <p className="pt-paper-msg">
      {s.status === 'ditolak'
        ? 'Permohonan ini ditolak. Perbaiki sesuai catatan pengurus lalu ajukan ulang.'
        : 'Surat akan tampil di sini setelah pengurus menyelesaikan permohonan Anda.'}
    </p>
  </div>
);

/** Detail satu permohonan (UC04): pratinjau surat, unduh PDF, riwayat, dan data yang dikirim. */
export const DetailSurat: React.FC<{ id: string }> = ({ id }) => {
  const { surat, jemaat } = usePortalData();
  const toast = useToast();
  const s = surat.find((x) => x.id === id);

  // Saat mencetak, hanya kertas surat yang ikut tercetak (lihat @media print di jemaat.css)
  useEffect(() => {
    const after = () => document.body.classList.remove('cetak-surat');
    window.addEventListener('afterprint', after);
    return () => window.removeEventListener('afterprint', after);
  }, []);

  if (!s || !jemaat) {
    return (
      <div className="pt-page">
        <div className="gk-card">
          <EmptyState
            icon="file-earmark-x"
            title="Permohonan tidak ditemukan"
            description="Permohonan ini tidak ada atau bukan milik akun Anda."
            action={
              <Link href={ROUTES.PORTAL.STATUS} className="btn btn-primary">
                Kembali ke status
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  /**
   * Unduh surat final PDF yang diunggah pengurus (Supabase Storage, URL bertanda tangan).
   * Jika pengurus belum mengunggah berkas, surat dicetak dari pratinjau
   * (pilih "Simpan sebagai PDF" di jendela cetak).
   */
  const unduh = () => {
    if (bukaBerkas(s.url_surat)) return;
    document.body.classList.add('cetak-surat');
    toast('Pilih "Simpan sebagai PDF" pada jendela cetak untuk menyimpan surat.', 'info');
    setTimeout(() => window.print(), 300);
  };

  const data = bacaKeterangan(s);

  return (
    <div className="pt-page">
      <nav className="pt-crumb" aria-label="Breadcrumb">
        <Link href={ROUTES.PORTAL.STATUS}>Status Permohonan</Link>
        <Icon name="chevron-right" />
        <span>{namaLayanan(s)}</span>
      </nav>

      <div className="pt-detail">
        <div className="pt-paper-wrap">{s.status === 'selesai' ? <SuratKertas s={s} j={jemaat} /> : <SuratBelum s={s} />}</div>

        <div className="stack">
          <div className="gk-card pt-sum">
            <StatusBadge status={s.status} />
            <h1>{namaLayanan(s)}</h1>
            <p className="muted">
              Diajukan {formatTanggalPendek(s.tanggal_pengajuan)}
              {s.nomor_surat && ` · No. ${s.nomor_surat}`}
            </p>
            <div className="pt-sum-acts">
              {s.status === 'selesai' && (
                <button type="button" className="btn btn-primary w-100" onClick={unduh}>
                  <Icon name="download" /> Unduh PDF
                </button>
              )}
              {s.status === 'ditolak' && (
                <Link href={`${ROUTES.PORTAL.AJUKAN}?layanan=${layananDariSurat(s)}&ulang=${s.id}`} className="btn btn-primary w-100">
                  <Icon name="arrow-repeat" /> Ajukan ulang
                </Link>
              )}
              <Link href={ROUTES.PORTAL.STATUS} className="btn btn-outline-primary w-100">
                <Icon name="arrow-left" /> Kembali ke status
              </Link>
            </div>
          </div>

          {s.status === 'ditolak' && s.catatan && (
            <div className="note bad">
              <Icon name="chat-left-text" />
              <div>
                <b>Catatan pengurus</b>
                <br />
                {s.catatan}
              </div>
            </div>
          )}
          {s.status === 'diproses' && s.catatan && (
            <div className="note warn">
              <Icon name="info-circle" />
              <div>{s.catatan}</div>
            </div>
          )}

          <div className="gk-card">
            <h3 className="pt-card-h">Riwayat</h3>
            <p className="hint" style={{ marginTop: -6 }}>
              Status saat ini: {STATUS_WARGA[s.status].toLowerCase()}
            </p>
            <StatusSteps surat={s} />
          </div>

          <div className="gk-card">
            <h3 className="pt-card-h">Data yang Anda kirim</h3>
            {data.length > 0 ? (
              <dl className="dl">
                {data.map((d) => (
                  <div key={d.label}>
                    <dt>{d.label}</dt>
                    <dd>{tampilIsi(d.isi)}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="muted">Tidak ada isian tambahan.</p>
            )}
            {s.url_lampiran && (
              <div className="file-row" style={{ marginTop: 14 }}>
                <span className="fi">
                  <Icon name="paperclip" />
                </span>
                <span className="ft">
                  <b>{namaBerkas(s.url_lampiran)}</b>
                  <small>Lampiran permohonan</small>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
