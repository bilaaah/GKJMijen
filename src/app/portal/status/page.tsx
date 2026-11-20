import { Suspense } from 'react';
import type { Metadata } from 'next';
import { StatusPermohonan } from '@/features/portal';
import { LoadingSpinner } from '@/components/feedback';

export const metadata: Metadata = { title: 'Status Permohonan' };

export default function StatusPage() {
  return (
    <Suspense fallback={<LoadingSpinner label="Memuat status…" />}>
      <StatusPermohonan />
    </Suspense>
  );
}
