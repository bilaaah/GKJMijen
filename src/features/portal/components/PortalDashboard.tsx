'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/common';
import { Alert } from '@/components/feedback';
import { ROUTES, routePortalSurat } from '@/lib/constants/routes';
import { NAMA_BULAN, NAMA_HARI, formatTanggalPendek } from '@/utils/formatters';
import { useNow } from '@/hooks/useInView';
import { usePortalData } from '../usePortalData';
import { layananDariSurat, namaLayanan } from '../layanan';
import { StatusBadge } from './StatusParts';

const hariIni = (d: Date) => `${NAMA_HARI[d.getDay()]}, ${d.getDate()} ${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`;

/** Dashboard Warga Jemaat: ringkasan permohonan, hal yang perlu ditindaklanjuti, dan pintasan. */
export const PortalDashboard: React.FC = () => {
  const { user, jemaat, surat, hitung } = usePortalData();
  const now = useNow(60000);
  if (!user) return null;

  const perhatian = surat.filter((s) => s.status === 'selesai' || s.status === 'ditolak').slice(0, 4);
  const sedang = hitung.diajukan + hitung.diproses;

  return (
    <div className="pt-page">
      <div className="pt-hello">
        <div>
          <p className="pt-hello-k">{now ? hariIni(now) : '\u00a0'}</p>
          <h1>Shalom, {user.nama}</h1>
          <p className="muted">{jemaat ? `${jemaat.wilayah} · Warga Jemaat` : 'Warga Jemaat'}</p>
        </div>
      </div>

      {!jemaat && (
        <Alert tone="warn" style={{ marginBottom: 20 }}>
          Akun Anda belum tertaut ke data jemaat, jadi permohonan surat belum bisa diajukan. Hubungi sekretariat gereja (Senin 09.00–15.00) agar akun ditautkan.
        </Alert>
      )}

      <div className="pt-stats">
        <Link href={`${ROUTES.PORTAL.STATUS}?filter=proses`} className="pt-stat">
          <b>{sedang}</b>
          <span>Surat sedang diproses</span>
        </Link>
        <Link href={`${ROUTES.PORTAL.STATUS}?filter=selesai`} className="pt-stat ok">
          <b>{hitung.selesai}</b>
          <span>Surat siap diunduh</span>
        </Link>
        <Link href={ROUTES.PORTAL.STATUS} className="pt-stat">
          <b>{hitung.total}</b>
          <span>Total permohonan</span>
        </Link>
      </div>

      <div className="pt-actions">
        <Link href={ROUTES.PORTAL.AJUKAN} className={`pt-act ${!jemaat ? 'disabled' : ''}`} aria-disabled={!jemaat}>
          <span className="pt-act-ic">
            <Icon name="envelope-paper" />
          </span>
          <span>
            <b>Ajukan Surat</b>
            <small>Baptis, sidi, dan atestasi (pindah jemaat)</small>
          </span>
          <Icon name="arrow-right" className="pt-act-go" />
        </Link>
        <Link href={ROUTES.PORTAL.STATUS} className="pt-act">
          <span className="pt-act-ic">
            <Icon name="clipboard-check" />
          </span>
          <span>
            <b>Status Permohonan</b>
            <small>Pantau pengajuan surat Anda</small>
          </span>
          <Icon name="arrow-right" className="pt-act-go" />
        </Link>
      </div>

      <div className="pt-grid-2">
        <section>
          <h2 className="pt-h2">Perlu perhatian</h2>
          {perhatian.length === 0 ? (
            <div className="pt-empty-sm">
              <Icon name="check2-circle" /> Tidak ada yang perlu ditindaklanjuti saat ini.
            </div>
          ) : (
            <div className="pt-attn-list">
              {perhatian.map((s) =>
                s.status === 'selesai' ? (
                  <Link key={s.id} href={routePortalSurat(s.id)} className="pt-attn ok">
                    <Icon name="file-earmark-arrow-down" />
                    <span>
                      <b>{namaLayanan(s)} siap diunduh</b>
                      <small>{s.nomor_surat ? `No. ${s.nomor_surat}` : 'Surat sudah terbit'}</small>
                    </span>
                    <span className="pt-attn-cta">Unduh</span>
                  </Link>
                ) : (
                  <Link key={s.id} href={`${ROUTES.PORTAL.AJUKAN}?layanan=${layananDariSurat(s)}&ulang=${s.id}`} className="pt-attn bad">
                    <Icon name="exclamation-circle" />
                    <span>
                      <b>{namaLayanan(s)} perlu diperbaiki</b>
                      <small>{s.catatan || 'Lihat catatan pengurus.'}</small>
                    </span>
                    <span className="pt-attn-cta">Ajukan ulang</span>
                  </Link>
                )
              )}
            </div>
          )}

          {jemaat && (
            <div className="pt-me">
              <h2 className="pt-h2">Data jemaat saya</h2>
              <dl>
                <div>
                  <dt>Wilayah</dt>
                  <dd>{jemaat.wilayah}</dd>
                </div>
                <div>
                  <dt>Baptis</dt>
                  <dd>{jemaat.status_baptis ? 'Sudah' : 'Belum'}</dd>
                </div>
                <div>
                  <dt>Sidi</dt>
                  <dd>{jemaat.status_sidi ? 'Sudah' : 'Belum'}</dd>
                </div>
              </dl>
              <p className="hint">Ada data yang tidak sesuai? Sampaikan ke sekretariat agar diperbarui.</p>
            </div>
          )}
        </section>

        <section>
          <div className="row-between" style={{ marginBottom: 12 }}>
            <h2 className="pt-h2" style={{ margin: 0 }}>
              Permohonan terakhir
            </h2>
            {surat.length > 0 && (
              <Link href={ROUTES.PORTAL.STATUS} className="link">
                Lihat semua
              </Link>
            )}
          </div>
          {surat.length === 0 ? (
            <div className="pt-empty-sm">
              <Icon name="inbox" /> Belum ada permohonan. Ajukan surat pertama Anda kapan saja.
            </div>
          ) : (
            <div className="pt-recent">
              {surat.slice(0, 4).map((s) => (
                <Link key={s.id} href={routePortalSurat(s.id)} className="pt-recent-row">
                  <span>
                    <b>{namaLayanan(s)}</b>
                    <small>Diajukan {formatTanggalPendek(s.tanggal_pengajuan)}</small>
                  </span>
                  <StatusBadge status={s.status} />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
