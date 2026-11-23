'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Icon, Modal } from '@/components/common';
import { useData, type Kegiatan } from '@/lib/data';
import { useNow } from '@/hooks/useInView';
import { NAMA_HARI, formatHariTanggal, formatJam, parseTanggal } from '@/utils/formatters';
import { IBADAH_RUTIN } from '../content';

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** "Peran: Nama" per baris → [{peran, nama}] */
const bacaPetugas = (s: string) =>
  s
    .split('\n')
    .map((b) => b.split(':'))
    .filter((x) => x.length >= 2)
    .map(([peran, ...nama]) => ({ peran: peran.trim(), nama: nama.join(':').trim() }));

export const JadwalSection: React.FC = () => {
  const { db } = useData();
  const now = useNow(60000);
  const [pilih, setPilih] = useState<string | null>(null);
  const [buka, setBuka] = useState<string | null>(null);
  const [poster, setPoster] = useState<Kegiatan | null>(null);

  // 7 hari mulai hari ini (atau ditambatkan ke jadwal terdekat jika data di luar 7 hari saat ini)
  const hari = useMemo(() => {
    if (!now) return [];
    const tglSekarang = iso(now);
    const adaDalam7Hari = db.kegiatan.some((k) => {
      const diffHari = (parseTanggal(k.tanggal).getTime() - parseTanggal(tglSekarang).getTime()) / (1000 * 3600 * 24);
      return diffHari >= 0 && diffHari < 7;
    });

    let tanggalMulai = new Date(now);
    if (!adaDalam7Hari && db.kegiatan.length > 0) {
      const mendatang = db.kegiatan
        .filter((k) => k.tanggal >= tglSekarang)
        .sort((a, b) => a.tanggal.localeCompare(b.tanggal))[0];
      if (mendatang) {
        tanggalMulai = parseTanggal(mendatang.tanggal);
      } else {
        const terbaru = [...db.kegiatan].sort((a, b) => b.tanggal.localeCompare(a.tanggal))[0];
        if (terbaru) {
          tanggalMulai = parseTanggal(terbaru.tanggal);
        }
      }
    }

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(tanggalMulai);
      d.setDate(d.getDate() + i);
      const tgl = iso(d);
      return { tgl, d, isi: db.kegiatan.filter((k) => k.tanggal === tgl).sort((a, b) => a.jam.localeCompare(b.jam)) };
    });
  }, [db.kegiatan, now]);

  // Pilih otomatis hari pertama yang ada kegiatannya
  useEffect(() => {
    if (pilih || !hari.length) return;
    setPilih((hari.find((h) => h.isi.length) ?? hari[0]).tgl);
  }, [hari, pilih]);

  const aktif = hari.find((h) => h.tgl === pilih);
  const total = hari.reduce((n, h) => n + h.isi.length, 0);

  return (
    <section id="jadwal" className="lp-sec lp-jadwal">
      <div className="lp-wrap">
        <div className="lp-sec-head">
          <h2 className="lp-h2">Jadwal Ibadah &amp; Kegiatan</h2>
          <p>Jadwal diperbarui langsung oleh pengurus gereja. Tidak perlu login untuk melihatnya.</p>
        </div>

        <div className="lp-jadwal-grid">
          <div className="lp-rutin">
            <h3>Ibadah rutin</h3>
            <div className="lp-rutin-tbl">
              {IBADAH_RUTIN.map((r) => (
                <div key={r.label} className="lp-rutin-row">
                  <div className="lp-rutin-day">{r.label}</div>
                  <ul>
                    {r.items.map((it) => (
                      <li key={it.nama}>
                        <span className="lp-rutin-time">
                          {formatJam(it.mulai)}–{formatJam(it.selesai)}
                        </span>
                        <span>{it.nama}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="lp-agenda">
            <div className="lp-agenda-head">
              <h3>Agenda 7 hari ke depan</h3>
              <span className="muted">{total} kegiatan</span>
            </div>

            <div className="lp-days" role="tablist" aria-label="Pilih hari">
              {hari.map((h, i) => (
                <button
                  key={h.tgl}
                  type="button"
                  role="tab"
                  aria-selected={pilih === h.tgl}
                  className={`lp-day ${pilih === h.tgl ? 'on' : ''} ${h.isi.length ? 'has' : ''}`}
                  onClick={() => {
                    setPilih(h.tgl);
                    setBuka(null);
                  }}
                >
                  <small>{i === 0 ? 'Hari ini' : NAMA_HARI[h.d.getDay()].slice(0, 3)}</small>
                  <b>{h.d.getDate()}</b>
                  <span className="lp-day-dots" aria-label={`${h.isi.length} kegiatan`}>
                    {h.isi.slice(0, 3).map((k) => (
                      <i key={k.id} />
                    ))}
                  </span>
                </button>
              ))}
            </div>

            <div className="lp-agenda-list" role="tabpanel">
              {aktif && <p className="lp-agenda-date">{formatHariTanggal(aktif.tgl)}</p>}
              {aktif && aktif.isi.length === 0 && (
                <div className="lp-agenda-empty">
                  <Icon name="cup-hot" />
                  <span>Tidak ada kegiatan pada hari ini. Pilih hari lain di atas.</span>
                </div>
              )}
              {aktif?.isi.map((k) => {
                const isOpen = buka === k.id;
                const petugas = bacaPetugas(k.petugas);
                return (
                  <article key={k.id} className={`lp-ev ${isOpen ? 'open' : ''} ${/ibadah/i.test(k.nama_kegiatan) ? 'ibadah' : ''}`}>
                    <button type="button" className="lp-ev-head" onClick={() => setBuka(isOpen ? null : k.id)} aria-expanded={isOpen}>
                      <span className="lp-ev-time">{formatJam(k.jam)}</span>
                      <span className="lp-ev-tx">
                        <b>{k.nama_kegiatan}</b>
                        <small>
                          <Icon name="geo-alt" /> {k.lokasi}
                        </small>
                      </span>
                      <Icon name="chevron-down" className="lp-ev-chev" />
                    </button>
                    <div className="lp-ev-body" hidden={!isOpen}>
                      {petugas.length > 0 ? (
                        <dl>
                          {petugas.map((p, i) => (
                            <div key={i}>
                              <dt>{p.peran}</dt>
                              <dd>{p.nama}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : (
                        <p className="muted">Petugas belum diumumkan.</p>
                      )}
                      {k.url_poster && (
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setPoster(k)}>
                          <Icon name="image" /> Lihat poster
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={!!poster} onClose={() => setPoster(null)} title={poster?.nama_kegiatan} subtitle={poster ? `${formatHariTanggal(poster.tanggal)} · ${formatJam(poster.jam)}` : ''}>
        {poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster.url_poster} alt={`Poster ${poster.nama_kegiatan}`} className="poster-view" />
        )}
      </Modal>
    </section>
  );
};
