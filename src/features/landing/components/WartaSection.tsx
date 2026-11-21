'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon, Modal } from '@/components/common';
import { useToast } from '@/components/feedback';
import { bukaBerkas, useData, type Warta } from '@/lib/data';
import { NAMA_BULAN, formatHariTanggal, parseTanggal } from '@/utils/formatters';

const polos = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const kategori = (w: Warta) => (/^warta jemaat/i.test(w.judul) ? 'Warta' : /laporan/i.test(w.judul) ? 'Laporan' : 'Pengumuman');

/** Warta yang sudah terbit, dapat digeser (geser jari / tombol panah) dan dibaca langsung. */
export const WartaSection: React.FC = () => {
  const { db } = useData();
  const toast = useToast();
  const track = useRef<HTMLDivElement>(null);
  const [ujung, setUjung] = useState({ kiri: true, kanan: false });
  const [baca, setBaca] = useState<Warta | null>(null);

  // Hanya warta berstatus "terbit" yang tampil untuk publik (sesuai RLS)
  const daftar = useMemo(
    () => db.warta.filter((w) => w.status === 'terbit').sort((a, b) => b.tanggal_terbit.localeCompare(a.tanggal_terbit)),
    [db.warta]
  );

  const cekUjung = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setUjung({ kiri: el.scrollLeft < 8, kanan: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    cekUjung();
    window.addEventListener('resize', cekUjung);
    return () => window.removeEventListener('resize', cekUjung);
  }, [cekUjung, daftar.length]);

  const geser = (arah: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const kartu = el.querySelector<HTMLElement>('.lp-wc');
    el.scrollBy({ left: arah * ((kartu?.offsetWidth ?? 320) + 20), behavior: 'smooth' });
  };

  return (
    <section id="warta" className="lp-sec lp-warta">
      <div className="lp-wrap">
        <div className="lp-sec-head row-between">
          <div>
            <h2 className="lp-h2">Warta dan Pengumuman</h2>
            <p>Geser untuk melihat warta lainnya. Ketuk kartu untuk membaca isinya.</p>
          </div>
          <div className="lp-arrows">
            <button type="button" className="lp-arrow" onClick={() => geser(-1)} disabled={ujung.kiri} aria-label="Warta sebelumnya">
              <Icon name="chevron-left" />
            </button>
            <button type="button" className="lp-arrow" onClick={() => geser(1)} disabled={ujung.kanan} aria-label="Warta berikutnya">
              <Icon name="chevron-right" />
            </button>
          </div>
        </div>

        {daftar.length === 0 ? (
          <p className="muted">Belum ada warta yang diterbitkan.</p>
        ) : (
          <div className="lp-track" ref={track} onScroll={cekUjung}>
            {daftar.map((w) => {
              const d = parseTanggal(w.tanggal_terbit);
              return (
                <button key={w.id} type="button" className="lp-wc" onClick={() => setBaca(w)}>
                  <span className="lp-wc-top">
                    <span className="lp-wc-date">
                      <b>{d.getDate()}</b>
                      <small>
                        {NAMA_BULAN[d.getMonth()]} {d.getFullYear()}
                      </small>
                    </span>
                    <span className="lp-wc-tag">
                      {kategori(w)}
                      {w.url_pdf && ' · PDF'}
                    </span>
                  </span>
                  <span className="lp-wc-body">
                    <b>{w.judul}</b>
                    <span className="lp-wc-ex">{polos(w.isi)}</span>
                    <span className="lp-wc-more">
                      Baca warta <Icon name="arrow-right-short" />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={!!baca} onClose={() => setBaca(null)} size="lg">
        {baca && (
          <article className="lp-read">
            <span className="lp-wc-tag dark">{kategori(baca)}</span>
            <h2>{baca.judul}</h2>
            <p className="lp-read-meta">
              <Icon name="calendar3" /> Terbit {formatHariTanggal(baca.tanggal_terbit)}
            </p>
            {/* Isi warta ditulis pengurus melalui editor internal */}
            <div className="wp-body" dangerouslySetInnerHTML={{ __html: baca.isi }} />
            {baca.url_pdf && (
              <div className="modal-acts">
                {/* PDF warta ada di bucket publik Supabase Storage */}
                <button type="button" className="btn btn-primary" onClick={() => bukaBerkas(baca.url_pdf) || toast('Berkas PDF warta belum tersedia.', 'info')}>
                  <Icon name="file-earmark-pdf" /> Unduh versi PDF
                </button>
              </div>
            )}
          </article>
        )}
      </Modal>
    </section>
  );
};
