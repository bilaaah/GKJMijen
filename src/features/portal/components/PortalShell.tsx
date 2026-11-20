'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon, LogoMark } from '@/components/common';
import { LoadingSpinner, useToast } from '@/components/feedback';
import { useMock } from '@/lib/mock/store';
import { ROUTES } from '@/lib/constants/routes';
import { inisial } from '@/utils/formatters';

const MENU = [
  { href: ROUTES.PORTAL.ROOT, label: 'Dashboard', icon: 'house' },
  { href: ROUTES.PORTAL.AJUKAN, label: 'Layanan Surat', icon: 'envelope-plus' },
  { href: ROUTES.PORTAL.STATUS, label: 'Status', icon: 'clipboard-check' },
];

const isActive = (path: string, href: string) => (href === ROUTES.PORTAL.ROOT ? path === href : path.startsWith(href));

/**
 * Kerangka semua halaman /portal (Warga Jemaat).
 * - Belum login → diarahkan ke /login?next=<halaman ini>.
 * - Pengurus → diarahkan ke panel admin.
 * - Desktop: menu di navbar atas. Ponsel: tab bar di bawah layar.
 */
export const PortalShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { ready, user, logout } = useMock();
  const router = useRouter();
  const path = usePathname() ?? '';
  const toast = useToast();
  const [menu, setMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // true saat pengguna sengaja keluar, supaya tidak diarahkan ke /login?next=
  const sedangKeluar = useRef(false);

  useEffect(() => {
    if (!ready || sedangKeluar.current) return;
    if (!user) router.replace(`${ROUTES.AUTH.LOGIN}?next=${encodeURIComponent(path)}`);
    else if (user.peran === 'pengurus') router.replace(ROUTES.DASHBOARD.ROOT);
  }, [ready, user, router, path]);

  useEffect(() => {
    setMenu(false);
    window.scrollTo(0, 0);
  }, [path]);

  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setMenu(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  if (!ready || !user || user.peran !== 'warga') {
    return (
      <div className="boot">
        <LoadingSpinner label="Memuat portal jemaat…" />
      </div>
    );
  }

  const keluar = () => {
    sedangKeluar.current = true;
    logout();
    toast('Anda telah keluar. Sampai jumpa!', 'info');
    router.push(ROUTES.HOME);
  };

  return (
    <div className="pt">
      <header className="pt-nav">
        <div className="pt-wrap pt-nav-in">
          <Link href={ROUTES.PORTAL.ROOT} className="pt-brand">
            <LogoMark tone="maroon" label="Logo GKJ" />
            <span>
              <b>GKJ Mijen</b>
              <small>Portal Jemaat</small>
            </span>
          </Link>

          <nav className="pt-links" aria-label="Menu portal">
            {MENU.map((m) => (
              <Link key={m.href} href={m.href} className={isActive(path, m.href) ? 'on' : ''} aria-current={isActive(path, m.href) ? 'page' : undefined}>
                {m.label}
              </Link>
            ))}
          </nav>

          <div className="pt-user" ref={ref}>
            <button type="button" className="pt-user-btn" onClick={() => setMenu((x) => !x)} aria-haspopup="menu" aria-expanded={menu}>
              <span className="pt-user-av">{inisial(user.nama)}</span>
              <span className="pt-user-nm">{user.nama}</span>
              <Icon name="chevron-down" />
            </button>
            {menu && (
              <div className="menu" role="menu">
                <div className="pt-menu-head">
                  <b>{user.nama}</b>
                  <small>{user.email}</small>
                </div>
                <hr />
                <Link href={ROUTES.HOME} role="menuitem">
                  <Icon name="globe2" /> Beranda gereja
                </Link>
                <button type="button" role="menuitem" onClick={keluar}>
                  <Icon name="box-arrow-right" /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="pt-wrap pt-main">{children}</main>

      <nav className="pt-tabbar" aria-label="Menu portal (ponsel)">
        {MENU.map((m) => {
          const on = isActive(path, m.href);
          return (
            <Link key={m.href} href={m.href} className={on ? 'on' : ''} aria-current={on ? 'page' : undefined}>
              <Icon name={on ? `${m.icon}-fill` : m.icon} />
              <span>{m.label === 'Layanan Surat' ? 'Ajukan' : m.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
