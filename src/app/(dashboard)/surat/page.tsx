import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SuratList } from '@/features/surat/components';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';

export const metadata: Metadata = { title: 'Permohonan Surat' };

export default function SuratPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuratList />
    </Suspense>
  );
}
