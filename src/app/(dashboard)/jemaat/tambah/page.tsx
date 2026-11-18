import type { Metadata } from 'next';
import { JemaatForm } from '@/features/jemaat/components';

export const metadata: Metadata = { title: 'Tambah Jemaat' };

export default function TambahJemaatPage() {
  return <JemaatForm />;
}
