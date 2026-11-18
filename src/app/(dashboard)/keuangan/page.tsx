import type { Metadata } from 'next';
import { KeuanganList } from '@/features/keuangan/components';

export const metadata: Metadata = { title: 'Transaksi Keuangan' };

export default function KeuanganPage() {
  return <KeuanganList />;
}
