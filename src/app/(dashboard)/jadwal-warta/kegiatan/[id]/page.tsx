import type { Metadata } from 'next';
import { KegiatanForm } from '@/features/jadwal-warta/components';

export const metadata: Metadata = { title: 'Ubah Kegiatan' };

export default async function UbahKegiatanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <KegiatanForm id={id} />;
}
