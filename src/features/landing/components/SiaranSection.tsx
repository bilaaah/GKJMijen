'use client';

import React, { useEffect, useState } from 'react';
import { Icon, Modal } from '@/components/common';
import { NAMA_BULAN } from '@/utils/formatters';
import { KANAL_YOUTUBE, type SiaranResponse, type VideoSiaran } from '../siaran';
import { SIARAN } from '../content';

const tglPendek = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()} ${NAMA_BULAN[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
};

const relatif = (iso: string) => {
  const hari = Math.floor((Date.now() - +new Date(iso)) / 86400000);
  if (hari < 1) return 'Hari ini';
  if (hari === 1) return 'Kemarin';
  if (hari < 7) return `${hari} hari lalu`;
  if (hari < 30) return `${Math.floor(hari / 7)} minggu lalu`;
  return tglPendek(iso);
};

const ditonton = (n?: number) => (n === undefined ? '' : n >= 1000 ? `${(n / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} rb kali ditonton` : `${n} kali ditonton`);

/** Judul YouTube biasanya "IBADAH MINGGU || 15 NOVEMBER 2026": rapikan huruf besarnya. */
const rapikan = (t: string) => (t === t.toUpperCase() ? t.toLowerCase().replace(/(^|\s|\(|\|)(\p{L})/gu, (_, a, b) => a + b.toUpperCase()) : t);

const StatusPill: React.FC<{ v: VideoSiaran }> = ({ v }) =>
  v.status === 'live' ? (
    <span className="lp-live">
      <i /> LIVE
    </span>
  ) : v.status === 'akan-tayang' ? (
    <span className="lp-live soon">
      <Icon name="clock" /> Akan tayang
    </span>
  ) : null;

/**
 * Arsip Siaran Ibadah: otomatis mengambil siaran terbaru dari kanal YouTube gereja lewat /api/siaran.
 * Klik video → diputar di popup (tanpa meninggalkan halaman).
 */
export const SiaranSection: React.FC = () => {
  const [data, setData] = useState<SiaranResponse | null>(null);
  const [putar, setPutar] = useState<VideoSiaran | null>(null);

  useEffect(() => {
    let batal = false;
    fetch('/api/siaran')
      .then((r) => r.json() as Promise<SiaranResponse>)
      .then((j) => !batal && setData(j))
      .catch(() => !batal && setData({ sumber: 'cadangan', videos: [] }));
    return () => {
      batal = true;
    };
  }, []);

  const memuat = data === null;
  const videos = data?.videos ?? [];
  const cadangan = !memuat && videos.length === 0;
  const [utama, ...lain] = videos;

  return (
    <section id="siaran" className="lp-sec lp-siaran">
      <div className="lp-wrap">
        <div className="lp-sec-head row-between">
          <div>
            <h2 className="lp-h2">Arsip Siaran Ibadah</h2>
            <p>
              {utama?.status === 'live'
                ? 'Ibadah sedang disiarkan langsung. Klik untuk ikut beribadah dari mana saja.'
                : 'Siaran langsung terbaru dari kanal YouTube GKJ Mijen, diperbarui otomatis.'}
            </p>
          </div>
          <a className="btn btn-outline-primary" href={KANAL_YOUTUBE.urlLive} target="_blank" rel="noreferrer">
            <Icon name="youtube" /> Semua siaran
          </a>
        </div>

        {memuat && (
          <div className="lp-yt-grid" aria-busy="true" aria-label="Memuat siaran">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={`lp-yt skel ${i === 0 ? 'big' : ''}`}>
                <span className="lp-yt-thumb" />
                <span className="skel-line" />
                <span className="skel-line short" />
              </div>
            ))}
          </div>
        )}

        {!memuat && !cadangan && (
          <div className="lp-yt-grid">
            {[utama, ...lain.slice(0, 5)].map((v, i) => (
              <button key={v.id} type="button" className={`lp-yt ${i === 0 ? 'big' : ''}`} onClick={() => setPutar(v)} aria-label={`Putar ${v.judul}`}>
                <span className="lp-yt-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.thumb} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
                  <StatusPill v={v} />
                  <span className="lp-yt-play" aria-hidden="true">
                    <Icon name="play-fill" />
                  </span>
                </span>
                <span className="lp-yt-tx">
                  <b>{rapikan(v.judul)}</b>
                  <small>
                    {v.status === 'live' ? 'Sedang tayang' : relatif(v.tanggal)}
                    {v.ditonton !== undefined && ` · ${ditonton(v.ditonton)}`}
                  </small>
                </span>
              </button>
            ))}
          </div>
        )}

        {cadangan && (
          <>
            <p className="note" style={{ marginBottom: 20 }}>
              <Icon name="wifi-off" /> Siaran terbaru belum bisa dimuat. Berikut arsip yang tersimpan.
            </p>
            <div className="lp-vid-grid">
              {SIARAN.map((v) => (
                <a key={v.tanggal} className="lp-vid" href={v.href} target="_blank" rel="noreferrer">
                  <span className={`lp-vid-cover w-${v.warna}`}>
                    <span className="lp-vid-big">Ibadah Minggu</span>
                    <span className="lp-vid-tema">{v.tema}</span>
                    <span className="lp-vid-dur">{v.durasi}</span>
                  </span>
                  <b>Ibadah Minggu, {tglPendek(v.tanggal)}</b>
                  <small>
                    {v.bacaan} · {v.pengkhotbah}
                  </small>
                </a>
              ))}
            </div>
          </>
        )}
      </div>

      <Modal isOpen={!!putar} onClose={() => setPutar(null)} size="lg">
        {putar && (
          <div className="lp-player">
            <div className="lp-player-frame">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${putar.id}?autoplay=1&rel=0&modestbranding=1`}
                title={putar.judul}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="lp-player-tx">
              <div>
                <h3>{rapikan(putar.judul)}</h3>
                <p className="muted">
                  {putar.status === 'live' ? 'Siaran langsung' : `Disiarkan ${tglPendek(putar.tanggal)}`}
                  {putar.ditonton !== undefined && ` · ${ditonton(putar.ditonton)}`}
                </p>
              </div>
              <a className="btn btn-outline-primary btn-sm" href={putar.url} target="_blank" rel="noreferrer">
                <Icon name="box-arrow-up-right" /> Buka di YouTube
              </a>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
