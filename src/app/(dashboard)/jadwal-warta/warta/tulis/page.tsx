import type { Metadata } from 'next';
import { WartaEditor } from '@/features/jadwal-warta/components';

export const metadata: Metadata = { title: 'Tulis Warta' };

export default function TulisWartaPage() {
  return <WartaEditor />;
}
