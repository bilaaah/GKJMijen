import type { Metadata } from 'next';
import { TransaksiForm } from '@/features/keuangan/components';

export const metadata: Metadata = { title: 'Catat Transaksi' };

export default function TambahTransaksiPage() {
  return <TransaksiForm />;
}
