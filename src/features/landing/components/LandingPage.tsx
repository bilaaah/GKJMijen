'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMock } from '@/lib/mock/store';
import { ROUTES } from '@/lib/constants/routes';
import { PublicNavbar, SECTIONS } from './PublicNavbar';
import { Hero } from './Hero';
import { TentangSection } from './TentangSection';
import { JadwalSection } from './JadwalSection';
import { WartaSection } from './WartaSection';
import { KeAtas, PublicFooter } from './LandingExtras';
import { SiaranSection } from './SiaranSection';
import { RenunganSection } from './RenunganSection';
import { LoginPerluModal } from './LoginPerluModal';

/** Halaman publik (UC01): bisa dibuka siapa saja tanpa login. */
export const LandingPage: React.FC = () => {
  const { user } = useMock();
  const router = useRouter();
  const [active, setActive] = useState<string>('beranda');
  const [perluLogin, setPerluLogin] = useState(false);

  // Scrollspy: tandai menu sesuai bagian yang sedang terlihat
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const layananSurat = () => {
    if (!user) return setPerluLogin(true);
    router.push(user.peran === 'pengurus' ? ROUTES.DASHBOARD.SURAT : ROUTES.PORTAL.AJUKAN);
  };

  return (
    <div className="lp">
      <a href="#jadwal" className="lp-skip">
        Langsung ke jadwal
      </a>
      <PublicNavbar active={active} onLayananSurat={layananSurat} />
      <main>
        <Hero onAjukan={layananSurat} />
        <TentangSection />
        <JadwalSection />
        <WartaSection />
        <SiaranSection />
        <RenunganSection />
      </main>
      <PublicFooter />
      <KeAtas />
      <LoginPerluModal isOpen={perluLogin} onClose={() => setPerluLogin(false)} />
    </div>
  );
};
