import { Suspense } from 'react';
import type { Metadata } from 'next';
import { KegiatanList } from '@/features/jadwal-warta/components';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';

export const metadata: Metadata = { title: 'Kegiatan' };

export default function KegiatanPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <KegiatanList />
    </Suspense>
  );
}
