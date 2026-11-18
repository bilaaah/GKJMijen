import type { Metadata } from 'next';
import { JemaatForm } from '@/features/jemaat/components';

export const metadata: Metadata = { title: 'Ubah Data Jemaat' };

export default async function UbahJemaatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JemaatForm id={id} />;
}
