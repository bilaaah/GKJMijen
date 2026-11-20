import type { Metadata } from 'next';
import { DetailSurat } from '@/features/portal';

export const metadata: Metadata = { title: 'Detail Surat' };

/** Next.js 15: params berupa Promise. */
export default async function DetailSuratPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DetailSurat id={id} />;
}
