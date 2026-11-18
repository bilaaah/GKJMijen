import type { Metadata } from 'next';
import { LaporanRekap } from '@/features/keuangan/components';

export const metadata: Metadata = { title: 'Laporan & Rekap' };

export default function LaporanPage() {
  return <LaporanRekap />;
}
