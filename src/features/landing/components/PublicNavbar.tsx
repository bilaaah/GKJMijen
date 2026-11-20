'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon, LogoMark } from '@/components/common';
import { useToast } from '@/components/feedback';
import { useData } from '@/lib/data';
import { ROUTES } from '@/lib/constants/routes';
import { inisial } from '@/utils/formatters';

export const SECTIONS = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'jadwal', label: 'Jadwal' },
  { id: 'warta', label: 'Warta' },
  { id: 'siaran', label: 'Siaran' },
] as const;

interface Props {
  active: string;
  onLayananSurat: () => void;
}

/**
 * Navbar landing page.
 * - Transparan di atas hero, berubah putih setelah halaman digulir.
 * - Menu aktif mengikuti bagian yang sedang dilihat (scrollspy).
 * - Kanan: tombol Login (ke halaman login tim auth) atau nama pengguna bila sudah login.
 */
export const PublicNavbar: React.FC<Props> = ({ active, onLayananSurat }) => {
  const { user, logout } = useData();
  const router = useRouter();
  const toast = useToast();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const close = (e: MouseEvent) => menuRef.current && !menuRef.current.contains(e.target as Node) && setMenu(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const portalHref = user?.peran === 'pengurus' ? ROUTES.DASHBOARD.ROOT : ROUTES.PORTAL.ROOT;

  const keluar = () => {
    logout();
    setMenu(false);
    toast('Anda telah keluar.', 'info');
  };

  return (
    <header className={`lp-nav ${solid || open ? 'solid' : ''}`}>
      <div className="lp-wrap lp-nav-in">
        <a href="#beranda" className="lp-brand" onClick={() => setOpen(false)}>
          <LogoMark tone={solid || open ? 'maroon' : 'light'} label="Logo GKJ" />
          <span>
            <b>GKJ Mijen</b>
            <small>Gereja Kristen Jawa, Semarang</small>
          </span>
        </a>

        <nav className={`lp-links ${open ? 'open' : ''}`} aria-label="Navigasi utama">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'on' : ''} aria-current={active === s.id ? 'true' : undefined} onClick={() => setOpen(false)}>
              {s.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onLayananSurat();
            }}
          >
            Layanan Surat
          </button>
          {!user && (
            <Link href={ROUTES.AUTH.LOGIN} className="btn btn-primary lp-login-m">
              Login
            </Link>
          )}
        </nav>

        <div className="lp-nav-right">
          {user ? (
            <div className="lp-user" ref={menuRef}>
              <button type="button" className="lp-user-btn" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-haspopup="menu">
                <span className="avatar sm">{inisial(user.nama)}</span>
                <span className="lp-user-nm">{user.nama.split(' ')[0]}</span>
                <Icon name="chevron-down" />
              </button>
              {menu && (
                <div className="menu" role="menu">
                  <button type="button" role="menuitem" onClick={() => router.push(portalHref)}>
                    <Icon name="grid" /> {user.peran === 'pengurus' ? 'Panel Pengurus' : 'Portal Jemaat'}
                  </button>
                  <hr />
                  <button type="button" role="menuitem" onClick={keluar}>
                    <Icon name="box-arrow-right" /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href={ROUTES.AUTH.LOGIN} className="btn btn-primary lp-login">
              Login
            </Link>
          )}
          <button type="button" className="lp-burger" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open}>
            <Icon name={open ? 'x-lg' : 'list'} />
          </button>
        </div>
      </div>
    </header>
  );
};
