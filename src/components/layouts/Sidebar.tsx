import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.HOME },
  { label: 'Data Jemaat', href: ROUTES.DASHBOARD.JEMAAT },
  { label: 'Layanan Surat', href: ROUTES.DASHBOARD.SURAT },
  { label: 'Keuangan', href: ROUTES.DASHBOARD.KEUANGAN },
  { label: 'Jadwal & Warta', href: ROUTES.DASHBOARD.JADWAL_WARTA },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="bg-white border-end p-3" style={{ minWidth: '240px', minHeight: 'calc(100vh - 56px)' }}>
      <div className="small text-muted text-uppercase fw-bold px-3 mb-2">Menu Utama</div>
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
