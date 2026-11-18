'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';
import { Icon } from '../common/Icon';
import { Logo } from '../common/Logo';
import { IconButton } from '../common/Button';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  isActive: (path: string) => boolean;
  badge?: number;
}

const under = (base: string) => (p: string) => p === base || p.startsWith(base + '/');

export interface SidebarProps {
  menungguSurat: number;
  onNavigate: () => void;
  onClose: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ menungguSurat, onNavigate, onClose, onLogout }) => {
  const path = usePathname() ?? '';

  const groups: { label: string; items: NavItem[] }[] = [
    { label: 'UTAMA', items: [{ label: 'Dashboard', href: ROUTES.DASHBOARD.ROOT, icon: 'grid-1x2', isActive: under(ROUTES.DASHBOARD.ROOT) }] },
    {
      label: 'PELAYANAN',
      items: [
        { label: 'Data Jemaat', href: ROUTES.DASHBOARD.JEMAAT, icon: 'people', isActive: under(ROUTES.DASHBOARD.JEMAAT) },
        { label: 'Permohonan Surat', href: ROUTES.DASHBOARD.SURAT, icon: 'file-earmark-text', isActive: under(ROUTES.DASHBOARD.SURAT), badge: menungguSurat },
      ],
    },
    {
      label: 'KEUANGAN',
      items: [
        { label: 'Transaksi', href: ROUTES.DASHBOARD.KEUANGAN, icon: 'wallet2', isActive: (p) => under(ROUTES.DASHBOARD.KEUANGAN)(p) && !under(ROUTES.DASHBOARD.KEUANGAN_LAPORAN)(p) },
        { label: 'Laporan & Rekap', href: ROUTES.DASHBOARD.KEUANGAN_LAPORAN, icon: 'bar-chart', isActive: under(ROUTES.DASHBOARD.KEUANGAN_LAPORAN) },
      ],
    },
    {
      label: 'JADWAL & WARTA',
      items: [
        { label: 'Kegiatan', href: ROUTES.DASHBOARD.JADWAL_WARTA, icon: 'calendar3', isActive: (p) => under(ROUTES.DASHBOARD.JADWAL_WARTA)(p) && !under(ROUTES.DASHBOARD.WARTA)(p) },
        { label: 'Warta', href: ROUTES.DASHBOARD.WARTA, icon: 'newspaper', isActive: under(ROUTES.DASHBOARD.WARTA) },
      ],
    },
    {
      label: 'PENGATURAN',
      items: [
        { label: 'Akun Pengguna', href: ROUTES.DASHBOARD.AKUN, icon: 'person-gear', isActive: under(ROUTES.DASHBOARD.AKUN) },
        { label: 'Profil Saya', href: ROUTES.DASHBOARD.PROFIL, icon: 'person', isActive: under(ROUTES.DASHBOARD.PROFIL) },
      ],
    },
  ];

  return (
    <aside className="sb" aria-label="Menu utama">
      <div className="sb-head">
        <Logo />
        <IconButton icon="x-lg" label="Tutup menu" className="sb-close" onClick={onClose} />
      </div>
      <nav className="sb-nav">
        {groups.map((g) => (
          <div className="sb-group" key={g.label}>
            <div className="sb-label">{g.label}</div>
            {g.items.map((it) => {
              const active = it.isActive(path);
              return (
                <Link key={it.href} href={it.href} className={`sb-link ${active ? 'active' : ''}`} title={it.label} aria-current={active ? 'page' : undefined} onClick={onNavigate}>
                  <Icon name={it.icon} />
                  <span className="sb-tx">{it.label}</span>
                  {!!it.badge && <span className="sb-badge">{it.badge}</span>}
                </Link>
              );
            })}
            {g.label === 'PENGATURAN' && (
              <button type="button" className="sb-link" title="Keluar" onClick={onLogout}>
                <Icon name="box-arrow-right" />
                <span className="sb-tx">Keluar</span>
              </button>
            )}
          </div>
        ))}
      </nav>
      <div className="sb-foot">GKJ Mijen Semarang · Panel Pengurus</div>
    </aside>
  );
};
