import type { Metadata } from 'next';
import { KegiatanForm } from '@/features/jadwal-warta/components';

export const metadata: Metadata = { title: 'Tambah Kegiatan' };

export default function TambahKegiatanPage() {
  return <KegiatanForm />;
}
