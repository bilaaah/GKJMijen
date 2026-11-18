'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Button, ButtonLink, Card, Icon, PageHeader, YesNoBadge } from '@/components/common';
import { EmptyState } from '@/components/feedback';
import { useMock, JENIS_SURAT_LABEL, STATUS_SURAT_LABEL, STATUS_SURAT_TONE } from '@/lib/mock';
import { formatTanggalPendek, inisial } from '@/utils/formatters';
import { ROUTES, routeJemaatUbah, routeSuratProses } from '@/lib/constants/routes';

/** Detail satu jemaat beserta data keluarga dan riwayat permohonan surat. */
export const JemaatDetail: React.FC<{ id: string }> = ({ id }) => {
  const { db } = useMock();
  const router = useRouter();
  const j = db.jemaat.find((x) => x.id === id);

  if (!j)
    return (
      <EmptyState
        title="Data jemaat tidak ditemukan"
        description="Data mungkin sudah dihapus."
        action={
          <ButtonLink href={ROUTES.DASHBOARD.JEMAAT} variant="outline">
            Kembali ke Daftar Jemaat
          </ButtonLink>
        }
      />
    );

  const akun = db.profiles.find((p) => p.id === j.id_profiles);
  const riwayat = db.surat.filter((s) => s.id_jemaat === j.id).sort((a, b) => b.tanggal_pengajuan.localeCompare(a.tanggal_pengajuan));
  const keluarga = j.data_keluarga.split('\n').filter(Boolean);

  return (
    <>
      <PageHeader
        eyebrow="Pelayanan · Data Jemaat"
        title={j.nama}
        description={j.wilayah}
        actions={
          <>
            <ButtonLink href={ROUTES.DASHBOARD.JEMAAT} variant="outline" icon="arrow-left">
              Daftar Jemaat
            </ButtonLink>
            <ButtonLink href={routeJemaatUbah(j.id)} icon="pencil">
              Ubah Data
            </ButtonLink>
          </>
        }
      />
      <div className="grid-detail">
        <Card>
          <div className="profile-top">
            <span className="avatar lg">{inisial(j.nama)}</span>
            <h2>{j.nama}</h2>
            <Badge tone="rose" dot={false}>
              {j.wilayah}
            </Badge>
          </div>
          <dl className="dl">
            <div>
              <dt>No. HP</dt>
              <dd>{j.no_hp || '–'}</dd>
            </div>
            <div>
              <dt>Alamat</dt>
              <dd>{j.alamat}</dd>
            </div>
            <div>
              <dt>Status baptis</dt>
              <dd>
                <YesNoBadge value={j.status_baptis} />
              </dd>
            </div>
            <div>
              <dt>Status sidi</dt>
              <dd>
                <YesNoBadge value={j.status_sidi} />
              </dd>
            </div>
            <div>
              <dt>Akun tertaut</dt>
              <dd>
                {akun ? (
                  <span className="linked">
                    <Icon name="check-circle-fill" /> {akun.email}
                  </span>
                ) : (
                  <span className="dim">Belum tertaut</span>
                )}
              </dd>
            </div>
          </dl>
          <div className="sec-label">Data keluarga</div>
          {keluarga.length ? (
            <ul className="fam">
              {keluarga.map((k, i) => (
                <li key={i}>
                  <Icon name="people-fill" />
                  {k}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Belum ada data keluarga.</p>
          )}
        </Card>
        <Card title="Riwayat Permohonan Surat" aside={<span className="sub">{riwayat.length} permohonan</span>}>
          {riwayat.length ? (
            <div className="tbl-wrap flat">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Jenis Surat</th>
                    <th>Nomor Surat</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {riwayat.map((s) => (
                    <tr key={s.id}>
                      <td className="nowrap">{formatTanggalPendek(s.tanggal_pengajuan)}</td>
                      <td>{JENIS_SURAT_LABEL[s.jenis_surat]}</td>
                      <td className="num nowrap">{s.nomor_surat || '–'}</td>
                      <td>
                        <Badge tone={STATUS_SURAT_TONE[s.status]}>{STATUS_SURAT_LABEL[s.status]}</Badge>
                      </td>
                      <td className="acts">
                        <Button size="sm" variant="outline" onClick={() => router.push(routeSuratProses(s.id))}>
                          Buka
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="Belum ada permohonan" description="Jemaat ini belum pernah mengajukan surat." />
          )}
        </Card>
      </div>
    </>
  );
};
