import type { Metadata } from 'next';
import { SuratProses } from '@/features/surat/components';

export const metadata: Metadata = { title: 'Proses Permohonan Surat' };

export default async function ProsesSuratPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SuratProses id={id} />;
}
