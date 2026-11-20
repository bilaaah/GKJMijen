import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AjukanSurat } from '@/features/portal';
import { LoadingSpinner } from '@/components/feedback';

export const metadata: Metadata = { title: 'Ajukan Surat' };

/** Suspense wajib karena AjukanSurat membaca ?layanan= dan ?ulang= (useSearchParams). */
export default function AjukanPage() {
  return (
    <Suspense fallback={<LoadingSpinner label="Memuat formulir…" />}>
      <AjukanSurat />
    </Suspense>
  );
}
