import type { Metadata } from 'next';
import { TransaksiForm } from '@/features/keuangan/components';

export const metadata: Metadata = { title: 'Ubah Transaksi' };

export default async function UbahTransaksiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TransaksiForm id={id} />;
}
