'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '../common/Icon';
import { IconButton } from '../common/Button';
import { inisial } from '@/utils/formatters';
import { ROUTES } from '@/lib/constants/routes';

/** Breadcrumb dihitung dari alamat halaman. */
export function crumbsFor(path: string): string[] {
  const seg = path.split('/').filter(Boolean);
  const [a, b, c] = seg;
  switch (a) {
    case 'dashboard':
      return ['Dashboard'];
    case 'jemaat':
      if (!b) return ['Pelayanan', 'Data Jemaat'];
      if (b === 'tambah') return ['Data Jemaat', 'Tambah'];
      return ['Data Jemaat', c === 'ubah' ? 'Ubah' : 'Detail'];
    case 'surat':
      return b ? ['Permohonan Surat', 'Proses'] : ['Pelayanan', 'Permohonan Surat'];
    case 'keuangan':
      if (!b) return ['Keuangan', 'Transaksi'];
      if (b === 'laporan') return ['Keuangan', 'Laporan & Rekap'];
      return ['Transaksi', b === 'tambah' ? 'Catat' : 'Ubah'];
    case 'jadwal-warta':
      if (!b) return ['Jadwal & Warta', 'Kegiatan'];
      if (b === 'warta') return c ? ['Warta', c === 'tulis' ? 'Tulis' : 'Ubah'] : ['Jadwal & Warta', 'Warta'];
      return ['Kegiatan', c === 'tambah' ? 'Tambah' : 'Ubah'];
    case 'akun':
      return ['Pengaturan', 'Akun Pengguna'];
    case 'profil':
      return ['Pengaturan', 'Profil Saya'];
    default:
      return ['Admin'];
  }
}

export interface HeaderProps {
  userName: string;
  userRole?: string;
  onToggleSidebar: () => void;
  onSearch: (q: string) => void;
  onLogout: () => void;
  onOpenLanding: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userName, userRole = 'Pengurus Gereja', onToggleSidebar, onSearch, onLogout, onOpenLanding }) => {
  const path = usePathname() ?? '';
  const crumbs = crumbsFor(path);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  useEffect(() => setMenuOpen(false), [path]);

  return (
    <header className="topbar">
      <IconButton icon="layout-sidebar" label="Buka atau ciutkan menu" onClick={onToggleSidebar} />
      <nav className="crumb" aria-label="Breadcrumb">
        <span>Admin</span>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            <Icon name="chevron-right" />
            {i === crumbs.length - 1 ? <b>{c}</b> : <span>{c}</span>}
          </React.Fragment>
        ))}
      </nav>
      <form
        className="tb-search"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(q.trim());
        }}
      >
        <label className="search">
          <Icon name="search" />
          <input className="input" id="gsearch" type="search" placeholder="Cari nama jemaat…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari nama jemaat" />
        </label>
      </form>
      <div className="tb-user" ref={ref}>
        <button type="button" className="tb-user-btn" onClick={() => setMenuOpen((o) => !o)} aria-haspopup="menu" aria-expanded={menuOpen}>
          <span className="avatar">{inisial(userName)}</span>
          <span className="tb-user-tx">
            <b>{userName}</b>
            <small>{userRole}</small>
          </span>
          <Icon name="chevron-down" />
        </button>
        {menuOpen && (
          <div className="menu" role="menu">
            <Link href={ROUTES.DASHBOARD.PROFIL} role="menuitem">
              <Icon name="person" /> Profil Saya
            </Link>
            <button type="button" role="menuitem" onClick={onOpenLanding}>
              <Icon name="globe2" /> Lihat Landing Page
            </button>
            <hr />
            <button type="button" role="menuitem" onClick={onLogout}>
              <Icon name="box-arrow-right" /> Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
