import type { Metadata } from 'next';
import { JemaatList } from '@/features/jemaat/components';

export const metadata: Metadata = { title: 'Data Jemaat' };

export default function JemaatPage() {
  return <JemaatList />;
}
