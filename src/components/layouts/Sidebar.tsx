import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.HOME },
  { label: 'Data Jemaat', href: ROUTES.DASHBOARD.JEMAAT.ROOT },
  { label: 'Layanan Surat & Arsip', href: ROUTES.DASHBOARD.SURAT_ARSIP.ROOT },
  { label: 'Keuangan Gereja', href: ROUTES.DASHBOARD.KEUANGAN.ROOT },
  { label: 'Jadwal & Kegiatan', href: ROUTES.DASHBOARD.JADWAL_KEGIATAN.ROOT },
  { label: 'Warta & Pengumuman', href: ROUTES.DASHBOARD.WARTA_PENGUMUMAN.ROOT },
  { label: 'Pengguna & Hak Akses', href: ROUTES.DASHBOARD.PENGGUNA_AKSES.ROOT },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="bg-light border-end p-3" style={{ minWidth: '240px', minHeight: 'calc(100vh - 56px)' }}>
      <ul className="nav nav-pills flex-column mb-auto">
        {navItems.map((item) => (
          <li key={item.href} className="nav-item mb-1">
            <Link href={item.href} className="nav-link link-dark">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};
