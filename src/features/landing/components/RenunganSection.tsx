'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/common';
import { RENUNGAN } from '../content';

/** Lama tiap renungan tampil sebelum bergeser sendiri (milidetik). */
const DURASI_MS = 7000;

/**
 * Renungan imersif yang bergeser sendiri.
 * - Pewaktu JavaScript (bukan event animasi) supaya tetap bergeser walau animasi Windows dimatikan.
 * - Berhenti hanya saat: tombol jeda ditekan, bagian ini tidak terlihat di layar, atau tab tidak aktif.
 * - Bar ala "story" menunjukkan sisa waktu; geser jari / panah keyboard untuk pindah manual.
 */
export const RenunganSection: React.FC = () => {
  const n = RENUNGAN.length;
  const [i, setI] = useState(0);
  const [arah, setArah] = useState<1 | -1>(1);
  const [jeda, setJeda] = useState(false);
  const [terlihat, setTerlihat] = useState(false);
  const [tabAktif, setTabAktif] = useState(true);
  const secRef = useRef<HTMLElement>(null);
  const awalX = useRef<number | null>(null);
  // Waktu yang sudah berjalan untuk renungan saat ini (supaya jeda → lanjut tidak mengulang dari nol)
  const berjalan = useRef(0);
  const mulai = useRef(0);
  const iSekarang = useRef(0);

  // Mulai dari renungan "hari ini" supaya tiap hari berbeda
  useEffect(() => {
    setI(Math.floor(Date.now() / 86400000) % n);
  }, [n]);

  // Hanya berputar saat bagian ini terlihat di layar & tab browser aktif
  useEffect(() => {
    const el = secRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setTerlihat(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    const vis = () => setTabAktif(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', vis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);

  const ke = useCallback(
    (x: number, d: 1 | -1 = 1) => {
      berjalan.current = 0;
      setArah(d);
      setI(((x % n) + n) % n);
    },
    [n]
  );

  const berputar = !jeda && terlihat && tabAktif;
  iSekarang.current = i;

  // Pewaktu geser otomatis
  useEffect(() => {
    if (!berputar) return;
    mulai.current = Date.now();
    const iIni = i;
    const t = setTimeout(() => ke(iIni + 1, 1), Math.max(0, DURASI_MS - berjalan.current));
    return () => {
      clearTimeout(t);
      // Simpan waktu berjalan hanya bila masih di renungan yang sama (mis. dijeda); pindah renungan → mulai dari nol
      berjalan.current = iSekarang.current === iIni ? berjalan.current + Date.now() - mulai.current : 0;
    };
  }, [berputar, i, ke]);

  // Sorotan cahaya mengikuti kursor (lewat variabel CSS, tanpa render ulang React)
  const gerak = (e: React.PointerEvent) => {
    const el = secRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const r = RENUNGAN[i];
  const kata = r.teks.split(' ');

  return (
    <section
      ref={secRef}
      className={`lp-ayat ${berputar ? '' : 'paused'} ${arah === 1 ? 'maju' : 'mundur'}`}
      aria-roledescription="carousel"
      aria-label="Renungan singkat"
      onPointerMove={gerak}
      onPointerDown={(e) => (awalX.current = e.clientX)}
      onPointerUp={(e) => {
        if (awalX.current === null) return;
        const dx = e.clientX - awalX.current;
        awalX.current = null;
        if (Math.abs(dx) > 50) (dx < 0 ? ke(i + 1, 1) : ke(i - 1, -1));
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') ke(i + 1, 1);
        if (e.key === 'ArrowLeft') ke(i - 1, -1);
      }}
    >
      <div className="lp-ayat-rays" aria-hidden="true" />
      <div className="lp-ayat-spot" aria-hidden="true" />
      <div className="lp-ayat-dust" aria-hidden="true">
        {Array.from({ length: 18 }, (_, k) => (
          <i key={k} style={{ '--x': `${(k * 53) % 100}%`, '--d': `${9 + (k % 6) * 2}s`, '--delay': `${-(k * 1.7)}s`, '--s': `${2 + (k % 3)}px` } as React.CSSProperties} />
        ))}
      </div>

      <div className="lp-wrap lp-ayat-in">
        <p className="lp-ayat-k">Renungan hari ini</p>

        <figure key={i} className="lp-ayat-fig" aria-live="polite">
          <span className="lp-ayat-mark" aria-hidden="true">
            “
          </span>
          <blockquote aria-label={r.teks}>
            {kata.map((w, j) => (
              <span key={j} className="lp-w" style={{ '--i': j } as React.CSSProperties} aria-hidden="true">
                {w}{' '}
              </span>
            ))}
          </blockquote>
          <figcaption style={{ '--i': kata.length } as React.CSSProperties}>
            <span className="lp-ayat-line" aria-hidden="true" />
            {r.rujukan}
          </figcaption>
        </figure>

        <div className="lp-ayat-ctl">
          <button type="button" className="lp-ayat-btn" onClick={() => ke(i - 1, -1)} aria-label="Renungan sebelumnya">
            <Icon name="arrow-left" />
          </button>
          <div className="lp-stories" role="tablist">
            {RENUNGAN.map((_, k) => (
              <button key={k} type="button" role="tab" aria-selected={k === i} aria-label={`Renungan ${k + 1} dari ${n}`} onClick={() => ke(k, k >= i ? 1 : -1)}>
                <i key={k === i ? `run-${i}` : k} className={k < i ? 'full' : k === i ? 'run' : ''} style={{ animationDuration: `${DURASI_MS}ms` }} />
              </button>
            ))}
          </div>
          <button type="button" className="lp-ayat-btn" onClick={() => ke(i + 1, 1)} aria-label="Renungan berikutnya">
            <Icon name="arrow-right" />
          </button>
          <button type="button" className="lp-ayat-btn ghost" onClick={() => setJeda((x) => !x)} aria-label={jeda ? 'Lanjutkan geser otomatis' : 'Jeda geser otomatis'} aria-pressed={jeda}>
            <Icon name={jeda ? 'play-fill' : 'pause-fill'} />
          </button>
        </div>
      </div>
    </section>
  );
};
