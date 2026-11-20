'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Icon, LogoMark } from '@/components/common';
import { GEREJA, JAM_PELAYANAN } from '../content';

/* ---------------------------------------------------------------- Kembali ke atas */

/** Tombol kembali ke atas dengan cincin yang menunjukkan seberapa jauh halaman sudah digulir. */
export const KeAtas: React.FC = () => {
  const [tampil, setTampil] = useState(false);
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const keliling = 2 * Math.PI * 21;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setTampil(window.scrollY > window.innerHeight * 0.8);
      if (ring.current) ring.current.style.strokeDashoffset = String(keliling * (1 - p));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button type="button" className={`lp-top ${tampil ? 'show' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Kembali ke atas" tabIndex={tampil ? 0 : -1}>
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="21" className="trk" />
        <circle cx="24" cy="24" r="21" className="bar" ref={ring} />
      </svg>
      <Icon name="arrow-up" />
    </button>
  );
};

/* ---------------------------------------------------------------- Footer */

export const PublicFooter: React.FC = () => (
  <footer className="lp-foot">
    <div className="lp-wrap lp-foot-grid">
      <div>
        <div className="lp-foot-brand">
          <LogoMark tone="light" />
          <b>{GEREJA.nama}</b>
        </div>
        <p>{GEREJA.alamat}</p>
        <p>
          <Icon name="telephone" /> {GEREJA.telp}
          <br />
          <Icon name="envelope" /> {GEREJA.email}
        </p>
      </div>
      <div>
        <h4>Jam pelayanan sekretariat</h4>
        {JAM_PELAYANAN.map((j) => (
          <p key={j} className="lp-foot-line">
            {j}
          </p>
        ))}
      </div>
      <div>
        <h4>Ikuti kami</h4>
        <div className="lp-soc">
          {GEREJA.sosmed.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
              <Icon name={s.icon} /> {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className="lp-wrap lp-foot-bottom">© {new Date().getFullYear()} GKJ Mijen · Sistem Informasi Manajemen Gereja</div>
  </footer>
);
