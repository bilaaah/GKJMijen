import type { Metadata } from 'next';
import { LandingPage } from '@/features/landing';
import '@/styles/jemaat.css';

export const metadata: Metadata = {
  title: 'Beranda',
  description: 'Jadwal ibadah, kegiatan, dan warta Gereja Kristen Jawa Mijen Semarang.',
};

/** Landing page publik: halaman pertama yang dibuka pengunjung (tanpa login). */
export default function HomePage() {
  return <LandingPage />;
}
