import type { Metadata } from 'next';
import { WartaList } from '@/features/jadwal-warta/components';

export const metadata: Metadata = { title: 'Warta' };

export default function WartaPage() {
  return <WartaList />;
}
