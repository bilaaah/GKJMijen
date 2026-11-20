import React from 'react';
import { Badge, Icon } from '@/components/common';
import { STATUS_SURAT_TONE, type PermohonanSurat } from '@/lib/data';
import { formatTanggalPendek } from '@/utils/formatters';
import { STATUS_WARGA, langkahStatus } from '../layanan';

/** Label status dalam bahasa warga, warna mengikuti panel pengurus. */
export const StatusBadge: React.FC<{ status: PermohonanSurat['status'] }> = ({ status }) => <Badge tone={STATUS_SURAT_TONE[status]}>{STATUS_WARGA[status]}</Badge>;

/** Riwayat langkah permohonan dalam bentuk garis waktu vertikal. */
export const StatusSteps: React.FC<{ surat: PermohonanSurat }> = ({ surat }) => {
  const langkah = langkahStatus(surat, formatTanggalPendek);
  return (
    <ol className="pt-steps">
      {langkah.map((l, i) => (
        <li key={i} className={`pt-step ${l.state}`} style={{ animationDelay: `${i * 70}ms` }}>
          <span className="pt-step-dot" aria-hidden="true">
            {l.state === 'done' && <Icon name="check" />}
            {l.state === 'rej' && <Icon name="x" />}
          </span>
          <span className="pt-step-tx">
            <b>{l.judul}</b>
            {l.ket && <small>{l.ket}</small>}
          </span>
          <span className="visually-hidden">{l.state === 'done' ? 'selesai' : l.state === 'cur' ? 'sedang berlangsung' : l.state === 'rej' ? 'ditolak' : 'belum'}</span>
        </li>
      ))}
    </ol>
  );
};
