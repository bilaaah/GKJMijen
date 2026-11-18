import type { Metadata } from 'next';
import { WartaEditor } from '@/features/jadwal-warta/components';

export const metadata: Metadata = { title: 'Ubah Warta' };

export default async function UbahWartaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <WartaEditor id={id} />;
}
