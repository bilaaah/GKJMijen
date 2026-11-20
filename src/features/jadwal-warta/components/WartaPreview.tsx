'use client';

import React from 'react';
import { Badge, Button, Icon, Modal } from '@/components/common';
import { useToast } from '@/components/feedback';
import { formatTanggalPendek, namaBerkas } from '@/utils/formatters';
import { bukaBerkas } from '@/lib/data';

/** Pratinjau warta seperti yang akan tampil di landing page. */
export const WartaPreview: React.FC<{
  open: boolean;
  onClose: () => void;
  judul: string;
  isi: string;
  tanggal: string;
  penulis: string;
  pdf: string;
}> = ({ open, onClose, judul, isi, tanggal, penulis, pdf }) => {
  const toast = useToast();
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="lg"
      footer={
        <Button variant="outline" onClick={onClose}>
          Tutup
        </Button>
      }
    >
      <p className="muted" style={{ margin: '0 0 12px', fontSize: 13 }}>
        Pratinjau tampilan di landing page
      </p>
      <div className="wp">
        <div className="eyebrow">Warta &amp; Agenda</div>
        <h2>{judul || '(Belum ada judul)'}</h2>
        <div className="wp-meta">
          <Badge tone="rose" dot={false}>
            Warta Jemaat
          </Badge>
          {formatTanggalPendek(tanggal)} · {penulis}
        </div>
        <div className="wp-body" dangerouslySetInnerHTML={{ __html: isi }} />
        {pdf && (
          <div className="file-row" style={{ marginTop: 18 }}>
            <span className="fi">
              <Icon name="file-earmark-text" />
            </span>
            <div className="ft">
              <b>{namaBerkas(pdf)}</b>
              <small>Warta versi PDF</small>
            </div>
            <Button size="sm" icon="download" onClick={() => bukaBerkas(pdf) || toast(`Berkas ${namaBerkas(pdf)} belum tersedia.`, 'info')}>
              Unduh PDF
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
