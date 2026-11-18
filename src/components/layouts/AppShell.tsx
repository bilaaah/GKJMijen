'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useMock } from '@/lib/mock/store';
import { useToast } from '../feedback/Toast';
import { LoadingSpinner } from '../feedback/LoadingSpinner';
import { ROLE_LABELS } from '@/lib/auth/roles';
import { ROUTES } from '@/lib/constants/routes';

/**
 * Kerangka halaman admin: sidebar burgundy + header + konten.
 * Mode frontend: jika belum login (data contoh), pengguna diarahkan ke /login.
 */
export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { ready, user, db, logout, setJemaatQuery } = useMock();
  const router = useRouter();
  const path = usePathname();
  const toast = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace(ROUTES.AUTH.LOGIN);
  }, [ready, user, router]);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [path]);

  // Kunci scroll halaman saat menu ponsel terbuka
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  if (!ready || !user) {
    return (
      <div className="boot">
        <LoadingSpinner label="Memuat halaman…" />
      </div>
    );
  }

  const menunggu = db.surat.filter((s) => s.status === 'diajukan').length;

  const handleLogout = () => {
    logout();
    toast('Anda telah keluar.', 'info');
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <div className={`app ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'sb-open' : ''}`.trim()}>
      <Sidebar menungguSurat={menunggu} onNavigate={() => setMobileOpen(false)} onClose={() => setMobileOpen(false)} onLogout={handleLogout} />
      <div className="sb-overlay" onClick={() => setMobileOpen(false)} />
      <div className="main">
        <Header
          userName={user.nama}
          userRole={ROLE_LABELS[user.peran]}
          onToggleSidebar={() => (window.innerWidth < 992 ? setMobileOpen((o) => !o) : setCollapsed((c) => !c))}
          onSearch={(q) => {
            setJemaatQuery(q);
            router.push(ROUTES.DASHBOARD.JEMAAT);
          }}
          onLogout={handleLogout}
          onOpenLanding={() => toast('Landing page publik belum dibuat di tahap ini.', 'info')}
        />
        <main className="content">{children}</main>
      </div>
    </div>
  );
};
