import type { Metadata } from 'next';
import { JemaatDetail } from '@/features/jemaat/components';

export const metadata: Metadata = { title: 'Detail Jemaat' };

export default async function DetailJemaatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JemaatDetail id={id} />;
}
