'use client';

import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, useInView } from '@/hooks/useInView';
import { GEREJA, TENTANG } from '../content';

/** Angka yang naik perlahan dari 0 saat pertama kali terlihat. */
function CountUp({ to }: { to: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) return setN(to);
    const durasi = 1600;
    const mulai = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - mulai) / durasi);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref} aria-label={to.toLocaleString('id-ID')}>
      {n.toLocaleString('id-ID')}
    </span>
  );
}

/** Foto yang miring 3D mengikuti kursor. Jika gkjmijen.png belum ada, pakai foto gedung. */
function FotoTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [src, setSrc] = useState(TENTANG.foto);

  // Gambar yang gagal dimuat sebelum React siap tidak memicu onError: cek ulang sekali
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setSrc(TENTANG.fotoCadangan);
  }, []);

  const gerak = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse' || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const reset = () => {
    ref.current?.style.setProperty('--rx', '0deg');
    ref.current?.style.setProperty('--ry', '0deg');
  };

  return (
    <div className="lp-photo" ref={ref} onPointerMove={gerak} onPointerLeave={reset}>
      <div className="lp-photo-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} src={src} alt="Jemaat dan gedung GKJ Mijen Semarang" onError={() => src !== TENTANG.fotoCadangan && setSrc(TENTANG.fotoCadangan)} />
        <span className="lp-photo-glare" aria-hidden="true" />
      </div>
      <div className="lp-photo-badge year">
        <b>{TENTANG.tahun}</b>
        <small>Didewasakan dari {TENTANG.induk}</small>
      </div>
      <div className="lp-photo-badge motto">
        <small>Semangat kami</small>
        <b>“{TENTANG.motto}”</b>
      </div>
    </div>
  );
}

export const TentangSection: React.FC = () => (
  <>
    <section id="tentang" className="lp-sec lp-about">
      <div className="lp-wrap lp-about-in">
        <div className="lp-about-tx">
          <h2 className="lp-h2">Mengenal GKJ Mijen</h2>
          {TENTANG.paragraf.map((p, k) => (
            <p key={k}>{p}</p>
          ))}
        </div>
        <FotoTilt />
      </div>
    </section>

    <section className="lp-count" aria-label="Jumlah umat">
      <div className="lp-aurora" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="lp-floaters" aria-hidden="true">
        {Array.from({ length: 14 }, (_, k) => (
          <span
            key={k}
            style={{ '--x': `${(k * 37 + 7) % 100}%`, '--d': `${14 + (k % 5) * 3}s`, '--delay': `${-k * 2.3}s`, '--s': `${0.5 + (k % 4) * 0.25}` } as React.CSSProperties}
          />
        ))}
      </div>
      <div className="lp-count-sheen" aria-hidden="true" />
      <div className="lp-count-n">
        <CountUp to={GEREJA.jumlahUmat} />
      </div>
      <div className="lp-count-l">Jumlah umat GKJ Mijen</div>
    </section>
  </>
);
